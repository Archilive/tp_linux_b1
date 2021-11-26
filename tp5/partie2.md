# II. Setup Web

## 1. Install Apache

### A. Apache

🌞 **Installer Apache sur la machine `web.tp5.linux`**

- le paquet qui contient Apache s'appelle `httpd`
- le service aussi s'appelle `httpd`

```bash=
[archi@web ~]$ sudo dnf install httpd
...
Complete!
```
---

🌞 **Analyse du service Apache**

- lancez le service `httpd` et activez le au démarrage

```bash=
[archi@web ~]$ systemctl start httpd
==== AUTHENTICATING FOR org.freedesktop.systemd1.manage-units ====
Authentication is required to start 'httpd.service'.
Authenticating as: archi
Password:
[archi@web ~]$
[archi@web ~]$
[archi@web ~]$ systemctl enable httpd
==== AUTHENTICATING FOR org.freedesktop.systemd1.manage-unit-files ====
Authentication is required to manage system service or unit files.
Authenticating as: archi
Password:
==== AUTHENTICATION COMPLETE ====
Created symlink /etc/systemd/system/multi-user.target.wants/httpd.service → /usr/lib/systemd/system/httpd.service.
==== AUTHENTICATING FOR org.freedesktop.systemd1.reload-daemon ====
Authentication is required to reload the systemd state.
Authenticating as: archi
Password:
==== AUTHENTICATION COMPLETE ====
```
- isolez les processus liés au service `httpd`

```bash=
[archi@web ~]$ ps -ef | grep httpd
root        2937       1  0 05:00 ?        00:00:00 /usr/sbin/httpd -DFOREGROUND
apache      2938    2937  0 05:00 ?        00:00:00 /usr/sbin/httpd -DFOREGROUND
apache      2939    2937  0 05:00 ?        00:00:00 /usr/sbin/httpd -DFOREGROUND
apache      2940    2937  0 05:00 ?        00:00:00 /usr/sbin/httpd -DFOREGROUND
apache      2941    2937  0 05:00 ?        00:00:00 /usr/sbin/httpd -DFOREGROUND
```
- déterminez sur quel port écoute Apache par défaut

```bash=
[archi@web ~]$ sudo ss -altnp | grep httpd
LISTEN 0      128                *:80              *:*    users:(("httpd",pid=2941,fd=4),("httpd",pid=2940,fd=4),("httpd",pid=2939,fd=4),("httpd",pid=2937,fd=4))
```
- déterminez sous quel utilisateur sont lancés les processus Apache

```bash=
[archi@web ~]$ ps -ef | grep httpd
root        2937       1  0 05:00 ?        00:00:00 /usr/sbin/httpd -DFOREGROUND
apache      2938    2937  0 05:00 ?        00:00:00 /usr/sbin/httpd -DFOREGROUND
apache      2939    2937  0 05:00 ?        00:00:00 /usr/sbin/httpd -DFOREGROUND
apache      2940    2937  0 05:00 ?        00:00:00 /usr/sbin/httpd -DFOREGROUND
apache      2941    2937  0 05:00 ?        00:00:00 /usr/sbin/httpd -DFOREGROUND
```

---

🌞 **Un premier test**

- ouvrez le port d'Apache dans le firewall

```bash=
[archi@web ~]$ sudo firewall-cmd --add-port=80/tcp --permanent
[sudo] password for archi:
success
[archi@web ~]$ sudo firewall-cmd --reload
success
```
- testez, depuis votre PC, que vous pouvez accéder à la page d'accueil par défaut d'Apache
  - avec une commande `curl`

```bash=
C:\Users\Victor>curl 10.5.1.11
<!doctype html>
<html>
  <head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <title>HTTP Server Test Page powered by: Rocky Linux</title>
    <style type="text/css">
      /*<![CDATA[*/
      ...
      ...
```
  - avec votre navigateur Web

```bash=
ça fonctionne ;)
```


### B. PHP

NextCloud a besoin d'une version bien spécifique de PHP.  
Suivez **scrupuleusement** les instructions qui suivent pour l'installer.

🌞 **Installer PHP**

# ajout des dépôts EPEL
$ sudo dnf install epel-release

```bash=
[archi@web ~]$ sudo dnf install epel-release
...
Complete!
```
$ sudo dnf update

```bash=
[archi@web ~]$ sudo dnf update
Extra Packages for Enterprise Linux 8 - x86_64                                                        4.6 MB/s |  11 MB     00:02
Extra Packages for Enterprise Linux Modular 8 - x86_64                                                958 kB/s | 958 kB     00:01
Last metadata expiration check: 0:00:01 ago on Fri 26 Nov 2021 05:15:40 AM CET.
Dependencies resolved.
Nothing to do.
Complete!
```
# ajout des dépôts REMI
$ sudo dnf install https://rpms.remirepo.net/enterprise/remi-release-8.

```bash=
[archi@web ~]$ sudo dnf install https://rpms.remirepo.net/enterprise/remi-release-8.rpm
...
Complete!
```
$ dnf module enable php:remi-7.4

```bash=
[archi@web ~]$ sudo dnf module enable php:remi-7.4
...
y
y
y
Complete!
```

# install de PHP et de toutes les libs PHP requises par NextCloud
$ sudo dnf install zip unzip libxml2 openssl php74-php php74-php-ctype php74-php-curl php74-php-gd php74-php-iconv php74-php-json php74-php-libxml php74-php-mbstring php74-php-openssl php74-php-posix php74-php-session php74-php-xml php74-php-zip php74-php-zlib php74-php-pdo php74-php-mysqlnd php74-php-intl php74-php-bcmath php74-php-gmp


```bash=
[archi@web ~]$ sudo dnf install zip unzip libxml2 openssl php74-php php74-php-ctype php74-php-curl php74-php-gd php74-php-iconv php74-php-json php74-php-libxml php74-php-mbstring php74-php-openssl php74-php-posix php74-php-session php74-php-xml php74-php-zip php74-php-zlib php74-php-pdo php74-php-mysqlnd php74-php-intl php74-php-bcmath php74-php-gmp
...
y
y
y
y
Complete!
```

## 2. Conf Apache

➜ Le fichier de conf utilisé par Apache est `/etc/httpd/conf/httpd.conf`.  
Il y en a plein d'autres : ils sont inclus par le premier.

➜ Dans Apache, il existe la notion de *VirtualHost*. On définit des *VirtualHost* dans les fichiers de conf d'Apache.  
On crée un *VirtualHost* pour chaque application web qu'héberge Apache.

> "Application Web" c'est le terme de hipster pour désigner un site web. Disons qu'aujourd'hui les sites peuvent faire tellement de trucs qu'on appelle plutôt ça une "application" à part entière. Une application web donc.

➜ Dans le dossier `/etc/httpd/` se trouve un dossier `conf.d`.  
Des dossiers qui se terminent par `.d`, vous en rencontrerez plein, ce sont des dossiers de *drop-in*.  
Plutôt que d'écrire 40000 lignes dans un seul fichier de conf, on l'éclate en plusieurs fichiers la conf.  
C'est + lisible et + facilement maintenable.

Les dossiers de *drop-in* servent à accueillir ces fichiers de conf additionels.  
Le fichier de conf principal a une ligne qui inclut tous les fichiers de conf contenus dans le dossier de *drop-in*.

---

🌞 **Analyser la conf Apache**

- mettez en évidence, dans le fichier de conf principal d'Apache, la ligne qui inclut tout ce qu'il y a dans le dossier de *drop-in*

```bash=
[archi@web ~]$ sudo cat /etc/httpd/conf/httpd.conf | grep conf.d
IncludeOptional conf.d/*.conf
```

🌞 **Créer un VirtualHost qui accueillera NextCloud**

- créez un nouveau fichier dans le dossier de *drop-in*
  - attention, il devra être correctement nommé (l'extension) pour être inclus par le fichier de conf principal
- ce fichier devra avoir le contenu suivant :

```apache
<VirtualHost *:80>
  # on précise ici le dossier qui contiendra le site : la racine Web
  DocumentRoot /var/www/nextcloud/html/  

  # ici le nom qui sera utilisé pour accéder à l'application
  ServerName  web.tp5.linux  

  <Directory /var/www/nextcloud/html/>
    Require all granted
    AllowOverride All
    Options FollowSymLinks MultiViews

    <IfModule mod_dav.c>
      Dav off
    </IfModule>
  </Directory>
</VirtualHost>
```

```bash=
[archi@web conf.d]$ sudo cat virtualhost.conf
<VirtualHost *:80>
  # on précise ici le dossier qui contiendra le site : la racine Web
  DocumentRoot /var/www/nextcloud/html/

  # ici le nom qui sera utilisé pour accéder à l'application
  ServerName  web.tp5.linux

  <Directory /var/www/nextcloud/html/>
    Require all granted
    AllowOverride All
    Options FollowSymLinks MultiViews

    <IfModule mod_dav.c>
      Dav off
    </IfModule>
  </Directory>
</VirtualHost>
```

> N'oubliez pas de redémarrer le service à chaque changement de la configuration, pour que les changements prennent effet.


```bash=
[archi@web conf.d]$ systemctl restart httpd
==== AUTHENTICATING FOR org.freedesktop.systemd1.manage-units ====
Authentication is required to restart 'httpd.service'.
Authenticating as: archi
Password:
==== AUTHENTICATION COMPLETE ====
```

🌞 **Configurer la racine web**

- la racine Web, on l'a configurée dans Apache pour être le dossier `/var/www/nextcloud/html/`
- creéz ce dossier

```bash=
[archi@web ~]$ cd /var/www/
[archi@web www]$ ls
cgi-bin  html
[archi@web www]$ sudo mkdir nextcloud
[sudo] password for archi:
[archi@web www]$ ls
cgi-bin  html  nextcloud
[archi@web www]$ cd nextcloud/
[archi@web nextcloud]$ sudo mkdir html
[archi@web nextcloud]$ ls
html
```
- faites appartenir le dossier et son contenu à l'utilisateur qui lance Apache (commande `chown`, voir le [mémo commandes](../../cours/memos/commandes.md))

```bash=
[archi@web www]$ sudo chown apache /var/www/nextcloud/
[archi@web www]$ ls -la
total 4
...
drwxr-xr-x.  2 root   root    6 Nov 15 04:13 html
drwxr-xr-x.  3 apache root   18 Nov 26 06:01 nextcloud
```

> Jusqu'à la fin du TP, tout le contenu de ce dossier doit appartenir à l'utilisateur qui lance Apache. C'est strictement nécessaire pour qu'Apache puisse lire le contenu, et le servir aux clients.

🌞 **Configurer PHP**

- dans l'install de NextCloud, PHP a besoin de conaître votre timezone (fuseau horaire)
- pour récupérer la timezone actuelle de la machine, utilisez la commande `timedatectl` (sans argument)

```bash=
archi@web www]$ timedatectl
               Local time: Fri 2021-11-26 06:09:59 CET
           Universal time: Fri 2021-11-26 05:09:59 UTC
                 RTC time: Fri 2021-11-26 05:09:55
                Time zone: Europe/Paris (CET, +0100)
System clock synchronized: no
              NTP service: inactive
          RTC in local TZ: no
```
- modifiez le fichier `/etc/opt/remi/php74/php.ini` :
  - changez la ligne `;date.timezone =`
  - par `date.timezone = "<VOTRE_TIMEZONE>"`
  - par exemple `date.timezone = "Europe/Paris"`

```bash=
[archi@web www]$ sudo cat /etc/opt/remi/php74/php.ini | grep date.timezone
date.timezone = "Europe/Paris"
```

## 3. Install NextCloud

On dit "installer NextCloud" mais en fait c'est juste récupérer les fichiers PHP, HTML, JS, etc... qui constituent NextCloud, et les mettre dans le dossier de la racine web.

🌞 **Récupérer Nextcloud**

```bash
# Petit tips : la commande cd sans argument permet de retourner dans votre homedir
$ cd

# La commande curl -SLO permet de rapidement télécharger un fichier, en HTTP/HTTPS, dans le dossier courant
$ curl -SLO https://download.nextcloud.com/server/releases/nextcloud-21.0.1.zip

$ ls
nextcloud-21.0.1.zip
```

```bash=
[archi@web www]$ cd
[archi@web ~]$
[archi@web ~]$
[archi@web ~]$ curl -SLO https://download.nextcloud.com/server/releases/nextcloud-21.0.1.zip
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  148M  100  148M    0     0  5090k      0  0:00:29  0:00:29 --:--:-- 4668k
[archi@web ~]$
[archi@web ~]$
[archi@web ~]$ ls
nextcloud-21.0.1.zip
```

🌞 **Ranger la chambre**

- extraire le contenu de NextCloud (beh ui on a récup un `.zip`)
- déplacer tout le contenu dans la racine Web

```bash=
[archi@web ~]$ sudo unzip nextcloud-21.0.1.zip -d /var/www/nextcloud/html/
```

```bash=
[archi@web nextcloud]$ ls
html
[archi@web nextcloud]$ mv /var/www/nextcloud/html/nextcloud/ /var/www/nextcloud/
mv: cannot move '/var/www/nextcloud/html/nextcloud/' to '/var/www/nextcloud/nextcloud': Permission denied
[archi@web nextcloud]$ sudo mv /var/www/nextcloud/html/nextcloud/ /var/www/nextcloud/
[archi@web nextcloud]$ ls
html  nextcloud
[archi@web nextcloud]$ sudo rm -d html
[archi@web nextcloud]$ sudo mv nextcloud/ html
[archi@web nextcloud]$ ls
html
[archi@web nextcloud]$ cd html/
[archi@web html]$ ls
3rdparty  AUTHORS  console.php  core      index.html  lib  ocm-provider  ocs-provider  remote.php  robots.txt  themes   version.php
apps      config   COPYING      cron.php  index.php   occ  ocs           public.php    resources   status.php  updater
```
  - n'oubliez pas de gérer les permissions de tous les fichiers déplacés ;)

```bash=
[archi@web nextcloud]$ sudo chown apache -R html/
[archi@web nextcloud]$ ls -la html/
total 128
drwxr-xr-x. 13 apache root  4096 Apr  8  2021 .
drwxr-xr-x.  3 apache root    18 Nov 26 06:31 ..
drwxr-xr-x. 43 apache root  4096 Apr  8  2021 3rdparty
drwxr-xr-x. 47 apache root  4096 Apr  8  2021 apps
-rw-r--r--.  1 apache root 17900 Apr  8  2021 AUTHORS
drwxr-xr-x.  2 apache root    67 Apr  8  2021 config
-rw-r--r--.  1 apache root  3900 Apr  8  2021 console.php
-rw-r--r--.  1 apache root 34520 Apr  8  2021 COPYING
drwxr-xr-x. 22 apache root  4096 Apr  8  2021 core
-rw-r--r--.  1 apache root  5122 Apr  8  2021 cron.php
-rw-r--r--.  1 apache root  2734 Apr  8  2021 .htaccess
-rw-r--r--.  1 apache root   156 Apr  8  2021 index.html
-rw-r--r--.  1 apache root  2960 Apr  8  2021 index.php
drwxr-xr-x.  6 apache root   125 Apr  8  2021 lib
-rw-r--r--.  1 apache root   283 Apr  8  2021 occ
drwxr-xr-x.  2 apache root    23 Apr  8  2021 ocm-provider
drwxr-xr-x.  2 apache root    55 Apr  8  2021 ocs
drwxr-xr-x.  2 apache root    23 Apr  8  2021 ocs-provider
-rw-r--r--.  1 apache root  3144 Apr  8  2021 public.php
-rw-r--r--.  1 apache root  5341 Apr  8  2021 remote.php
drwxr-xr-x.  4 apache root   133 Apr  8  2021 resources
-rw-r--r--.  1 apache root    26 Apr  8  2021 robots.txt
-rw-r--r--.  1 apache root  2446 Apr  8  2021 status.php
drwxr-xr-x.  3 apache root    35 Apr  8  2021 themes
drwxr-xr-x.  2 apache root    43 Apr  8  2021 updater
-rw-r--r--.  1 apache root   101 Apr  8  2021 .user.ini
-rw-r--r--.  1 apache root   382 Apr  8  2021 version.php
```
- supprimer l'archive

```bash=
[archi@web nextcloud]$ cd
[archi@web ~]$ ls
nextcloud-21.0.1.zip
[archi@web ~]$ sudo rm nextcloud-21.0.1.zip
[archi@web ~]$ ls
```

## 4. Test

Bah on arrive sur la fin !

Si on résume :

- **un serveur de base de données : `db.tp5.linux`**
  - MariaDB installé et fonctionnel
  - firewall configuré
  - une base de données et un user pour NextCloud ont été créés dans MariaDB
- **un serveur Web : `web.tp5.linux`**
  - Apache installé et fonctionnel
  - firewall configuré
  - un VirtualHost qui pointe vers la racine `/var/www/nextcloud/html/`
  - NextCloud installé dans le dossier `/var/www/nextcloud/html/`

**Looks like we're ready.**

---

**Ouuu presque. Pour que NextCloud fonctionne correctement, il faut y accéder en utilisant un nom, et pas une IP.**  
On va donc devoir faire en sorte que, depuis votre PC, vous puissiez écrire `http://web.tp5.linux` plutôt que `http://10.5.1.11`.

➜ Pour faire ça, on va utiliser **le fichier `hosts`**. C'est un fichier présents sur toutes les machines, sur tous les OS.  
Il sert à définir, localement, une correspondance entre une IP et un ou plusieurs noms.  

C'est arbitraire, on fait ce qu'on veut.  
Si on veut que `www.ynov.com` pointe vers le site de notre VM, ou vers n'importe quelle autre IP, on peut.  
ON PEUT TOUT FAIRE JE TE DIS.  
Ce sera évidemment valable uniquement sur la machine où se trouve le fichier.

Emplacement du fichier `hosts` :

- MacOS/Linux : `/etc/hosts`
- Windows : `c:\windows\system32\drivers\etc\hosts`

---

🌞 **Modifiez le fichier `hosts` de votre PC**

- ajoutez la ligne : `10.5.1.11 web.tp5.linux`

```bash=
$ cat hosts
...
        10.5.1.11       web.tp5.linux

```

🌞 **Tester l'accès à NextCloud et finaliser son install'**

- ouvrez votre navigateur Web sur votre PC
- rdv à l'URL `http://web.tp5.linux`
- vous devriez avoir la page d'accueil de NextCloud
- ici deux choses :
  - les deux champs en haut pour créer un user admin au sein de NextCloud
  - le bouton "Configure the database" en bas
    - sélectionnez "MySQL/MariaDB"
    - entrez les infos pour que NextCloud sache comment se connecter à votre serveur de base de données
    - c'est les infos avec lesquelles vous avez validé à la main le bon fonctionnement de MariaDB (c'était avec la commande `mysql`)

```bash=
$ curl http://web.tp5.linux
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:--  0:00:01 --:--:--     0<!DOCTYPE html>
<html class="ng-csp" data-placeholder-focus="false" lang="en" data-locale="en" >
        <head
 data-requesttoken="O5tdW1ZFRWs7RlCKRC58xJm52AelXO/d6KpkE2qUeBo=:f68XdG4IEx98Exu4AV0Q8vv0vEP8ZbnrncwFcAT1MUw=">
                <meta charset="utf-8">
...
...
...
```
---

**🔥🔥🔥 Baboom ! Un beau NextCloud.**
