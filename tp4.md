# TP4 : Une distribution orientée serveur

🌞 **Choisissez et définissez une IP à la VM**

```bash=
[archi@localhost ~]$ cat /etc/sysconfig/network-scripts/ifcfg-enp0s8
TYPE=Ethernet
BOOTPROTO=static
NAME=enp0s8
DEVICE=enp0s8
ONBOOT=yes
IPADDR=10.250.1.10
NETMASK=255.255.255.0
```
```bash=
[archi@localhost ~]$ ip a
3: enp0s8: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 08:00:27:42:2e:f9 brd ff:ff:ff:ff:ff:ff
    inet 10.250.1.10/24 brd 10.250.1.255 scope global noprefixroute enp0s8
       valid_lft forever preferred_lft forever
    inet6 fe80::a00:27ff:fe42:2ef9/64 scope link
       valid_lft forever preferred_lft forever
```
---

➜ **Connexion SSH fonctionnelle**

🌞 **Vous me prouverez que :**

```bash=
[archi@localhost ~]$ systemctl status sshd
● sshd.service - OpenSSH server daemon
   Loaded: loaded (/usr/lib/systemd/system/sshd.service; enabled; vendor preset: enabled)
   Active: active (running) since Tue 2021-11-23 16:00:47 CET; 21min ago
     Docs: man:sshd(8)
           man:sshd_config(5)
 Main PID: 26606 (sshd)
    Tasks: 1 (limit: 4935)
   Memory: 6.1M
   CGroup: /system.slice/sshd.service
           └─26606 /usr/sbin/sshd -D -oCiphers=aes256-gcm@openssh.com,chacha20-poly1305@openssh.com,aes256-ctr,aes256-cbc,aes128-gcm@>

Nov 23 16:00:47 localhost.localdomain systemd[1]: Starting OpenSSH server daemon...
Nov 23 16:00:47 localhost.localdomain sshd[26606]: Server listening on 0.0.0.0 port 22.
Nov 23 16:00:47 localhost.localdomain sshd[26606]: Server listening on :: port 22.
Nov 23 16:00:47 localhost.localdomain systemd[1]: Started OpenSSH server daemon.
Nov 23 16:15:53 localhost.localdomain sshd[82140]: Accepted password for archi from 10.250.1.1 port 52889 ssh2
Nov 23 16:15:53 localhost.localdomain sshd[82140]: pam_unix(sshd:session): session opened for user archi by (uid=0)
```

```bash=
[archi@localhost ~]$ cat /home/archi/.ssh/id_rsa
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAACFwAAAAdzc2gtcn
NhAAAAAwEAAQAAAgEAsN0zHH8Gnq3gr3mO0WOdjYZNPccEm79f2zafCFDTFOsjGf6a6Gx3
Bp/82Ixi4Joo51S4ZZlC5AMQ0WP1JrT5DSO7jOEi8hsTI/20P52mfzJgtXqKCQ+53E6ikX
rJa9VLzak1lAEEpyfYRiFItKyC3xvZ1Snj9UWh1vAOxP67Jl89uPq3XkLt+BKz6Q7WRjyY
zuJKrEZjgKUaK63DpG0eBLavWbJJk2iuv4/F+aswv0ockcBa77sICgdUXDXsvsqCChAEZf
ImfatZAw819GmEUBiGJYNNF0HIkNmec9tVxP3moc6P84M26UtKLHQQ77IsgWE3bgC2AESG
cOahevb3SyWHA87yEI2DqXKrCo6uHMpU9q7W6Nc0RzxHJQyvmHumHbCLakQ5ordhyVTYve
f6JADkjZ6yIBvR1TPmtvGVnjxPBxMWawyxfeZiBlUURlxVxh26EnNkc6m1otm4iRGE89IA
Y9SYHbwXUQCHcBuiW4zP/h8LPXFzwq2gHmLBMPv7afcgDy5Ot+Df2ywHqggGUxYIxjUFcy
AwFhMRFVN1BwN+R9aGr5QUM02p8PjJUlBdqT5r7m60AqMId3C+DvFfiKqvq8fN0UHpjtAd
FAfqvEPgRnMaZ8Nu7SnJFTZEqYgtXba7tw88b4Tglc+h8OxuLD7y0j2S3WguGitFpG+N6Z
MAAAdQ85gO4POYDuAAAAAHc3NoLXJzYQAAAgEAsN0zHH8Gnq3gr3mO0WOdjYZNPccEm79f
2zafCFDTFOsjGf6a6Gx3Bp/82Ixi4Joo51S4ZZlC5AMQ0WP1JrT5DSO7jOEi8hsTI/20P5
2mfzJgtXqKCQ+53E6ikXrJa9VLzak1lAEEpyfYRiFItKyC3xvZ1Snj9UWh1vAOxP67Jl89
uPq3XkLt+BKz6Q7WRjyYzuJKrEZjgKUaK63DpG0eBLavWbJJk2iuv4/F+aswv0ockcBa77
sICgdUXDXsvsqCChAEZfImfatZAw819GmEUBiGJYNNF0HIkNmec9tVxP3moc6P84M26UtK
LHQQ77IsgWE3bgC2AESGcOahevb3SyWHA87yEI2DqXKrCo6uHMpU9q7W6Nc0RzxHJQyvmH
umHbCLakQ5ordhyVTYvef6JADkjZ6yIBvR1TPmtvGVnjxPBxMWawyxfeZiBlUURlxVxh26
EnNkc6m1otm4iRGE89IAY9SYHbwXUQCHcBuiW4zP/h8LPXFzwq2gHmLBMPv7afcgDy5Ot+
Df2ywHqggGUxYIxjUFcyAwFhMRFVN1BwN+R9aGr5QUM02p8PjJUlBdqT5r7m60AqMId3C+
DvFfiKqvq8fN0UHpjtAdFAfqvEPgRnMaZ8Nu7SnJFTZEqYgtXba7tw88b4Tglc+h8OxuLD
7y0j2S3WguGitFpG+N6ZMAAAADAQABAAACAHu9hzD8vojuZjDe/0kIRQbrW8dJIrRFJK+e
e4253rTX/msFcyQCHxSHgsOPFO7HbK7M22ZZ4C7e5jlZkf9OxqCmy2U5btWsk6uuqRmJFy
APAxJ1dXX5hrPYYG0gVyQWyz5MkKvIOpUoj2whhVjDCZ1HQxSchlzoJt7Wfb7d6dpi8DAn
WXudoBjcHPuF4eyqIM8+C7iUVrF+0dyVajf0D/iESBKdZlS3/OsRkBWp7CUpmOtwhS8M0A
cUMbWCFO03idu4cRtSXBO4ekJltf4WhPf08IX2Y01OPSD64J12a3+zlFTIzHY264g1oOOR
IPhS1EiA1+MipDNzvgvnkDsT5teFYUqEL9FfIQYU9JH3nj3nicexrjsQK22UUsp5bVdjFz
zphwDe7Gjo3kfK3DLVzQbkjUHnZxG4B3VTEnHoMZuhkzSsbgtnTgfb0uneKhxZKP7N7jXg
t3lSOOuffEMPrKgQP55kJH+rDtVCXn6gnbfl3RXz8YX445PZ+jc/GqiORoJrmBpn2+buWA
FytrhmbSLTWJVpuKuHJtBc4L2jB+u+O/MjVoNiOzA88E0cOwHD2g2VXezaUoJQBizTWdhb
Mt3IUnJG3PgAm6GvBKNkPgqT4EH0xnnGTqXdsGie60CcXPn76BKhQ82BbERMU6788bPAiq
ufrvJac3C8PA+56hGBAAABAE8S0R1WsvkdCHu1LP/o18fkGUhJ/jd0BCRHlyClfZxT1s0b
WJNGoOVeGEv6XMRZfF0PbuLaAeisFQTX7mwLH1CARKj9R+BJRXOF5OJZ0Z5SuumOE64qKG
80FgbrjLiAtHoqf0bmZT9KY1UiUnUpDzl/yiEIse8Rdb/f0lkmer5pvUn6Dyj/6KtTJov+
phjIfmg6nEOp6C3JNXzAANOoMF2JB0TSXJ6DVo31Pc8EENLcm53izIHv0RoWvaoFpKuFwO
Jq4R63FOcR/TMzYR56nBst61b2ZFJZ7Fu3QJ41qmyBtqqvlI8pYwiMRZ/XkJGgnLBvxSy9
wZlROwzYnb8RwSEAAAEBAOso/Sy3L0pjXYuCmyPSBzBjhb0nk1laVDx2FY4FnfoSQz9L7p
Am78qhOUiYZMD9bcVAqFDkbTUZGDVqJJXQdR5AEigQ6HlRASSpInJ5URq7rkk3S7YAx4xi
toUEg+A8cH3wGQbSKllUjhc74MI9Eeb4oUlG791BCmyjMlOvAZQa/CTpYob+1/bu9FrZsd
CRvgHubULHP+lfyTn3VMpZWVzASAO47Hx1Row458J+IRzatQqha0ZYltJ/5jJNPpd53xwC
qJN60d31b4H14D3iTvHyrfEVe3akCAg98SioeENtFBG013ahzDMr4o8JSPNvid3azDv2nH
IhIc6yYRulRaMAAAEBAMCJqiVJp85VwRgS+sAO0Nntmq/cD+8hoKM5HYp06VRzZ2FCGucS
5p4wsQyb1gDdsBUo/Cs/1co9p7JmeqvKf8XffLP6gD7co71DNald3S+G+fouNBCBErlT6v
dgGh5ed7Ae8zdYohMnKuLAx2MQVMWXyEtZ/RQLV8/+xNXSVnuaCEjrlKVmnbq8TympLyYS
bEvZRAH0HY1oKliAq2j8Jr/psmCm6QgKYEg3ba8c88rn9PFJdiLjn/g9AtHSXWYYWiWN7u
WJ4B2m+OaJ5kRz8X8oizyKKwzw4c0z1E6INRE4fdqGSi7HLSCnPw1GnAsf/ti3emnjy+Kc
dmMR0qA1q1EAAAAbYXJjaGlAbG9jYWxob3N0LmxvY2FsZG9tYWlu
-----END OPENSSH PRIVATE KEY-----
```

```bash=
[archi@localhost ~]$ cat /home/archi/.ssh/id_rsa.pub
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCw3TMcfwaereCveY7RY52Nhk09xwSbv1/bNp8IUNMU6yMZ/probHcGn/zYjGLgmijnVLhlmULkAxDRY/UmtPkNI7uM4SLyGxMj/bQ/naZ/MmC1eooJD7ncTqKReslr1UvNqTWUAQSnJ9hGIUi0rILfG9nVKeP1RaHW8A7E/rsmXz24+rdeQu34ErPpDtZGPJjO4kqsRmOApRorrcOkbR4Etq9ZskmTaK6/j8X5qzC/ShyRwFrvuwgKB1RcNey+yoIKEARl8iZ9q1kDDzX0aYRQGIYlg00XQciQ2Z5z21XE/eahzo/zgzbpS0osdBDvsiyBYTduALYARIZw5qF69vdLJYcDzvIQjYOpcqsKjq4cylT2rtbo1zRHPEclDK+Ye6YdsItqRDmit2HJVNi95/okAOSNnrIgG9HVM+a28ZWePE8HExZrDLF95mIGVRRGXFXGHboSc2RzqbWi2biJEYTz0gBj1JgdvBdRAIdwG6JbjM/+Hws9cXPCraAeYsEw+/tp9yAPLk634N/bLAeqCAZTFgjGNQVzIDAWExEVU3UHA35H1oavlBQzTanw+MlSUF2pPmvubrQCowh3cL4O8V+Iqq+rx83RQemO0B0UB+q8Q+BGcxpnw27tKckVNkSpiC1dtru3DzxvhOCVz6Hw7G4sPvLSPZLdaC4aK0Wkb43pkw== archi@localhost.localdomain
```

```bash=
PS C:\Users\Victor> ssh archi@10.250.1.10
Activate the web console with: systemctl enable --now cockpit.socket

Last login: Tue Nov 23 16:15:53 2021 from 10.250.1.1
```

---

➜ **Accès internet**

🌞 **Prouvez que vous avez un accès internet**

- avec une commande `ping`

```bash=
[archi@localhost ~]$ ping 8.8.8.8
PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.
64 bytes from 8.8.8.8: icmp_seq=1 ttl=113 time=26.0 ms
64 bytes from 8.8.8.8: icmp_seq=2 ttl=113 time=25.10 ms
^C
--- 8.8.8.8 ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 1002ms
rtt min/avg/max/mdev = 25.982/26.005/26.028/0.023 ms
```

🌞 **Prouvez que vous avez de la résolution de nom**

```bash=
[archi@localhost ~]$ ping google.Com
PING google.Com (142.250.201.174) 56(84) bytes of data.
64 bytes from par21s23-in-f14.1e100.net (142.250.201.174): icmp_seq=1 ttl=113 time=23.3 ms
64 bytes from par21s23-in-f14.1e100.net (142.250.201.174): icmp_seq=2 ttl=113 time=23.10 ms
64 bytes from par21s23-in-f14.1e100.net (142.250.201.174): icmp_seq=3 ttl=113 time=23.6 ms
^C
--- google.Com ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2003ms
rtt min/avg/max/mdev = 23.295/23.629/23.969/0.302 ms
```

---

➜ **Nommage de la machine**

🌞 **Définissez `node1.tp4.linux` comme nom à la machine**

```bash=
[archi@node1 ~]$ cat /etc/hostname
node1.tp4.linux
```

```bash=
[archi@node1 ~]$ hostname
node1.tp4.linux
```

## 1. Intro NGINX

NGINX (prononcé "engine-X") est un serveur web. C'est un outil de référence aujourd'hui, il est réputé pour ses performances et sa robustesse.

Ici on va pas DU TOUT s'attarder sur la partie dév web étou, une simple page HTML fera l'affaire.

Une fois le serveur web installé, on récupère :

- **un service**
  - un service c'est un processus
  - il y a donc un binaire, une application qui fait serveur web
  - qui dit processus, dit que quelqu'un, un utilisateur lance ce processus
  - c'est l'utilisateur qu'on voit lister dans la sortie de `ps -ef`
- **des fichiers de conf**
  - comme d'hab c'est dans `/etc/` la conf
  - comme d'hab c'est bien rangé, donc la conf de NGINX c'est dans `/etc/nginx/`
  - question de simplicité en terme de nommage, le fichier de conf principal c'est `/etc/nginx/nginx.conf`
  - la conf, ça appartient à l'utilisateur `root`
- **une racine web**
  - c'est un dossier dans lequel le site est stocké
  - c'est à dire là où se trouvent tous les fichiers PHP, HTML, CSS, JS, etc du site
  - ce dossier et tout son contenu doivent appartenir à l'utilisateur qui lance le service
- **des logs**
  - tant que le service a pas trop tourné c'est empty
  - comme d'hab c'est `/var/log/`
  - comme d'hab c'est bien rangé donc c'est dans `/var/log/nginx/`
  - comme d'hab on peut aussi consulter certains logs avec `sudo journalctl -xe -u nginx`

## 2. Install

🌞 **Installez NGINX en vous référant à des docs online**

```bash=
[archi@node1 ~]$ sudo dnf install nginx
...
...
Complete!
```

```bash=
[archi@node1 ~]$ sudo systemctl start nginx
```

```bash=
[archi@node1 ~]$ sudo systemctl status nginx
● nginx.service - The nginx HTTP and reverse proxy server
   Loaded: loaded (/usr/lib/systemd/system/nginx.service; disabled; vendor preset: disabled)
   Active: active (running) since Tue 2021-11-23 16:53:19 CET; 10s ago
  Process: 84918 ExecStart=/usr/sbin/nginx (code=exited, status=0/SUCCESS)
  Process: 84917 ExecStartPre=/usr/sbin/nginx -t (code=exited, status=0/SUCCESS)
  Process: 84915 ExecStartPre=/usr/bin/rm -f /run/nginx.pid (code=exited, status=0/SUCCESS)
 Main PID: 84920 (nginx)
    Tasks: 2 (limit: 4935)
   Memory: 5.5M
   CGroup: /system.slice/nginx.service
           ├─84920 nginx: master process /usr/sbin/nginx
           └─84921 nginx: worker process

Nov 23 16:53:19 node1.tp4.linux systemd[1]: Starting The nginx HTTP and reverse proxy server...
Nov 23 16:53:19 node1.tp4.linux nginx[84917]: nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
Nov 23 16:53:19 node1.tp4.linux nginx[84917]: nginx: configuration file /etc/nginx/nginx.conf test is successful
Nov 23 16:53:19 node1.tp4.linux systemd[1]: nginx.service: Failed to parse PID from file /run/nginx.pid: Invalid argument
Nov 23 16:53:19 node1.tp4.linux systemd[1]: Started The nginx HTTP and reverse proxy server.
```


## 3. Analyse

🌞 **Analysez le service NGINX**

```bash=
[archi@node1 ~]$ ps -ef
...
root       84920       1  0 16:53 ?        00:00:00 nginx: master process /usr/sbin/nginx
```
```bash=
[archi@node1 ~]$ sudo ss -lantp
...
LISTEN   0        128              0.0.0.0:80            0.0.0.0:*        users:(("nginx",pid=84921,fd=8),("nginx",pid=84920,fd=8))
```
```bash=
[archi@node1 ~]$ cat /etc/nginx/nginx.conf
...
server {
        listen       80 default_server;
        listen       [::]:80 default_server;
        server_name  _;
        root         /usr/share/nginx/html;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        location / {
        }

        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }
```
```bash=
[archi@node1 ~]$ cd /usr/share/nginx/html;
[archi@node1 html]$ ls -l
total 20
-rw-r--r--. 1 root root 3332 Jun 10 11:09 404.html
-rw-r--r--. 1 root root 3404 Jun 10 11:09 50x.html
-rw-r--r--. 1 root root 3429 Jun 10 11:09 index.html
-rw-r--r--. 1 root root  368 Jun 10 11:09 nginx-logo.png
-rw-r--r--. 1 root root 1800 Jun 10 11:09 poweredby.png
```

## 4. Visite du service web

Et ça serait bien d'accéder au service non ? Bon je vous laisse pas dans le mur : spoiler alert, le service est actif, mais le firewall de Rocky bloque l'accès au service, on va donc devoir le configurer.

Il existe [un mémo dédié au réseau au réseau sous Rocky](../../cours/memos/rocky_network.md), vous trouverez le nécessaire là-bas pour le firewall.

🌞 **Configurez le firewall pour autoriser le trafic vers le service NGINX** 

```bash=
[archi@node1 ~]$ sudo firewall-cmd --add-port=80/tcp --permanent
success
```
```bash=
[archi@node1 ~]$ sudo firewall-cmd --reload
success
```

🌞 **Tester le bon fonctionnement du service**

```bash=
[archi@node1 ~]$ curl http://10.250.1.10:80
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
...
```

## 5. Modif de la conf du serveur web

🌞 **Changer le port d'écoute**

- une simple ligne à modifier, vous me la montrerez dans le compte rendu
  - faites écouter NGINX sur le port 8080

```bash=
server {
        listen       8080 default_server;
        listen       [::]:8080 default_server;
```
- redémarrer le service pour que le changement prenne effet
  - `sudo systemctl restart nginx`
  - vérifiez qu'il tourne toujours avec un ptit `systemctl status nginx`
```bash=
[archi@node1 ~]$ sudo systemctl restart nginx
● nginx.service - The nginx HTTP and reverse proxy server
   Loaded: loaded (/usr/lib/systemd/system/nginx.service; disabled; vendor preset: disabled)
   Active: active (running) since Tue 2021-11-23 17:49:37 CET; 39s ago
   ...
```
- prouvez-moi que le changement a pris effet avec une commande `ss`

```bash=
[archi@node1 ~]$ sudo ss -altnp | grep nginx
LISTEN 0      128          0.0.0.0:8080      0.0.0.0:*    users:(("nginx",pid=85226,fd=8),("nginx",pid=85225,fd=8))
LISTEN 0      128             [::]:8080         [::]:*    users:(("nginx",pid=85226,fd=9),("nginx",pid=85225,fd=9))
```
- n'oubliez pas de fermer l'ancier port dans le firewall, et d'ouvrir le nouveau

```bash=
[archi@node1 ~]$ sudo firewall-cmd --remove-port=80/tcp --permanent
success
[archi@node1 ~]$ sudo firewall-cmd --add-port=8080/tcp --permanent
success
[archi@node1 ~]$ sudo firewall-cmd --reload
success
```
- prouvez avec une commande `curl` sur votre machine que vous pouvez désormais visiter le port 8080

```bash=
[archi@node1 ~]$ curl http://10.250.1.10:8080
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
...
```

---

🌞 **Changer l'utilisateur qui lance le service**

- pour ça, vous créerez vous-même un nouvel utilisateur sur le système : `web`
  - référez-vous au [mémo des commandes](../../cours/memos/commandes.md) pour la création d'utilisateur
  - l'utilisateur devra avoir un mot de passe, et un homedir défini explicitement à `/home/web`

```bash=
[archi@node1 ~]$ sudo useradd web -m -s /home/web -u 2000
[archi@node1 ~]$ sudo passwd web
Changing password for user web.
New password: (web)
Retype new password: (web)
passwd: all authentication tokens updated successfully.
```

```bash=
[archi@node1 home]$ cat /etc/passwd | grep web
...
web:x:2000:2000::/home/web:/bin/bash
```
- un peu de conf à modifier dans le fichier de conf de NGINX pour définir le nouvel utilisateur en tant que celui qui lance le service
  - vous me montrerez la conf effectuée dans le compte-rendu

```bash=
[archi@node1 home]$ sudo cat /etc/nginx/nginx.conf
...
user web;
...
```
- n'oubliez pas de redémarrer le service pour que le changement prenne effet

```bash=
[archi@node1 home]$ sudo systemctl restart nginx
```
- vous prouverez avec une commande `ps` que le service tourne bien sous ce nouveau utilisateur

```bash=
[archi@node1 home]$ ps -aux
web        85455  0.0  0.9 151820  8040 ?        S    18:39   0:00 nginx: worker process
```

---

🌞 **Changer l'emplacement de la racine Web**

- vous créerez un nouveau dossier : `/var/www/super_site_web`
  - avec un fichier  `/var/www/super_site_web/index.html` qui contient deux trois lignes de HTML, peu importe, un bon `<h1>toto</h1>` des familles, ça fera l'affaire

```bash=
[archi@node1 /]$ cd /var/
[archi@node1 var]$ sudo mkdir www
[archi@node1 var]$ cd www
[archi@node1 www]$ sudo mkdir super_site_web
```

```bash=
[archi@node1 www]$ cat /var/www/super_site_web/index.html
<h1>LETS GOOO</h1>
```
  - le dossier et tout son contenu doivent appartenir à `web`

```bash=
[archi@node1 www]$ sudo chown web:root super_site_web/
[archi@node1 www]$
[archi@node1 www]$ ls -l
total 0
drwxr-xr-x. 2 web root 24 Nov 23 18:52 super_site_web
[archi@node1 www]$ ls -l super_site_web/
total 4
-rw-r--r--. 1 web root 14 Nov 23 18:52 index.html
```
- configurez NGINX pour qu'il utilise cette nouvelle racine web
  - vous me montrerez la conf effectuée dans le compte-rendu

```bash=
[archi@node1 www]$ sudo cat /etc/nginx/nginx.conf
...
root         /var/www/super_site_web;
```
- n'oubliez pas de redémarrer le service pour que le changement prenne effet

```bash=
[archi@node1 www]$ sudo systemctl restart nginx
```
- prouvez avec un `curl` depuis votre hôte que vous accédez bien au nouveau site

```bash= 
[archi@node1 ~]$ curl http://10.250.1.10:8080
<h1>LETS GOOO</h1>
```
