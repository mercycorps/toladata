"""
This script clears out the comments in all of the po files.  Used to clear pofilter spam
that got into the files from an ill-advised use of pofilter.  If you're reading this, this file si probbly safe
to delete
"""
import os
import re
import argparse


def main():
    parser = argparse.ArgumentParser(description='Deletes comments from .po files.')
    parser.add_argument('langdir', help='Relative directory path to a language in the locale directory')
    parser.add_argument('--force', action='store_true', help='Without this flag, running the script will be a dry run.')
    args = parser.parse_args()

    for file_name in ['django', 'djangojs']:

        with open(os.path.join(args.langdir, 'LC_MESSAGES', file_name + '.po'), 'r') as fh:
            lines = fh.readlines()
        with open(os.path.join(args.langdir, 'LC_MESSAGES', file_name + '_clean.po'), 'w') as fh:
            for line in lines:
                match = re.search(r'^\#\n', line)
                if line[:2] != '# ' and match is None:
                    fh.write(line)
                else:
                    print('Omitting', line)




if __name__ == '__main__':
    main()
