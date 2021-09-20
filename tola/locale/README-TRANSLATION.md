# Overview
This document assumes familiarity with the fundamentals of the translation processes outlined in the [Django documentation on translation](https://docs.djangoproject.com/en/1.11/topics/i18n/translation/)

The general mechanics of the process to translate files is as follows:
1. On a new branch, replace the current .po files with the last professionally translated files.
2. Run the management commands `makemessages` and `makemessagesjs` to update .po files.
3. Prepare files for translation by partitioning each .po file into translated and untranslated/fuzzy portions.
4. If needed, make adjustments to the new .po files (e.g. remove fuzzy strings, remove translations that have been provided by MEL).
5. Send files to translators.
7. When the .po files come back from the translators, merge the newly translated files with the translated portion of original file.
8. Run `makemessages` and `makemessagesjs` again to ensure all strings have been translated.
9. Run `compilemessages` to create .mo files

# Background
Each language directory under tola/locale should contain a django.po and a djangojs.po file.  The django.po file contains strings marked for translation in `*.py` and `*.html` files and is created by running `./manage.py makemessages`.  The djangojs.po file contains strings marked for translation in `*.js` and `.jsx` files and is created by running `./manage.py makemessagesjs`.  The `makemessagesjs` file is a modified version of `makemessages` that has some adjustments for running on .js files and includes some output that helps validate if all the strings are being caught. Both commands will generate fuzzy strings when they can, which are best guesses at a translation for new English strings.  These fuzzy strings should never be used in the compiled messages since they are nearly always wrong.

When the files were first being translated, we were converting the .po files to .csv for the translators and re-converting the Excel file they sent back to us to a .po format.  Since then, we've found translators who can translate .po files directly, which works better.

Side note: Translate Toolkit (see Tools section below) has .csv conversion tools, but they don't quite meet our needs.  One problem is that the `po2csv` command does not include developer notes to the translators as part of the .csv output. Also, the Translate Toolkit `csv2po` command expects a particular format for the .csv input file and seems to use source string line numbers to group the output of plurals.

One additional wrinkle in the process is that we are also translating certain database fields that are used as a controlled set of options for some model fields.  To get the values from the database into the codebase where they can be seen by the native translation machinery, we've written the `makemessagesdb` command, which queries the database for those specific fields and creates dummy Python and JS code with the values marked for translation.  This dummy code is deposited in `tola/db_translations.py` and `tola/db_translations.js`.


# Tools
There are several third party tools and scripts that are essential to our translation process.
- `create_temp_translations` is a management command that will append "Translated" to the English string to more clearly display strings that have been marked for translation..  Before you ever send files to the translator, it's often helpful to have temporary translations in place to more easily identify strings that have not been marked for translation and to check the ordering of lists that are not alphabetical (e.g. Frequency of Reporting). This command will provide temporary translations for all untranslated strings.
- [POEdit](https://poedit.net/) is free desktop software that provides a nice GUI way to edit .po files.  It allows for translation updates, shows translator comments, and flags many common issues with .po files (e.g. missing spaces at the beginning or end of the translation).
- [Translate Toolkit](http://docs.translatehouse.org/projects/translate-toolkit/en/latest/index.html) is a Python library with several useful tools to manage .po files.
  - The tool used most in our process is `posplit`, which will partition .po files into fuzzy, untranslated, and translated files.
  - `pocount` will provide character and word counts for .po files, which is helpful for ensuring files that have been split or merged have the same word counts and to provide word counts to the translators.
  - There is one tool that has caused problems. `pofilter` seems to add a lot of comment lines to the .po files.  It should be explored a bit more thoroughly before being used, to see if the extra comment cruft can be avoided.
- GNU gettext is the foundational library that many of these translation tools are built on. There are two tools that we use from this library.
  - [`msgmerge`](https://www.gnu.org/software/gettext/manual/html_node/msgmerge-Invocation.html) is a GNU gettext program that allows you to specify a definition file that contains new translations and a reference file that contains up-to-date reference (English) strings.  The program will update translations for English strings it finds in the reference file with translations from the definition file.  If an English string is found in the definition file that is not in the reference file, it will be ignored.  Using the following commands would use the dev branch .po files as the reference and update them with translations from the .po files received from the translators.
  - [`msgcat`](https://www.gnu.org/software/gettext/manual/html_node/msgcat-Invocation.html#msgcat-Invocation) is used to combine .po files together.  As the name suggests, it tries to concatenate .po files and will add a diff if there are conflicting translations.  It is best used with .po files that don't have overlapping source strings.

# Sample process of getting .po files professionally translated

The steps below are a sample process for getting the translations done by professional translators.  For brevity, only one language is being considered.  Any process that involves one of the language files will need to be repeated with the other(s).

There are a few conventions used in the process below.
- `<tempdir>` refers to a temporary directory (outside of the repo) that is used to prepare the .po files.
- `<locale>` refers to the `/tola/locale/` directory where the .po and .mo files are kept.
- `<prof_trans>` refers to the directory that contains the most recently professionally translated .po files.


## Start with the last batch of professionally translated files

It's important to note first that we don't do professional translations all that often.  We may have a dozen small releases in place before we do a larger release and decide that we need to do professional translations again.  Because of this, we're constantly adding Google translated strings to the .po files and using them in releases.  We used to keep a list of these temporary strings and remove them when the time came to send another batch to the translators.  But this is tedious and easy to forget, and if forgotten, would permanently add poor translations into our .po files.

So we chose a different method starting with the Swift Hatchling release (aka bulk import).  For Hatching, we used the prior professional translation as the base and ran `makemessages` from there.  This captured all the new strings created since the last professionally translated batch and didn't require us to keep track of those strings manually.  Instead, we just needed to keep track of instances where the translated string was e.g. provided by the MEL team and should not be translated professionally.  So rather than keeping track of all the new strings, we just needed to keep track of the translations that don't need to be changed.

This does require that the professionally translated files be preserved so they can be used down the road, and we've put them into the repo for that reason.

Assuming you are at the point where you want to send files to the translators, the first steps in the process are to copy the prior translated files into their respective language directories and run `makemessages`.

Easiest to do this work on its own branch.
```
toladata$ git checkout -b update_translations
```

Copy the original .po files to the temp directory for future reference.
```bash
toladata$ cp <locale>/fr/LC_MESSAGES/django.po <tempdir>/django_fr_orig.po
toladata$ cp <locale>/fr/LC_MESSAGES/djangojs.po <tempdir>/djangojs_fr_orig.po
```

Copy the last set of professionally translated files into their respective language dirs and run `makemessages` to generate the new strings.
```bash
toladata$ cp <prof_trans>/django_fr_combined_final.po <locale>/fr/LC_MESSAGES/django.po
toladata$ cp <prof_trans>/djangojs_fr_combined_final.po <locale>/fr/LC_MESSAGES/djangojs.po
toladata$ ./manage.py makemessagesdb
toladata$ ./manage.py makemessages
toladata$ ./manage.py makemessagesjs
```

At this point, it's a good idea to check the new .po files to make sure translator comments are present for all of the new strings.  If they're not, you can go into the code and add them (or fix them if there's a problem with how they're formatted).  Once you've added/corrected the translator comments, you should rerun the `makemessages` and `makemessagesjs` commands to update the .po files. Your local directory should now contain .po files with untranslated and fuzzy-marked strings with translator comments for each one.  Now you can copy the .po files to the temp directory so you can work on them some more there.
```bash
toladata$ cp <locale>/fr/LC_MESSAGES/django.po <tempdir>/django_fr_updated.po
toladata$ cp <locale>/fr/LC_MESSAGES/djangojs.po <tempdir>/djangojs_fr_updated.po
```

Since it may take some time for the translators to send the translated files back, you may now want to copy the original files back into the locale directory in the repo and do a PR to the current development branch.  This will update the translator comments on the development branch and preserve any temporary translations you've made for testing purposes.
```bash
toladata$ cp  <tempdir>/django_fr_orig.po <locale>/fr/LC_MESSAGES/django.po
toladata$ cp <tempdir>/djangojs_fr_orig.po <locale>/fr/LC_MESSAGES/djangojs.po
```

##Prepare files for translation

Preparing the .po files for translation involves first preserving any pre-translated strings you want to keep and then spitting the files into translated and untranslated partitions.

As mentioned before, if MEL or some other trusted source has translated some of the strings, it should be noted in a translation ticket.  You can open the `django_fr_orig.po` or `djangojs_fr_orig.po` files created in the previous step to retrieve the translated strings and paste those into the new `django_fr_updated.po` or `djangojs_fr_updated.po` files.  POEdit is handy for this step.

In the past, we had been sending the full .po file with all of the translated, untranslated, and fuzzy strings to the translators, with instructions to translate only the fuzzy and untranslated strings.  Unfortunately, in one of the batches, one of the translators didn't quite get the instructions and re-translated many of the strings that had already been translated.  Now, to avoid this confusion, we send the translators just the strings that need to be translated.  The easiest way to isolate the strings that need translation is with `posplit`, which is part of the Translate Toolkit package.
```bash
toladata/<tmpdir>$ posplit django_fr_updated.po
toladata/<tmpdir>$ posplit djangojs_fr_updated.po
```

This should produce three files for each original file with `-fuzzy`, `-untranslated`, and `-translated` appended to the filename.  Both fuzzy and untranslated files will need to be sent to the translators.  Depending on what you've discussed with the translators, sending all the files separately may be acceptable. This means you would send
```bash
`django_fr_updated-fuzzy.po`
`django_fr_updated-untranslated.po`
`djangojs_fr_updated-fuzzy.po`
`djangojs_fr_updated-untranslated.po`
```

If you do need to combine the `-fuzzy` and `-untranslated` files, you can use `msgcat`.
```bash
toladata/<tmpdir>$ msgcat -o django_fr_to_translators.po django_fr_updated-fuzzy.po django_fr_updated-untranslated.po
toladata/<tmpdir>$ msgcat -o djangojs_fr_to_translators.po djangojs_fr_updated-fuzzy.po djangojs_fr_updated-untranslated.po
```

The `msgcat` command often results in an output file with an invalid format. This is usually because the two headers are different and `msgcat` isn't able to pick one.  The easiest way to check for errors is to open the file in POEdit, which will generate an error if the .po file format is invalid. If it is invalid you will need to edit the .po file in a text editor and pick one of the two headers.  See the note below on `msgcat` for additional details.

Once you have resolved this potential issue, `django_fr_to_translators.po` and `djangojs_fr_to_translators.po` will be ready to send to the translators.


## Process raw translated files
When the files come back from the translators, transfer them into the `<temp>` directory.
```bash
toladata$ cp ~/Downloads/django_fr_to_translators--done.po <tempdir>
toladata$ cp ~/Downloads/djangojs_fr_to_translators--done.po <tempdir>
```

You will need to do some quality checks on them before combining them with the translated strings:
- Check for alerts in poedit.  The translators will occasionally miss things like spaces at the beginning or end of strings.  POEdit is good at catching those and warning you about them.
- Sometimes the translators will forget to remove the fuzzy mark on strings.  In POEdit, you can use the "Needs Work" slider near the translated string to turn this off, provided that the string has actually been translated of course.
- Check any plural strings to be sure the plural value was translated along with the singular.
- Check any strings with code marks to ensure they survived the translation process and were appropriately handled by the translators.

Once you're satisfied with the new translations, they should be merged into the codebase. There are two ways to do this.  If it has been a long time since you sent the files to the translators and/or if there have been updates to the dev branch .po files that you wish to preserve, Option 1 is probably better, since it uses the dev branch .po files as a base.  If there haven't been any changes in the dev branch .po files that you need to keep and/or if there have been a lot of updates that you want to dump, Option 2 may be better because it regenerates any missing translations from scratch.

### Option 1: Use the dev branch .po files
You can use `msgmerge` to update the dev branch .po files with the new translations received from the translators.  First merge the files together, then copy the merged files from `<tempdir>` to the `<locale>` folder.
```bash
$ msgmerge -o <tempdir>/django_fr_merged.po <tempdir>/django_fr_to_translators--done.po <locale>/fr/LC_MESSAGES/django.po
$ msgmerge -o <tempdir>/djangojs_fr_merged.po <tempdir>/djangojs_fr_to_translators--done.po <locale>/fr/LC_MESSAGES/djangojs.po
$ cp <tempdir>/django_fr_merged.po <locale>/fr/LC_MESSAGES/django.po
$ cp <tempdir>/djangojs_fr_merged.po <locale>/fr/LC_MESSAGES/djangojs.po
```

Your translations should not be all done!

### Option 2: Use the -translated partition
When you generated the files to send to the translators, you generated a file with `-translated` suffix. This can be concatenated with the file you received from the translators using `msgcat `.
```bash
toladata/<tmpdir>$ msgcat -o ./django_fr_final.po django_fr_to_translators--done.po django_fr_updated-translated.po
toladata/<tmpdir>$ msgcat -o ./djangojs_fr_final.po djangojs_fr_to_translators--done.po djangojs_fr_updated-translated.po
```

You will probably run into the issue with `msgcat` producing a misformated .po file.  See the note in the next section for more information on this.

Once you have cleaned

```bash
toladata/<tmpdir>$ cp ./django_fr_final.po <locale>/fr/LC_MESSAGES/django.po
toladata/<tmpdir>$ cp ./djangojs_fr_final.po <locale>/fr/LC_MESSAGES/djangojs.po
```


## Catch remaining translations
In the time it took for the translators to translate files files, it's possible that additional code has been pushed that includes translations.  To catch these items, you should run `makemessages` and `makemessagesjs` again, just as above, and examine the updated .po files for new fuzzy and untranslated strings.


## Cleanup and Compile

You should now have django.po and djangojs.po files in both the `<locale>/fr/LC_MESSAGES/` directory, and these files should no longer contain any fuzzy or untranslated strings, even if you run the `makemessages` commands again.  The last step is to compile the .po files into a binary .mo format that Django can consume.
```bash
toladata$ ./manage.py compilemessages
```

The translation process should now be complete.


# Other notes

## `msgcat` can yield invalid .po files
The [GNU gettext documentation](https://www.gnu.org/software/gettext/manual/gettext.html#Concatenate-PO-Files) has a good description of how this happens. The header of a .po file is just a specially formatted message entry.  When `msgcat` encounters a translation that differs (whether its in an actual translation node or in the header), it includes the diff in the file output.  These look somewhat similar to git merge conflicts in that the two options are separated by a repeated string, in this case a series of "#-#-#-#-#-#-#-#-#".

When one of these appears in the header, programs that process .po files generally won't, since this is technically an error.  The easiest way to fix this is usually to just pick one of the versions of the header, assuming the properties the header is enumerating are correct, and make the correction in a plain text editor.

When the discrepancy is found in an actual translation node, there is no error and, depending on what you arrange with your translators, you may be able to leave the diff marks (#-#-#-#) in the file to help guide the translators in their work. When the files come back from the translators, you'll need to make sure they've removed the diff marks.

## Unifying translations
Because the Python and JS translations are kept in separate files, it's possible for the same string to have translations that's different between files.  If the translators are keeping a translation history, this shouldn't happen much, but it can happen.  One way to figure out if this has happened is to use `msgcat`, the GNU gettext function, to combine the django.po and djangojs.po files. As discussed above,  `msgcat` will add diff marks for any strings that have different translations in the different files.

If you send a combined file to the translators, you will receive a combined file back.  The easiest way to update the .po files is to use `msgmerge`, which will use the .po files from the translators to update the translations in a reference file that you provide.  This has been discussed in the main body of the instructions.

