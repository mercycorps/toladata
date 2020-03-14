## Converting the database to utf8mb4
These instructions are mostly adapted from this blog post
https://mathiasbynens.be/notes/mysql-utf8mb4

###3-byte UTF8 Confirmation
Confirm that the database can't accomodate 4-byte strings.  Easiest way is to try to save something that has a 4-byte character.  This might look something like this (obviously not to be done on the production server)
```
mysql> use <tola_database_name>
mysql> UPDATE indicators_indicator SET name="(𝌆)" WHERE id=1;
ERROR 1366 (HY000): Incorrect string value: '\xF0\x9D\x8C\x86)' for column 'name' at row 1
mysql>
```

###Upgrade procedure

*Save the SQL statement belowas prepScript.sql*

```
use information_schema;
SELECT concat("ALTER DATABASE `",table_schema,"` CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;") as _sql
FROM `TABLES` where table_schema like "yourDbName" group by table_schema;
SELECT concat("ALTER TABLE `",table_schema,"`.`",table_name,"` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;") as _sql
FROM `TABLES` where table_schema like "yourDbName" group by table_schema, table_name;
SELECT concat("ALTER TABLE `",table_schema,"`.`",table_name, "` CHANGE `",column_name,"` `",column_name,"` ",data_type,"(",character_maximum_length,") CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",IF(is_nullable="YES"," NULL"," NOT NULL"),";") as _sql
FROM `COLUMNS` where table_schema like "yourDbName" and data_type in ('varchar','char');
SELECT concat("ALTER TABLE `",table_schema,"`.`",table_name, "` CHANGE `",column_name,"` `",column_name,"` ",data_type," CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",IF(is_nullable="YES"," NULL"," NOT NULL"),";") as _sql
FROM `COLUMNS` where table_schema like "yourDbName" and data_type in ('text','tinytext','mediumtext','longtext');
```

Now run these commands

`mysql -u<user> -p < prepScript.sql | egrep '^ALTER' > runScript.sql`

`mysql -u<user> -p < runScript.sql`

Now update settings.secret to include this in the DB section
```
OPTIONS:
    charset: "utf8mb4"
TEST:
    CHARSET: "utf8mb4"
    COLLATION: "utf8mb4_unicode_ci"
```

*Add this to my.cnf*
```
[client]
default-character-set = utf8mb4

[mysql]
default-character-set = utf8mb4

[mysqld]
# character-set-client-handshake = FALSE # This is questionable
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci
```

Restart the MySQL server

*Check values by querying the session variables*
```
mysql> use <tola_database_name>
SHOW SESSION VARIABLES WHERE Variable_name LIKE 'character\_set\_%' OR Variable_name LIKE 'collation%';
+--------------------------+--------------------+
| Variable_name            | Value              |
+--------------------------+--------------------+
| character_set_client     | utf8mb4            |
| character_set_connection | utf8mb4            |
| character_set_database   | utf8mb4            |
| character_set_filesystem | binary             |
| character_set_results    | utf8mb4            |
| character_set_server     | utf8               |
| character_set_system     | utf8               |
| collation_connection     | utf8mb4_general_ci |
| collation_database       | utf8mb4_unicode_ci |
| collation_server         | utf8_general_ci    |
+--------------------------+--------------------+
```

`charater_set_server` and `collation_server` are both just used as defaults for database creation, so it's not important that they are utf8mb4. `character_set_system` is not modifyable and `character_set_filesystem` will always be binary.

###Confirm conversion to 4-byte utf8mb4
Try the same thing that we did at the top, it should work now
```
mysql> use <tola_database_name>
mysql> UPDATE indicators_indicator SET name="(𝌆)" WHERE id=1;
Query OK, 1 row affected (0.01 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql>
```
