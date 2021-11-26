# TP5 : P'tit cloud perso

# I. Setup DB


## 1. Install MariaDB

> Pour rappel, le gestionnaire de paquets sous les OS de la famille RedHat, c'est pas `apt`, c'est `dnf`.

🌞 **Installer MariaDB sur la machine `db.tp5.linux`**

```bash=
[archi@db ~]$ sudo dnf install mariadb-server
...
Complete!
```
🌞 **Le service MariaDB**

- lancez-le avec une commande `systemctl`

```bash=
[archi@db ~]$ systemctl start mariadb
==== AUTHENTICATING FOR org.freedesktop.systemd1.manage-units ====
Authentication is required to start 'mariadb.service'.
Authenticating as: archi
Password:
==== AUTHENTICATION COMPLETE ====
```
- exécutez la commande `sudo systemctl enable mariadb` pour faire en sorte que MariaDB se lance au démarrage de la machine

```bash=
[archi@db ~]$ sudo systemctl enable mariadb
Created symlink /etc/systemd/system/mysql.service → /usr/lib/systemd/system/mariadb.service.
Created symlink /etc/systemd/system/mysqld.service → /usr/lib/systemd/system/mariadb.service.
Created symlink /etc/systemd/system/multi-user.target.wants/mariadb.service → /usr/lib/systemd/system/mariadb.service.
```
- vérifiez qu'il est bien actif avec une commande `systemctl`

```bash=
[archi@db ~]$ systemctl status mariadb
● mariadb.service - MariaDB 10.3 database server
   Loaded: loaded (/usr/lib/systemd/system/mariadb.service; enabled; vendor preset: disabled)
   Active: active (running) since Thu 2021-11-25 17:01:36 CET; 2min 26s ago
   ...
```
- déterminer sur quel port la base de données écoute avec une commande `ss`
  - je veux que l'information soit claire : le numéro de port avec le processus qu'il y a derrière

```bash=
[archi@db ~]$ sudo ss -alntp
LISTEN      0           80                           *:3306                       *:*          users:(("mysqld",pid=5301,fd=21))
```
- isolez les processus liés au service MariaDB (commande `ps`)
  - déterminez sous quel utilisateur est lancé le process MariaDB

```bash=
[archi@db ~]$ sudo ps -ef | grep mysqld
mysql       5301       1  0 17:01 ?        00:00:00 /usr/libexec/mysqld --basedir=/usr
```

🌞 **Firewall**

- pour autoriser les connexions qui viendront de la machine `web.tp5.linux`, il faut conf le firewall
  - ouvrez le port utilisé par MySQL à l'aide d'une commande `firewall-cmd`

```bash=
[archi@db ~]$ sudo firewall-cmd --add-port=3306/tcp --permanent
success
[archi@db ~]$ sudo firewall-cmd --reload
success
```

## 2. Conf MariaDB

🌞 **Configuration élémentaire de la base**

- exécutez la commande `mysql_secure_installation`

```bash=
[archi@db ~]$ mysql_secure_installation
```
  - plusieurs questions successives vont vous être posées
  - expliquez avec des mots, de façon concise, ce que signifie chacune des questions
  - expliquez pourquoi vous répondez telle ou telle réponse (avec la sécurité en tête)

```
In order to log into MariaDB to secure it, we'll need the current
password for the root user.  If you've just installed MariaDB, and
you haven't set the root password yet, the password will be blank,
so you should just press enter here.

Je choisis d'installer un password afin de sécuriser le l'utilisateur 'root'
```

```
By default, a MariaDB installation has an anonymous user, allowing anyone
to log into MariaDB without having to have a user account created for
them.  This is intended only for testing, and to make the installation
go a bit smoother.  You should remove them before moving into a
production environment.

Quelqu'un qui ne doit pas créer de compte pour pouvoir se connecter est une énorme défaillance.
```

```
Normally, root should only be allowed to connect from 'localhost'.  This
ensures that someone cannot guess at the root password from the network.

Je garde cette option car seul les personnes ayant un user sur le réseau pourront 'tenter' de se connecter en root
```

```
By default, MariaDB comes with a database named 'test' that anyone can
access.  This is also intended only for testing, and should be removed
before moving into a production environment.

oui je l'a supprime
```

```
Reloading the privilege tables will ensure that all changes made so far
will take effect immediately.

oui pour régler un bug directement
```

---

🌞 **Préparation de la base en vue de l'utilisation par NextCloud**

```bash
# Connexion à la base de données
# L'option -p indique que vous allez saisir un mot de passe
# Vous l'avez défini dans le mysql_secure_installation
$ sudo mysql -u root -p
```

```bash=
[archi@db ~]$ sudo mysql -u root -p
[sudo] password for archi:
Enter password:
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 20
Server version: 10.3.28-MariaDB MariaDB Server

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
```

Puis, dans l'invite de commande SQL :

```sql
# Création d'un utilisateur dans la base, avec un mot de passe
# L'adresse IP correspond à l'adresse IP depuis laquelle viendra les connexions. Cela permet de restreindre les IPs autorisées à se connecter.
# Dans notre cas, c'est l'IP de web.tp5.linux
# "meow" c'est le mot de passe :D
CREATE USER 'nextcloud'@'10.5.1.11' IDENTIFIED BY 'meow';

# Création de la base de donnée qui sera utilisée par NextCloud
CREATE DATABASE IF NOT EXISTS nextcloud CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

# On donne tous les droits à l'utilisateur nextcloud sur toutes les tables de la base qu'on vient de créer
GRANT ALL PRIVILEGES ON nextcloud.* TO 'nextcloud'@'10.5.1.11';

# Actualisation des privilèges
FLUSH PRIVILEGES;
```

```sql=
MariaDB [(none)]> CREATE USER 'nextcloud'@'10.5.1.11' IDENTIFIED BY 'meow';
Query OK, 0 rows affected (0.000 sec)

MariaDB [(none)]> CREATE DATABASE IF NOT EXISTS nextcloud CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
Query OK, 1 row affected (0.001 sec)

MariaDB [(none)]> GRANT ALL PRIVILEGES ON nextcloud.* TO 'nextcloud'@'10.5.1.11';
Query OK, 0 rows affected (0.000 sec)

MariaDB [(none)]> FLUSH PRIVILEGES;
Query OK, 0 rows affected (0.000 sec)

```

## 3. Test

Bon, là il faut tester que la base sera utilisable par NextCloud.

Concrètement il va faire quoi NextCloud vis-à-vis de la base MariaDB ?

- se connecter sur le port où écoute MariaDB
- la connexion viendra de `web.tp5.linux`
- il se connectera en utilisant l'utilisateur `nextcloud`
- il écrira/lira des données dans la base `nextcloud`

Il faudrait donc qu'on teste ça, à la main, depuis la machine `web.tp5.linux`.

Bah c'est parti ! Il nous faut juste un client pour nous connecter à la base depuis la ligne du commande : il existe une commande `mysql` pour ça.

🌞 **Installez sur la machine `web.tp5.linux` la commande `mysql`**

- vous utiliserez la commande `dnf provides` pour trouver dans quel paquet se trouve cette commande

```bash=
[archi@web ~]$ dnf provides mysql
Rocky Linux 8 - AppStream                                                                             5.1 MB/s | 8.2 MB     00:01
Rocky Linux 8 - BaseOS                                                                                2.7 MB/s | 3.5 MB     00:01
Rocky Linux 8 - Extras                                                                                 22 kB/s |  10 kB     00:00
mysql-8.0.26-1.module+el8.4.0+652+6de068a7.x86_64 : MySQL client programs and shared libraries
Repo        : @System
Matched from:
Provide    : mysql = 8.0.26-1.module+el8.4.0+652+6de068a7

mysql-8.0.26-1.module+el8.4.0+652+6de068a7.x86_64 : MySQL client programs and shared libraries
Repo        : appstream
Matched from:
Provide    : mysql = 8.0.26-1.module+el8.4.0+652+6de068a7
```

```bash=
[archi@web ~]$ sudo dnf install mysql
...
Complete!
```

🌞 **Tester la connexion**

- utilisez la commande `mysql` depuis `web.tp5.linux` pour vous connecter à la base qui tourne sur `db.tp5.linux`
- vous devrez préciser une option pour chacun des points suivants :
  - l'adresse IP de la machine où vous voulez vous connectez `db.tp5.linux` : `10.5.1.12`
  - le port auquel vous vous connectez
  - l'utilisateur de la base de données sur lequel vous connecter : `nextcloud`
  - l'option `-p` pour indiquer que vous préciserez un password
    - vous ne devez PAS le préciser sur la ligne de commande
    - sinon il y aurait un mot de passe en clair dans votre historique, c'est moche
  - la base de données à laquelle vous vous connectez : `nextcloud`

```bash=
[archi@web ~]$ sudo mysql -u nextcloud -p -P 3306 -D nextcloud -h 10.5.1.12
Enter password:
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 23
Server version: 5.5.5-10.3.28-MariaDB MariaDB Server

Copyright (c) 2000, 2021, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.S
```
- une fois connecté à la base en tant que l'utilisateur `nextcloud` :
  - effectuez un bête `SHOW TABLES;`
  - simplement pour vous assurer que vous avez les droits de lecture
  - et constater que la base est actuellement vide

```bash=
mysql> SHOW TABLES;
Empty set (0.00 sec)
```

---
