# TP2 - Explorer et manipuler le système
## Partie 1 :-1: 

**🌞 Changer le nom de la machine**

- `sudo hostname node1.tp2.linux`

**🌞 Config réseau fonctionnelle**
- `ping 1.1.1.1`
``` bash
[...]
--- 1.1.1.1 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3006ms
rtt min/avg/max/mdev = 24.212/24.472/24.796/0.232 ms
```
- `ping ynov.com`
``` bash
[...]
--- ynov.com ping statistics ---
13 packets transmitted, 13 received, 0% packet loss, time 12019ms
rtt min/avg/max/mdev = 22.734/26.607/36.759/3.315 ms
```
- `ping 192.168.93.9`
``` bash
Statistiques Ping pour 192.168.93.9:
Paquets : envoyés = 4, reçus = 4, perdus = 0 (perte 0%),
Durée approximative des boucles en millisecondes :
Minimum = 0ms, Maximum = 0ms, Moyenne = 0ms
```

**🌞 Installer le paquet openssh-server**
- `sudo apt install openssh-server`
``` bash
openssh-server is already the newest version (1:8.2p1-4ubuntu0.3).
0 upgraded, 0 newly installed, 0 to remove and 89 not upgraded.
```
- `cat /lib/systemd/system/ssh.service`
``` bash
[Unit]
Description=OpenBSD Secure Shell server
Documentation=man:sshd(8) man:sshd_config(5)
After=network.target auditd.service
ConditionPathExists=!/etc/ssh/sshd_not_to_be_run

[Service]
EnvironmentFile=-/etc/default/ssh
ExecStartPre=/usr/sbin/sshd -t
ExecStart=/usr/sbin/sshd -D $SSHD_OPTS
ExecReload=/usr/sbin/sshd -t
ExecReload=/bin/kill -HUP $MAINPID
KillMode=process
Restart=on-failure
RestartPreventExitStatus=255
Type=notify
RuntimeDirectory=sshd
RuntimeDirectoryMode=0755

[Install]
WantedBy=multi-user.target
Alias=sshd.service
```
- `ls /etc/ssh/`
```bash
moduli      ssh_config.d  sshd_config.d       ssh_host_ecdsa_key.pub  ssh_host_ed25519_key.pub  ssh_host_rsa_key.pub
ssh_config  sshd_config   ssh_host_ecdsa_key  ssh_host_ed25519_key    ssh_host_rsa_key          ssh_import_id
```

**🌞 Lancer le service ssh**
- `systemctl start sshd`
``` bash
==== AUTHENTICATING FOR org.freedesktop.systemd1.manage-units ===
Authentication is required to start 'ssh.service'.
Authenticating as: archi,,, (archi)
Password:
==== AUTHENTICATION COMPLETE ===
```

**🌞 Analyser le service en cours de fonctionnement**
- `systemctl status sshd`
``` bash
● ssh.service - OpenBSD Secure Shell server
     Loaded: loaded (/lib/systemd/system/ssh.service; enabled; vendor preset: enabled)
     Active: active (running) since Mon 2021-10-25 10:43:42 CEST; 32min ago
       Docs: man:sshd(8)
             man:sshd_config(5)
    Process: 496 ExecStartPre=/usr/sbin/sshd -t (code=exited, status=0/SUCCESS)
   Main PID: 524 (sshd)
      Tasks: 1 (limit: 1105)
     Memory: 3.9M
     CGroup: /system.slice/ssh.service
             └─524 sshd: /usr/sbin/sshd -D [listener] 0 of 10-100 startups

oct. 25 10:43:41 linuxubuntu systemd[1]: Starting OpenBSD Secure Shell server...
oct. 25 10:43:42 linuxubuntu sshd[524]: Server listening on 0.0.0.0 port 22.
oct. 25 10:43:42 linuxubuntu sshd[524]: Server listening on :: port 22.
oct. 25 10:43:42 linuxubuntu systemd[1]: Started OpenBSD Secure Shell server.
oct. 25 10:51:35 node1.tp2.linux sshd[1274]: Accepted password for archi from 192.168.56.1 port 53128 ssh2
oct. 25 10:51:35 node1.tp2.linux sshd[1274]: pam_unix(sshd:session): session opened for user archi by (uid=0)
```
- `ps -e | grep sshd`
``` bash
    524 ?        00:00:00 sshd
   1274 ?        00:00:00 sshd
   1348 ?        00:00:00 sshd
```
- `sudo ss -ltpn`
``` bash
State    Recv-Q   Send-Q     Local Address:Port     Peer Address:Port   Process
LISTEN   0        4096       127.0.0.53%lo:53            0.0.0.0:*       users:(("systemd-resolve",pid=385,fd=13))
LISTEN   0        128              0.0.0.0:22            0.0.0.0:*       users:(("sshd",pid=524,fd=3))
LISTEN   0        5              127.0.0.1:631           0.0.0.0:*       users:(("cupsd",pid=424,fd=7))
LISTEN   0        128                 [::]:22               [::]:*       users:(("sshd",pid=524,fd=4))
LISTEN   0        5                  [::1]:631              [::]:*       users:(("cupsd",pid=424,fd=6))
```
- `journalctl | grep sshd`
``` bash
oct. 25 10:43:42 linuxubuntu sshd[524]: Server listening on 0.0.0.0 port 22.
oct. 25 10:43:42 linuxubuntu sshd[524]: Server listening on :: port 22.
oct. 25 10:51:35 node1.tp2.linux sshd[1274]: Accepted password for archi from 192.168.56.1 port 53128 ssh2
oct. 25 10:51:35 node1.tp2.linux sshd[1274]: pam_unix(sshd:session): session opened for user archi by (uid=0)
oct. 25 11:12:59 node1.tp2.linux polkitd(authority=local)[445]: Operator of unix-process:2120:175787 successfully authenticated as unix-user:archi to gain ONE-SHOT authorization for action org.freedesktop.systemd1.manage-unit-files for system-bus-name::1.78 [systemctl enable sshd] (owned by unix-user:archi)
oct. 25 11:13:27 node1.tp2.linux sudo[2148]:     archi : TTY=pts/0 ; PWD=/etc ; USER=root ; COMMAND=/usr/bin/systemctl enable sshd
oct. 25 11:14:04 node1.tp2.linux polkitd(authority=local)[445]: Operator of unix-process:2218:182032 successfully authenticated as unix-user:archi to gain ONE-SHOT authorization for action org.freedesktop.systemd1.manage-units for system-bus-name::1.84 [systemctl start sshd] (owned by unix-user:archi)
oct. 25 11:32:04 node1.tp2.linux sudo[2317]:     archi : TTY=pts/1 ; PWD=/home/archi ; USER=root ; COMMAND=/usr/bin/ss -l sshd
```
**🌞 Connectez vous au serveur**
- `ssh archi@192.168.93.9`
``` bash
archi@192.168.93.9 s password:
Welcome to Ubuntu 20.04.3 LTS (GNU/Linux 5.11.0-38-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

89 updates can be applied immediately.
38 of these updates are standard security updates.
To see these additional updates run: apt list --upgradable

Your Hardware Enablement Stack (HWE) is supported until April 2025.
Last login: Mon Oct 25 10:51:36 2021 from 192.168.56.1
```

**🌞 Modifier le comportement du service**
- `sudo nano /etc/ssh/sshd_config`
``` bash
[...]
archi@node1:/$ cat /etc/ssh/sshd_config
Port 1026
#AddressFamily any
#ListenAddress 0.0.0.0
#ListenAddress ::
[...]

archi@node1:/$ sudo ss -ltpn | grep sshd
LISTEN    0         128                0.0.0.0:1026             0.0.0.0:*        users:(("sshd",pid=1405,fd=3))      
LISTEN    0         128                   [::]:1026                [::]:*        users:(("sshd",pid=1405,fd=4))      
```

- `sudo systemctl restart sshd`

**🌞 Connectez vous sur le nouveau port choisi**

- `ssh -p 1026 archi@192.168.93.9`
``` bash
archi@192.168.93.9 s password:
Welcome to Ubuntu 20.04.3 LTS (GNU/Linux 5.11.0-38-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

89 updates can be applied immediately.
38 of these updates are standard security updates.
To see these additional updates run: apt list --upgradable

Your Hardware Enablement Stack (HWE) is supported until April 2025.
Last login: Mon Oct 25 10:51:36 2021 from 192.168.56.1
```

## Partie 2 :-1: 

**🌞 Installer le paquet vsftpd**

- `sudo apt install vsftpd``systemctl start vsftpd`

**🌞 Lancer le service vsftpd**

- `systemctl start vsftpd`

**🌞 Analyser le service en cours de fonctionnement**

- `sudo systemctl vsftpd`
``` bash
● vsftpd.service - vsftpd FTP server
     Loaded: loaded (/lib/systemd/system/vsftpd.service; enabled; vendor preset: enabled)
     Active: active (running) since Mon 2021-10-25 12:16:24 CEST; 12min ago
   Main PID: 1587 (vsftpd)
      Tasks: 1 (limit: 1105)
     Memory: 524.0K
     CGroup: /system.slice/vsftpd.service
             └─1587 /usr/sbin/vsftpd /etc/vsftpd.conf

oct. 25 12:16:24 node1.tp2.linux systemd[1]: Starting vsftpd FTP server...
oct. 25 12:16:24 node1.tp2.linux systemd[1]: Started vsftpd FTP server.
```
- `pidof vsftpd | xargs ps`
```
    PID TTY      STAT   TIME COMMAND
   1587 ?        Ss     0:00 /usr/sbin/vsftpd /etc/vsftpd.conf
```
- `sudo ss -ltpn`
``` bash
State      Recv-Q     Send-Q         
[...]
Local Address:Port           Peer Address:Port     Process
LISTEN     0          32                         *:21                        *:*         users:(("vsftpd",pid=1587,fd=3))
[...]
```
- `journalctl | grep vsftpd`
``` bash
oct. 25 12:16:20 node1.tp2.linux sudo[1417]:     archi : TTY=pts/1 ; PWD=/ ; USER=root ; COMMAND=/usr/bin/apt install vsftpd
oct. 25 12:16:24 node1.tp2.linux systemd[1]: Starting vsftpd FTP server...
oct. 25 12:16:24 node1.tp2.linux systemd[1]: Started vsftpd FTP server.
oct. 25 12:18:15 node1.tp2.linux sudo[2115]:     archi : TTY=pts/1 ; PWD=/ ; USER=root ; COMMAND=/usr/bin/apt install vsftpd
oct. 25 12:28:46 node1.tp2.linux sudo[2267]:     archi : TTY=pts/1 ; PWD=/etc/systemd/system ; USER=root ; COMMAND=/usr/bin/systemctl start vsftpd
```

**🌞 Connectez vous au serveur**
- `Installation de FileZilla et activation des transferts`

**🌞 Modifier le comportement du service**

- `sudo nano /etc/vsftpd.conf`
```bash 
archi@archi-node1:/etc$ sudo cat /etc/vsftpd.conf
  write_enable=YES
```

- `systemctl restart vsftpd`

- `sudo nano /etc/vsftpd.conf`
```bash
archi@archi-node1:/etc$ sudo cat /etc/vsftpd.conf
  listen_port=1500
```

- `systemctl restart vsftpd`

- `sudo nano /etc/vsftpd.conf`
```bash
archi@archi-node1:/etc$ sudo cat /etc/vsftpd.conf
  xferlog_enable=YES
  xferlog_file=/var/log/vsftpd.xfer.log
```

- `systemctl restart vsftpd`

- `sudo ss -ltnp`
```bash
  LISTEN                  0                       32                                                   *:1500                                              *:*                      users:(("vsftpd",pid=1396,fd=3))
  
```
**🌞 Connectez vous sur le nouveau port choisi**
- `transfert de fichier (FTP)`
```bash
archi@archi-node1:~$ sudo cat /var/log/vsftpd.xfer.log
  Sun Nov  7 16:07:49 2021 1 ::ffff:192.168.93.1 9 /home/archi/test_vm_tp_2_aller/Nouveau_document_texte.txt a _ i r archi ftp 0 * c
  Sun Nov  7 16:07:52 2021 1 ::ffff:192.168.93.1 0 /home/archi/test_vm_tp_2_retour/2.0 b _ o r archi ftp 0 * c
```

## Partie 3 :

- `sudo apt install netcat`

**🌞 Donnez les deux commandes pour établir ce petit chat avec netcat**

- `Sur la Virtual Machine`
```bash
archi@archi-node1:~$ nc -l 2000
````

- `Sur le Pc`
```bash
- Installer NetCat
- Aller dans le dossier NetCat
  C:\Users\Victor\Desktop>cd netcat-1.11
  
- Connection à la Virtual Machine
  C:\Users\Victor\Desktop\netcat-1.11>nc64.exe 192.168.93.9 2000
````

- `Discussion Possible !`

**🌞 Utiliser netcat pour stocker les données échangées dans un fichier**

- `Sur la Virtual Machine`
```bash
archi@archi-node1:~$ nc -l 2000 > ChatNetCat
````
**🌞 Créer un nouveau service**

- `sudo nano /etc/systemd/system/chat_tp2.service`

```bash
archi@archi-node1:~$ sudo cat /etc/systemd/system/chat_tp2.service    
[Unit]              
Description=Little chat service (TP2) 
[Service]                               
ExecStart=nc -l 2000
[Install]           
WantedBy=multi-user.target   
````

- `sudo chmod 777 /etc/systemd/system/chat_tp2.service`

- `sudo systemctl daemon-reload`
- `systemctl restart chat_tp2.service`
```bash
==== AUTHENTICATING FOR org.freedesktop.systemd1.manage-units ===
Authentication is required to restart 'chat_tp2.service'.
Authenticating as: archi,,, (archi)
==== AUTHENTICATION COMPLETE ===
```

**🌞 Tester le nouveau service**

- `systemctl status chat_tp2.service`
```bash
● chat_tp2.service - Little chat service (TP2)
     Loaded: loaded (/etc/systemd/system/chat_tp2.service; disabled; vendor preset: enabled)
     Active: active (running) since Sun 2021-11-07 22:53:56 CET; 4s ago
   Main PID: 3258 (nc)
      Tasks: 1 (limit: 1106)
     Memory: 204.0K
        CPU: 978us
     CGroup: /system.slice/chat_tp2.service
             └─3258 nc -l 2000

nov. 07 22:53:56 archi-node1.tp2.linux systemd[1]: Started Little chat service (TP2).
```

- `sudo ss -ltpn`
```bash
LISTEN                  0                       1                                              0.0.0.0:2000                                        0.0.0.0:*                      users:(("nc",pid=3258,fd=3))
```

- `journalctl -xe -u chat_tp2`
```bash
nov. 07 23:02:41 archi-node1.tp2.linux nc[3258]: test 1.0
nov. 07 23:02:42 archi-node1.tp2.linux nc[3258]: test 2.0    
```
- `journalctl -xe -u chat_tp2 -f`
