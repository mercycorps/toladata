#!/bin/bash

usage() {
    cat <<MESSAGE
    USAGE: sh mysql.sh -u USERNAME -r -f BACKUP_FILE_NAME.sql
        -u = Your username for the database.
        -r = Resets the database (drops existing one, creates a new one).
        -f = File name.  A file with this name in the ~/sqlbackups directory will be restored (.sql or .sql.gz).
        -m = Runs migrations; you should ensure env is set to the right python (e.g. with a virtualenv).
        -e = Points to the python executable so that migrations command can be run. Use of -m doesn't work.
        -s = Host machine for the database. Defaults to localhost.
        -b = Backs up the database from the -s server.
        -h = Print this help message.
MESSAGE
}


# Database credentials
user=
password=
host="localhost"
db_name="tola_activity"


backup_path="$HOME/sqlbackups"
date=$(date +"%Y-%m-%d")

restore=0
backup=0
file2restore=
resetdb=
pythonexe=
deleteoldbackups=
migrate=

# Number of days to keep backups
keep_backups_for=30 #days

while [ "$1" != "" ]; do
    case $1 in
        -h | --help )       usage
                            exit 1
                            ;;
        -u | --user )       shift
                            user=$1
                            ;;
        -p | --password )   shift
                            password=$1
                            ;;
        -s | --server )     shift
                            host=$1
                            ;;
        -b | --backup )     backup=1
                            ;;
        -m | --migrate )    migrate=1
                            ;;
        -f | --file )       shift
                            file2restore=$1
                            ;;
        -e | --exe )        shift
                            pythonexe=$1
                            ;;
        -d | --del )        shift
                            deleteoldbackups=1
                            ;;
        -r | --reset )      resetdb=1
                            ;;
        * )                 usage
                            exit 1
    esac
    shift
done

# prints a horizontal line
function hr(){
  printf '=%.0s' {1..80}
  printf "\n"
}

# delete old backups of type sql.gz
function delete_old_backups() {
  echo "Deleting $backup_path/*.sql.gz older than $keep_backups_for days"
  find $backup_path -type f -name "*.sql.gz" -mtime +$keep_backups_for -exec rm {} \;
  # delete old files of type .sql
  find $backup_path -type f -name "*.sql" -mtime +$keep_backups_for -exec rm {} \;
  # find $backup_path/* -mtime +$keep_backups_for -exec rm {} \;
}

if [ $backup -eq 1 ]
then
    echo "backing db $backup"
    #mysqldump --user=$user --password=$password --host=$host $db_name > $backup_path/$db_name-$date.sql
    #mysqldump --user=$user --password --host=$host $db_name > $backup_path/$host-$db_name-$date.sql
    mysqldump --no-tablespaces --user=$user --password --host=$host $db_name > $backup_path/$host-$db_name-$date.sql
else
    echo "NOT backingup db at $host"
fi
sleep 0.5

# if resetdb variable is not empty
if [ ! -z "$resetdb" ]
then
    echo "dropping db $db_name at localhost"
    mysql -h $host -u $user -p <<< "drop database $db_name"
    echo "creating db $db_name at localhost"
    mysql -h $host -u $user -p <<< "create database $db_name CHARACTER SET utf8 COLLATE utf8_general_ci"
fi

sleep 1

# if file2restore variable is not empty
if [ ! -z "$file2restore" ]
then

    # uncompress the file if needed
    import_file=$file2restore
    if [[ $backup_path/$file2restore =~ \.gz$ ]]; then
        gunzip $backup_path/$file2restore
        import_file=${file2restore:0:(${#file2restore}-3)}
    fi

    # restore the database
    echo "Restoring $file2restore"
    mysql -h $host -u $user -p "$db_name" < "$backup_path/$import_file"

    # recompress the file if needed
    if [ ${import_file} != $file2restore ]; then
        gzip $backup_path/$import_file
    fi

fi

sleep 0.5

# if file exists
if [ -f 'manage.py' ]
then

    if [ ! -z "$migrate" ]
    then
        /usr/bin/env python manage.py migrate
    fi

    # if pythonexe variable is not empty
    if [ ! -z "$pythonexe" ]
    then
        $pythonexe manage.py migrate
    fi
fi

# Delete files older than 30 days
if [ ! -z "$deleteoldbackups" ]
then
    hr;
    delete_old_backups;
fi

