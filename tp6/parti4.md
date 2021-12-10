# Partie 4 : Scripts de sauvegarde

## I. Sauvegarde Web

🌞 **Ecrire un script qui sauvegarde les données de NextCloud**

- le script crée un fichier `.tar.gz` qui contient tout le dossier de NextCloud
- le fichier doit être nommé `nextcloud_yymmdd_hhmmss.tar.gz`
- il doit être stocké dans le répertoire de sauvegarde : `/srv/backup/`
- le script génère une ligne de log à chaque backup effectuée
  - message de log : `[yy/mm/dd hh:mm:ss] Backup /srv/backup/<NAME> created successfully.`
  - fichier de log : `/var/log/backup/backup.log`
- le script affiche une ligne dans le terminal à chaque backup effectuée
  - message affiché : `Backup /srv/backup/<NAME> created successfully.`

```bash=
[archi@web /]$ sudo mkdir /var/log/backup
[archi@web /]$ sudo nano /var/log/backup/backup.log
```

```bash=
[archi@web srv]$ sudo cat /srv/backup.sh
[sudo] password for archi:
name=("/srv/backup/nextcloud_$(date +"%y%m%d_%H%m%S").tar.gz")
cd /var/www
/usr/bin/tar -cvzf "$name" nextcloud/ &> /dev/null

echo "Backup /srv/backup/"$name" created successfully."

log_date=&(date +"[%y/%m/%d %H:%m:%S]")
log="${log_date} Backup /srv/backup/"$name" created successfully."
echo "${log}" >> /var/log/backup/backup.log
```

🌞 **Créer un service**

- créer un service `backup.service` qui exécute votre script
- ainsi, quand on lance le service avec `sudo systemctl start backup`, une backup est déclenchée

```bash=
[archi@web /]$ sudo cat /etc/systemd/system/backup.service
[Unit]
Description=Save file /var/www/nextcloud into /srv/backup/

[Service]
ExecStart=/usr/bin/bash /srv/backup.sh
Type=oneshot

[Install]
WantedBy=multi-user.target
```

```bash=
[archi@web /]$ sudo systemctl start backup
```
🌞 **Vérifier que vous êtes capables de restaurer les données**

- en extrayant les données
- et en les remettant à leur place

```bash=
[archi@web /]$ cat /var/log/backup/backup.log
 Backup /srv/backup//srv/backup/nextcloud_211210_161226.tar.gz created successfully.
```

```bash=
[archi@web ~]$ ls /srv/backup
nextcloud_211210_161226.tar.gz  test  test2  test45
[archi@web ~]$ sudo tar -xf /srv/backup/nextcloud_211210_161226.tar.gz
[archi@web ~]$ ls
nextcloud
[archi@web ~]$ ls nextcloud/html/
3rdparty  config       core      index.html  occ           ocs-provider  resources   themes
apps      console.php  cron.php  index.php   ocm-provider  public.php    robots.txt  updater
AUTHORS   COPYING      data      lib         ocs           remote.php    status.php  version.php
```

🌞 **Créer un *timer***

- un *timer* c'est un fichier qui permet d'exécuter un service à intervalles réguliers
- créez un *timer* qui exécute le service `backup` toutes les heures

```bash=
[archi@web ~]$ sudo nano /etc/systemd/system/backup.timer
[archi@web ~]$ sudo cat /etc/systemd/system/backup.timer
[Unit]
Description=Lance backup.service à intervalles réguliers
Requires=backup.service

[Timer]
Unit=backup.service
OnCalendar=hourly

[Install]
WantedBy=timers.target
```
Activez maintenant le *timer* :

```bash
[archi@web ~]$ sudo systemctl daemon-reload
[archi@web ~]$ sudo systemctl start backup.timer
[archi@web ~]$ sudo systemctl enable backup.timer
Created symlink /etc/systemd/system/timers.target.wants/backup.timer → /etc/systemd/system/backup.timer.
```

Enfin, on vérifie que le *timer* a été pris en compte, et on affiche l'heure de sa prochaine exécution :

```bash
[archi@web ~]$ sudo systemctl list-timers
NEXT                         LEFT         LAST                         PASSED    UNIT                         ACTIVATES
Fri 2021-12-10 17:00:00 CET  15min left   n/a                          n/a       backup.timer                 backup.service
...
```

## II. Sauvegarde base de données

🌞 **Ecrire un script qui sauvegarde les données de la base de données MariaDB**
