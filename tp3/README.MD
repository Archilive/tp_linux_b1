# TP 3 : A little script

## I. Script carte d'identité

Vous allez écrire **un script qui récolte des informations sur le système et les affiche à l'utilisateur.** Il s'appellera `idcard.sh` et sera stocké dans `/srv/idcard/idcard.sh`.

📁 **Fichier [`/srv/idcard/idcard.sh`](https://github.com/Archilive/tp_linux/blob/main/tp3/srv/idcard/idcard.sh)** 

🌞 Vous fournirez dans le compte-rendu, en plus du fichier, **un exemple d'exécution avec une sortie**, dans des balises de code.


```bash=
archi@archi-VirtualBox:~$ sudo bash /srv/idcard/idcard.sh
Machine name : archi-VirtualBox
OS Ubuntu and kernel version is 21.10 (Impish Indri)
IP : 192.168.93.255
RAM : 99Mi RAM restante sur 971Mi
Disque : 3,1G space left
Top 5 processes by RAM usage :
   - 7.2 xfwm4
   - 6.8 /usr/lib/xorg/Xorg
   - 4.4 /usr/bin/python3
   - 3.7 /usr/lib/x86_64-linux-gnu/xfce4/panel/wrapper-2.0
   - 3.7 /usr/lib/x86_64-linux-gnu/xfce4/panel/wrapper-2.0
Listening ports :
   - 53 : systemd-resolve
   - 22 : sshd
   - 631 : cupsd
Here's your random cat : https://cdn2.thecatapi.com/images/MjA4MzcyNw.jpg
```

<img src="https://cdn2.thecatapi.com/images/MjA4MzcyNw.jpg">

# II. Script youtube-dl

**Un petit script qui télécharge des vidéos Youtube.** Vous l'appellerez `yt.sh`. Il sera stocké dans `/srv/yt/yt.sh`.

📁 **Le script [`/srv/yt/yt.sh`](https://github.com/Archilive/tp_linux/blob/main/tp3/srv/yt/yt.sh)**

📁 **Le fichier de log `/var/log/yt/downloads.log`**

🌞 Vous fournirez dans le compte-rendu, en plus du fichier, **un exemple d'exécution avec une sortie**, dans des balises de code.

```bash
archi@archi-VirtualBox:/$ cat /var/log/yt/downloads.log
[11/22/21 16:51:21] Video https://www.youtube.com/watch?v=lTTajzrSkCw was downloaded. File path : /srv/yt/downloads/Funny rubbit's 10 sec video/Funny rubbit's 10 sec video.mp4
```

```
archi@archi-VirtualBox:/srv/yt$ sudo bash yt.sh https://www.youtube.com/watch?v=lTTajzrSkCw
Video https://www.youtube.com/watch?v=lTTajzrSkCw was downloaded.
Path : /srv/yt/downloads/Funny rubbit's 10 sec video/Funny rubbit's 10 sec video.mp4
```

```bash
archi@archi-VirtualBox:/srv/yt$ sudo bash yt.sh https://www.youtube.com/watch\?v\=azeaeazzdzt
ERROR: Incomplete YouTube ID azeaeazzdzt. URL https://www.youtube.com/watch?v=azeaeazzdzt looks truncated.
```

```bash
archi@archi-VirtualBox:/srv/yt$ sudo bash yt.sh https://www.youtube
WARNING: Could not send HEAD request to https://www.youtube: <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: Hostname mismatch, certificate is not valid for 'www.youtube'. (_ssl.c:1129)>
ERROR: Unable to download webpage: <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: Hostname mismatch, certificate is not valid for 'www.youtube'. (_ssl.c:1129)> (caused by URLError(SSLCertVerificationError(1, "[SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: Hostname mismatch, certificate is not valid for 'www.youtube'. (_ssl.c:1129)")))
```

# III. MAKE IT A SERVICE

📁 **Le script [`/srv/yt/yt-v2.sh`](https://github.com/Archilive/tp_linux/blob/main/tp3/srv/yt/yt-v2.sh)**

📁 **Fichier `/etc/systemd/system/yt.service`**

```bash
archi@archi-VirtualBox:/srv/yt$ cat /etc/systemd/system/yt.service
[Unit]
Description=YTB DownLoad

[Service]
ExecStart=sudo bash /srv/yt/yt-v2.sh

[Install]
WantedBy=multi-user.target
```

```bash=
archi@archi-VirtualBox://srv/yt$ systemctl status yt
● yt.service - YTB DownLoad
     Loaded: loaded (/etc/systemd/system/yt.service; disabled; vendor preset: enabled)
     Active: active (running) since Mon 2021-11-22 21:32:20 CET; 6s ago
   Main PID: 2106 (sudo)
      Tasks: 3 (limit: 1106)
     Memory: 1.5M
        CPU: 14ms
     CGroup: /system.slice/yt.service
             ├─2106 sudo bash /srv/yt/yt-v2.sh
             ├─2107 bash /srv/yt/yt-v2.sh
             └─2113 sleep 3

nov. 22 21:32:20 archi-VirtualBox systemd[1]: Started YTB DownLoad.
nov. 22 21:32:20 archi-VirtualBox sudo[2106]:     root : PWD=/ ; USER=root ; COMMAND=/usr/bin/bash /srv/yt/yt-v2.sh
nov. 22 21:32:20 archi-VirtualBox sudo[2106]: pam_unix(sudo:session): session opened for user root by (uid=0)
nov. 22 21:32:20 archi-VirtualBox sudo[2107]: Waiting for link in links.txt
nov. 22 21:32:23 archi-VirtualBox sudo[2107]: Waiting for link in links.txt
nov. 22 21:32:26 archi-VirtualBox sudo[2107]: Waiting for link in links.txt
```
```bash
archi@archi-VirtualBox://srv/yt$ journalctl -xe -u yt
nov. 22 21:45:07 archi-VirtualBox sudo[2676]: Video https://www.youtube.com/watch?v=QohH89Eu5iM was downloaded.
nov. 22 21:45:07 archi-VirtualBox sudo[2676]: File path : /srv/yt/downloads/5 Second Countdown HD/5 Second Countdown HD.mp4
```
