# Tola Activity

**The build status of the dev branch is: [![Build Status](https://travis-ci.org/mercycorps/TolaActivity.svg?branch=dev)](https://travis-ci.org/mercycorps/TolaActivity)**

TolaActivity is a software tool that is used to track program performance
of development work across the globe.  It includes the ability to set periodic
targets for each program indicator, track those targets over time, and generate
filterable IPTT reports on demand.  It also includes a flexible Results Framework
builder to enable hierarchical organization of indicators.

# Creating a local TolaActivity instance

Running a local instance of TolaActivity makes development much faster.
These instructions should get you up and running with a minimum of fuss if
you have [macOS](#macos) or one of the many [Ubunten](#ubuntu). If they do
not, we accept pull requests updating it. :)

Through all of these instructions, it is __very important__ that a plain-text editor is used to edit the text files.
For instance, TextEdit or Notepad are fine, MS Word is emphatically not.  Even some plain-text editors default
to a rich text format, so make sure you are saving plain text.

## Install software dependencies

At this itme, TolaActivity requires both Python 2 and Python 3. It has been thoroughly tested with versions
2.7 and 3.6, and lightly tested with version 3.8.  Python 2 is necessary satisfy a dependency in a node module.
These instructions assume MySQL is being used as Django's datastore.  Version 5.7 has been thoroughly tested, but version 8 should work as well.

### macOS

On macOS, you can use Homebrew to install much of the software needed for TolaActivity.
To see if you have Homebrew installed, run `which brew` at the command line.  If you don't get a file path,
it is not installed and you should run the following command from the command line.
```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Before starting the install process, you may also want to request a copy of the _settings.secret.yml_ file and
a dump of an existing TolaActivity database.


To see if you have Python 2, Python 3, or MySQL installed, run the follwoing commands:
```bash
$ python2 --version
$ python3 --version
$ mysql --version
```

At the Terminal command line:
```bash
$ brew install python@3
$ brew install python@2
$ brew install mysql@5.7
```

Add these lines to ~/.bash_profile (you may need to create it)
```text
export PATH="/usr/local/opt/openssl/bin:$PATH"
export LIBRARY_PATH="/usr/local/opt/openssl/lib/:$LIBRARY_PATH"
export PATH="/usr/local/opt/mysql@5.7/bin:$PATH"

export LDFLAGS="-L/usr/local/opt/openssl/lib"
export CPPFLAGS="-I/usr/local/opt/openssl/include"
export LDFLAGS="-L/usr/local/opt/mysql@5.7/lib"
export CPPFLAGS="-I/usr/local/opt/mysql@5.7/include"
```

Back at the command line:
```bash
$ source ~/.bash_profile
$ brew install mysql-utilities
$ brew install py2cairo pango
$ pip3 install virtualenv
```

You should now also start the mysql server:
```bash
brew services start mysql@5.7
```

Now that you've installed the necessary macOS software dependencies, you can move down to the section __Install and configure the TolaActivity source files__.


### Windows
For Windows installations, install the [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10) using a Ubuntu distribution as the base.  Once this has successfully been installed, launch a Powershell window and proceed with the Ubuntu instructions below.


### Ubuntu

You will need both Python2 and Python3 installed.  Python2 is required for an npm package that has not yet
made the transition. TolaData has been tested on Python3.6 but should work on later versions as well.
```bash
$ python2 --version
$ python3 --version
```

If one of these doesn't yield a Python installation, install it.
```bash
$ sudo apt update
$ sudo apt install python2
$ sudo apt install python3
```

Now install some other linux packages that will be needed later.
```bash
$ sudo apt install mysql-server libmysqlclient-dev mysql-client
$ sudo apt install libsasl2-dev libssl-dev
$ sudo apt-get install python3-dev libffi-dev
$ sudo apt-get install libxml2-dev libxmlsec1-dev libxmlsec1-openssl pkg-config
$ sudo apt-get install libcairo2-dev libpango1.0-dev
$ sudo apt install virtualenv
```

Note that some users have had to manually build the libxml2 library, as mentioned in the [python-xmlsec documentation](https://xmlsec.readthedocs.io/en/latest/install.html).

```bash
wget http://xmlsoft.org/sources/libxml2-2.9.1.tar.gz
tar -xvf libxml2-2.9.1.tar.gz
cd libxml2-2.9.1
./configure && make && make install
```

Note that some users have had to manually build the libxml2 library, as mentioned in the [python-xmlsec documentation](https://xmlsec.readthedocs.io/en/latest/install.html)

```bash
wget http://xmlsoft.org/sources/libxml2-2.9.1.tar.gz
tar -xvf libxml2-2.9.1.tar.gz
cd libxml2-2.9.1
./configure && make && make install
```

You should now also start the mysql server:
```bash
sudo service mysql start
```

Now you're ready to install and configure the TolaData source files.


## Install and configure the TolaActivity source files

### Install the source files and the python libraries
All operating systems should now be ready to install TolaActivity source files and do some OS-independent installations.
```bash
$ git clone https://github.com/mercycorps/toladata.git
$ cd toladata
$ virtualenv -p python3.8 venv
$ source venv/bin/activate  # you should see '(venv)' appear on the left of your command prompt
$ pip install -r requirements.txt
```

You may need to perform additional installations if you receive an error installing the requirements.txt. For example:
* _Failed building wheel for xmlsec_. Run command `brew install libxmlsec1`

### Modify the config file
If you have a copy of the _settings.secret.yml_ file, place it in the TolaActivity/config
directory.  In Windows, you will need to copy it from where the file is stored on your hard drive.  You may want to modify the file per the instructions below (not with an MS Office product!) before moving it to the TolaActivity folder.  To move the file, if the file is in your Downloads directory, you could use a command that looks something like this:
```bash
$ cp /mnt/c/Users/<your_username>/Downloads/settings.secret.yml config
```

If you don't have a copy of the settings.secret.py file, then copy the sample file thusly:
```
$ cp config/sample-settings.secret.yml config/settings.secret.yml
```


Open the _config/settings.secret.yml_ file with a plain-text editor.

1. Find the node named, "DATABASES" and set the
database `NAME`, `USER`, and `PASSWORD` as appropriate. If you have a dump of an existing TolaActivity database, set the `NAME` to "tola_activty". The result should resemble the following:

    ```yaml
    DATABASES:
      default:
        ENGINE: "django.db.backends.mysql"
        NAME: "<db_name>" # "tola_activity"
        USER: "<db_username>" # "tola"
        PASSWORD: "<password>" # "SooperSekritWord"
        HOST: "localhost"
        PORT: ""
    ```

    The rest of the instructions assume that you've used the values above.

1. Create the log directory
    ```bash
    $ mkdir /User/<username>/logs
    ```
    
    Modify the LOGFILE entry so it points to the file in the _logs_ directory you just created.
    For example:
    ```yaml
    LOGFILE: '/home/<username>/logs/django_error.log'
    ```


## Set up Django's MySQL backing store
Log into mysql and create the database, create the user, and grant permissions with the following commands using the same database `Name`, `User`, and `Password` used in the _settings.secret.yml_ file.
```sql
$ mysql -u root  # Ubuntu users will need to use sudo for this line
mysql> CREATE DATABASE tola_activty;
mysql> CREATE USER 'tola'@'localhost' IDENTIFIED BY 'SooperSekritWord';
mysql> GRANT ALL ON tola.* TO 'tola'@'localhost';
mysql> exit

```

## Set up Django

If you have a copy of an existing Tola database, you can load through the mysql command using the path to the .sql file.  When prompted, you should provide the database password.
```bash
$ mysql -u tola -p tola_activity < /path/to/file.sql
```
Run the database migrations, even if you just uploaded the .sql file.

```bash
$ python manage.py migrate
```

### If you get an error during migration

During migration, you might see an error like the following:

```bash
Applying social_django.0005_auto_20160727_2333
  django.db.utils.OperationalError: (1071, 'Specified key was too long; max key length is 1000 bytes')
```

The *social_django* app creates a *unique_together* relationship between two rows that concatenate
to a value too long for the destination row. To fix this, manually change the following two fields:

* social_auth_association.server_url to varchar(100)
* social_auth_association.handle to varchar(100)

You can address this through the MySQL CLI:

```bash
$ mysql -u tola -p tola_activity  # you will be prompted for the database password
mysql> ALTER TABLE social_auth_association MODIFY server_url varchar(100) NOT NULL;
mysql> ALTER TABLE social_auth_association MODIFY handle varchar(100) NOT NULL;
mysql> exit
```

...then re-run the migration as normal:

```bash
$ python manage.py migrate
```


## Start the server:

Start the Python server with the `runserver` command.
```bash
$ python manage.py runserver
Performing system checks...

System check identified 1 issue (0 silenced).
March 20, 2018 - 11:51:55
Django version 1.11.2, using settings 'tola.settings.local'
Starting development server at http://0.0.0.0:8000/
Quit the server with CONTROL-C.
```

## Try launching Tola in your browser
In your browser, navigate to `localhost:8000`.  You should see a TolaActivity login screen.  You should also be able
login through the Google+ link.

## Creating a local user
If you are not logging in through the Google+ link, you will need to create a local user so you can log in.
You can use the Python Shell or MySQL to create a local superuser and add the additional data that is required.

### Using Python Shell
```bash
$ ./manage.py shell
>>> from django.contrib.auth.models import User
>>> from workflow.models impot TolaUser
>>> me = User.objects.create(username="<your_email>", email="<your_email">, is_superuser=True, is_staff=True)
>>> me.set_password(<password>)
>>> me.save()
>>> TolaUser.objects.create(user=me, name="<first_last>")
>>> exit()
```

### Using MySQL
Use the `createsuperuser` command and enter in a username and password to be used to login. When it asks for an email, you can just hit the Enter key to skip the question (email not needed to login).
```bash
$ python manage.py createsuperuser
Username: <my_username>
Email address: 
Password: <my_password>
Password (again): <my_password>
Superuser created successfully.

``` 

Log into MySQL and get the id of the record you just added from the auth.user table using the following query:

```bash
$ mysql -u tola -p tola_activity
mysql> SELECT id, username FROM auth_user ORDER BY id DESC LIMIT 5;
+----+----------+
| id | username |
+----+----------+
|  1 | myname   |
+----+----------+
```

Note the value for `id` to use in the next step.

Insert the `id` value from the `auth_user` table into the `user_id` field of the `workflow_tolauser` table (Name can be first and/or last name, username, or anything else):

```bash
mysql> INSERT INTO workflow_tolauser (name, privacy_disclaimer_accepted, user_id, language) VALUES ("<My Name>", 1, "<id>", "en");
mysql> exit
```

Restart the Tola Activity server

```bash
$ python manage.py runserver
Performing system checks...

System check identified no issues (0 silenced).
March 26, 2018 - 23:38:10
Django version 1.11.2, using settings 'tola.settings.local'
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

You should now be able to login using the username and password fields of the login screen.  Once you have logged in,
you will be taken to the home page.


# For Developers

## Front-end development setup and dev server

Tola uses Webpack and `npm` installed packages in `node_modules` to build javascript bundles.
During development, you will need to run the webpack development server to have the latest JS
bundles available, and to re-generate the bundles if you modify any JS handled by Webpack.

Directions for installing `npm` can be found below. It can also be installed via homebrew on macOS

```bash
$ brew install npm (sudo apt install npm )
```

### Install all `node_module` package dependencies using `npm`

```bash
$ npm run install:dev
```

Note: You made need to periodiclly run this after doing a `git pull` if `package.json` has been
updated with new dependencies. This is similar to running `pip install -r requements.txt` if
the `requirements.txt` has been updated.

### Start the webpack development server

```bash
$ npm run watch
```

This should be done along side `./manage.py runserver`

### Run JS unit tests

```bash
$ npm test
```

It's also possible to run the tests in "watch" mode

```bash
$ npm test -- --watch
```
or
```bash
$ npm run test:watch
```

### Build bundles for production

When you are ready to deploy to an external server, you will need to build and check-in the
production ready bundles. These are generated with:

```bash
$ npm run build:prod
```

or use the alias

```bash
$ npm run build
```

## Installing and running the front-end harness

*See also the [front-end architecture roadmap](https://github.com/mercycorps/TolaActivity/wiki/Proposal-for-front-end-architecture).*

This is *optional* if you are not doing significant front-end development. You can bypass the frontend build by dropping selectors into `/path/to/project/tola/static/css/app.css`.

### Installation & Startup:

1. Globally install [npm](https://www.npmjs.com). Here are [general instructions](https://docs.npmjs.com/getting-started/installing-node#install-npm--manage-npm-versions) to do so. On my Mac I prefer to install it via [Homebrew](https://www.dyclassroom.com/howto-mac/how-to-install-nodejs-and-npm-on-mac-using-homebrew)
2. Install local dependencies:
    ```bash
    $ cd /path/to/project/
    $ npm install
    ```
    This will install all necessary node modules into `node_modules` at the project root.
3. Start a watch task that will copy necessary libraries and compile static files while you work:
    ```bash
    $ cd /path/to/project/
    $ npm start
    ```
    You can also configure PyCharm to run this task in the background:
    1. Select __Run__ → __Edit Configurations...__
    2. __Add new configuration__ (__⌘-n__ or click the __+__ button)
    3. Choose __npm__ in the wee popup
    4. PyCharm should automagically select the correct __package.json__: `/path/to/project/package.json`
    5. Choose the __Command__ `start`

npm will compile a single global css file at `/path/to/project/tola/static/css/tola.css`. This file includes the entire Bootstrap library (previously in `bootstrap.min.css` and `bootstrap-multiselect.min.css`), our custom selectors (previously in `app.css`), and overrides to Bootstrap (previously in `bootstrap_overrides.css`)



### Other tips:

1. __Never edit the compiled css (`tola.css`) directly.__ Any manual changes to compiled css files will be overwritten the next time the css is regenerated. They are theoretically retrievable via Git but see #3, below. Remember: you can always bypass the harness by dropping css selectors directly into `app.css`.

2. But seriously, you should just put your css into a .scss file & compile it properly. __Valid css is also valid scss.__ If you’re not sure where to write a selector, append it to the __end__ of the master scss file: `/path/to/project/scss/tola.scss`.

3. Please commit your compiled css to GitHub, preferably in the same commit as your edits to our scss files.

4. There is no need to resolve merge conflicts in compiled css. Resolve them in the scss files first, then regenerate your css and accept all changes from the right (HEAD) side.

5. Suggestions for Frontend coding practices are forthcoming.


