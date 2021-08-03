### Overview
This document assumes familiarity with the fundamentals of the translation processes outlined in the [Django documentation on translation](https://docs.djangoproject.com/en/1.11/topics/i18n/translation/)

The mechanics of the process to translate files is as follows:
1. Run Django's `makemessages` utilities to update .po files
2. If needed, use the `parse_po` script to create .csv files that contain 'fuzzy' and untranslated strings
3. Send files to translators
4. If needed, recompile .po files based on .csv files returned by translators
5. Run Django `compilemessages` utility to create .mo files

### Background
Each language directory under tola/locale should contain a django.po and a djangojs.po file.  The django.po file contains strings marked for translation in `*.py` and `*.html` files and is created by running `./manage.py makemessages`.  The djangojs.po file contains strings marked for translation in `*.js` files and is created by running `./manage.py makemessagesjs`.  The `makemessagesjs` file is a modified version of `makemessages` that has some adjustments for running on .js files and some validation output that helps validate if the correct data is being output.

At the moment, there are two utilities used to process the .po files used for translation.  The built-in Django makemessages and compilemessages utilities are used to create/update .po files and to compile them into the binary .mo files that can be consumed by the system.  Unfortunately, many of the translators that we use cannot work directly with .po files, and so we provide them with .csv files instead.  The `parse_po.py` script was written to convert the .po files to .csv and back, and is located in the scripts directory.

Side note: there's a fairly well-developed set of translation tools called Translate Toolkit that may be helpful down the road, however, at the moment, it doesnt' quite meet our needs.  One problem is that the `po2csv` command does not include developer notes to the translators as part of the .csv output.  These notes are critical for accurate translation of the strings, so `parse_py.py` was written to enable .csv output.  Also, the Translate Toolkit `csv2po` command expects a particular format for the .csv input file that the parse_po.py script does not produce.  csv2po seems to use the line numbers to group the output of plurals, which is why the format is different.  It might be helpful in the future to modify the parse_po.py script to be compatible with the Translate Toolkit.

The Django `makemessages` and `makemessagesjs` commands do a good job of capturing untranslated strings and for identifying strings that may have a close match already in the translation list.  When Django identifies new strings with a close match, it uses the match as the translation and marks the translation as 'fuzzy'. It is important that the translators look at the 'fuzzy' matches to ensure they are accurate, since some versions of "close" are not.

The sample process below assumes the French translations are being done by an agency that needs a .csv file while the Spanish translations are being done by an agency that can work directly with .po files.

###Prepare files for translation
```
TolaActivity$ git checkout -b update_translations

# make copies of current files, just to keep them handy
TolaActivity$ cp tola/locale/fr/LC_MESSAGES/django{,_old}.po
TolaActivity$ cp tola/locale/fr/LC_MESSAGES/djangojs{,_old}.po
TolaActivity$ cp tola/locale/es/LC_MESSAGES/django{,_old}.po
TolaActivity$ cp tola/locale/es/LC_MESSAGES/djangojs{,_old}.po

TolaActivity$ ./manage.py makemessages -i node_modules
TolaActivity$ ./manage.py makemessagesjs

TolaActivity$ python scripts/parse_po.py tola/locale/fr/LC_MESSAGES/django.po
TolaActivity$ python scripts/parse_po.py tola/locale/fr/LC_MESSAGES/djangojs.po

# give yourself a rollback point in case you need it later
TolaActivity$ git add .
TolaActivity$ git commit -m "New .po and .csv files created"
```

Send the the two files, django.po and djangojs.po, to the translators (or the .csv versions if they need those)

###Process raw translated files
When the files come back, assuming they are in your Downloads folder, do the following
```
mv ~/Downloads/django.po tola/locale/es/LC_MESSAGES/
mv ~/Downloads/djangojs.po tola/locale/fr/LC_MESSAGES/
mv ~Downloads/django.csv tola/locale/es/LC_MESSAGES/
mv ~Downloads/djangojs.csv tola/locale/fr/LC_MESSAGES/
```

There is a high probability that the .csv file will have a non-UTF8 encoding.  parse_po.py does not yet support decoding non-UTF8 files, so it might be necessary to run the file through a Google Sheet or perhaps through Slack, in oder to get the file in UTF-8 format.  In fact, it may be desirable to have the translators deliver something in Google Sheets to they are responsible for that level of quality assurance.  Once you are confident you have a UTF-8 file, you can run the following.

```bash
./scripts/parse_po.py  tola/locale/fr/LC_MESSAGES/django.csv
./scripts/parse_po.py  tola/locale/fr/LC_MESSAGES/djangojs.csv
```

###Catch remaining translations
In the time it took for the translators to translate files files, it's possible that additional code has been pushed that includes translations.  To catch these items, you should run makemessages and makemessagesjs again, just as above, and examine the updated .po files for new fuzzy and untranslated strings.  These are usually translated internally.


###Cleanup and Compile

You should now have django.po and djangojs.po files in both the 'fr/LC_MESSAGES/' and the 'es/LC_MESSAGES/' directories, and these files should no longer contain any fuzzy or untranslated strings, even if you run the makemessages commands again.  You can now delete all other files in those two directories (.mo, .csv, django_old.po, etc...).

The last step is to compile the .po files into a binary .mo format that Django can consume.
```bash
TolaActivity$ ./manage.py compilemessages
```


The translation process should now be complete.


## New process
Create a single file to send to translators
- get files from last known professionally translated po files
- run make message commands (including js and db)
- posplit
- msgcat untranslated and fuzzy.  Could result in invalid header and fuzzy translations that combine two different translations from js and py files

When the translations come back
- Check for alerts in poedit
- Remove fuzzy if the translators didn't
- Remove filter all regular comments (there will be some if you use filter)
- msgcat file returned from the translator with the translated file from the posplit used before sending the files
- Will probably need to remove the headers using a text editor because they will conflict
- makemessages
- msgmerge using updated po files as refs and processed translator files as def
-
