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
