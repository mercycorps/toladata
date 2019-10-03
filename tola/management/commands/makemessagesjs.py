"""
A command to pull strings out of JS files as the default makemessages misses a ton of strings.

Source:
https://medium.com/@hugosousa/hacking-djangos-makemessages-for-better-translations-matching-in-jsx-components-1174b57a13b1

This also hardcodes a number of arguments that would otherwise have to be specified each run. For example:

./manage.py makemessages -d djangojs --ignore=node_modules --ignore=venv --ignore=tola/static --ignore=test --ignore=build
"""
import collections
import os
import re

from django.core.management.commands import makemessages


DIRECTORIES_TO_IGNORE = [
    'node_modules',
    'tola/static',
    'test',
    'build',
    'venv',
    'configurabledashboard',
    'jest.config.js',
    'webpack.prod.js',
    'webpack.common.js',
    'webpack.dev.js',
]


class Command(makemessages.Command):
    """
    This is a wrapper for the makemessages command and
    it is used to force makemessages call xgettext with the language
    provided as input
    The solution is really hacky and takes advantage of the fact
    that in makemessages TranslatableFile process()
    the options in command.xgettext_options are appended to the end
    of the xgettext command.
    """
    def add_arguments(self, parser):
        parser.add_argument(
            '--language',
            '-lang',
            default='Python',
            dest='language',
            help='Language to be used by xgettext',
        )
    
        super(Command, self).add_arguments(parser)

    def handle(self, *args, **options):
        # set language (defaulting to python, even for JS)
        language = options.get('language')
        self.xgettext_options.append('--language={lang}'.format(
            lang=language
        ))

        # Hardcoded values

        options['domain'] = 'djangojs'
        options['ignore_patterns'] = DIRECTORIES_TO_IGNORE
        options['extensions'] = ['js', 'jsx']

        # keep the pot file around until parsing it for stats
        orig_keep_pot = options['keep_pot']
        options['keep_pot'] = True

        try:
            super(Command, self).handle(*args, **options)

            self.print_i18n_js_stats()
        finally:
            if not orig_keep_pot:
                self.remove_potfiles()

    def js_file_stats(self):
        gettext_pattern = r'n?p?gettext|gettext_noop'
        translator_comment_pattern = r'Translators:'

        js_file_str_counts = collections.defaultdict(int)
        js_file_comment_counts = collections.defaultdict(int)

        file_list = self.find_files(".")
        for js_file in file_list:  # list of TranslatableFiles
            with open(js_file.path) as f:
                whole_file = f.read()
                i18n_strs_count = len(re.findall(gettext_pattern, whole_file))
                translator_comment_count = len(re.findall(translator_comment_pattern, whole_file))

                js_file_path = js_file.path[2:]  # remove './' off js file path
                js_file_str_counts[js_file_path] += i18n_strs_count
                js_file_comment_counts[js_file_path] += translator_comment_count

        return js_file_str_counts, js_file_comment_counts

    def pot_file_stats(self):
        pot_file_str_counts = collections.defaultdict(int)
        pot_file_comment_counts = collections.defaultdict(int)

        # self.locale_paths can contain duplicates, so prevent the same .pot file from being read twice
        seen_pot_files = set()

        if self.locale_paths:
            for locale_path in self.locale_paths:
                potfile = os.path.join(locale_path, '%s.pot' % str(self.domain))
                if not os.path.exists(potfile) or potfile in seen_pot_files:
                    continue
                with open(potfile) as f:
                    file_lines = f.readlines()
                    comment = False
                    for line in file_lines:
                        if line == '\n':
                            comment = False
                            continue

                        if line.startswith('#. '):
                            comment = True

                        if line.startswith('#: '):
                            js_file_name = line[3:].split(':')[0]
                            pot_file_str_counts[js_file_name] += 1

                            # Count the single comment for all the JS files
                            if comment:
                                pot_file_comment_counts[js_file_name] += 1

                    seen_pot_files.add(potfile)
        return pot_file_str_counts, pot_file_comment_counts

    def print_i18n_js_stats(self):
        """
        There was some trouble parsing out all of the strings marked for translation from JS files
        so print out some stats of found strings as a sanity check
        """
        pot_file_str_counts, pot_file_comment_counts = self.pot_file_stats()
        js_file_str_counts, js_file_comment_counts = self.js_file_stats()

        self.stdout.write('\n')

        # assume JS file scan is "more robust", so iterate those items
        for file_name, count in js_file_str_counts.items():
            js_count = js_file_str_counts.get(file_name, 0)
            pot_count = pot_file_str_counts.get(file_name, 0)

            js_comment_count = js_file_comment_counts.get(file_name, 0)
            pot_comment_count = pot_file_comment_counts.get(file_name, 0)

            if js_count == 0 and pot_count == 0:
                continue

            out_str = '{file_name}: i18n strs in .pot/.js: [{pot_count}/{js_count}]'.format(
                file_name=file_name,
                pot_count=pot_count,
                js_count=js_count,
            )

            if js_count == pot_count:
                self.stdout.write(self.style.SUCCESS(out_str))
            else:
                self.stdout.write(self.style.WARNING(out_str))

            out_str = '{file_name}: Translator comments in .pot/.js: [{pot_comment_count}/{js_comment_count}]'.format(
                file_name=file_name,
                pot_comment_count=pot_comment_count,
                js_comment_count=js_comment_count,
            )

            if js_comment_count == pot_comment_count:
                self.stdout.write(self.style.SUCCESS(out_str))
            else:
                self.stdout.write(self.style.WARNING(out_str))
