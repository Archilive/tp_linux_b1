# TP4 : TCP, UDP et services réseau

Dans ce TP on va explorer un peu les protocoles TCP et UDP. On va aussi mettre en place des services qui font appel à ces protocoles.


# I. First steps

Faites-vous un petit top 5 des applications que vous utilisez sur votre PC souvent, des applications qui utilisent le réseau : un site que vous visitez souvent, un jeu en ligne, Spotify, j'sais po moi, n'importe.

🌞 **Déterminez, pour ces 5 applications, si c'est du TCP ou de l'UDP**

- avec Wireshark, on va faire les chirurgiens réseau
- déterminez, pour chaque application :
  - IP et port du serveur auquel vous vous connectez
  - le port local que vous ouvrez pour vous connecter

> Dès qu'on se connecte à un serveur, notre PC ouvre un port random. Une fois la connexion TCP ou UDP établie, entre le port de notre PC et le port du serveur qui est en écoute, on parle de tunnel TCP ou de tunnel UDP.


> Aussi, TCP ou UDP ? Comment le client sait ? Il sait parce que le serveur a décidé ce qui était le mieux pour tel ou tel type de trafic (un jeu, une page web, etc.) et que le logiciel client est codé pour utiliser TCP ou UDP en conséquence.

🌞 **Demandez l'avis à votre OS**

- votre OS est responsable de l'ouverture des ports, et de placer un programme en "écoute" sur un port
- il est aussi responsable de l'ouverture d'un port quand une application demande à se connecter à distance vers un serveur
- bref il voit tout quoi
- utilisez la commande adaptée à votre OS pour repérer, dans la liste de toutes les connexions réseau établies, la connexion que vous voyez dans Wireshark, pour chacune des 5 applications

```
 PS C:\windows\system32> netstat -n -b
 
 TCP    10.33.19.109:24326     23.72.250.27:443       ESTABLISHED
 [Spotify.exe]
 
 -----
 
 TCP    10.33.19.109:1025      199.232.58.248:443     ESTABLISHED
 [Discord.exe]
 
 -----
 
 TCP    10.33.19.109:1297      37.244.63.129:3724     ESTABLISHED
 [WowClassic.exe]
 
 -----
 
```

🦈 **[`Spotify`](./screen/spotify_tram.pcapng)**
🦈 **[`Discord`](./screen/Discord_tram1.pcapng)**
🦈 **[`WowClassic`](./screen/jeu_tram.pcapng)**
🦈 **[`youtube`](./screen/youtube_tram.pcapng)**


# II. Mise en place

Allumez une VM Linux pour la suite.

## 1. SSH

Connectez-vous en SSH à votre VM.

🌞 **Examinez le trafic dans Wireshark**

- donnez un sens aux infos devant vos yeux, capturez un peu de trafic, et coupez la capture, sélectionnez une trame random et regardez dedans, vous laissez pas brainfuck par Wireshark n_n
- **déterminez si SSH utilise TCP ou UDP**
  - pareil réfléchissez-y deux minutes, logique qu'on utilise pas UDP non ?
- **repérez le *3-Way Handshake* à l'établissement de la connexion**
  - c'est le `SYN` `SYNACK` `ACK`
- **repérez le FIN FINACK à la fin d'une connexion**
- entre le *3-way handshake* et l'échange `FIN`, c'est juste une bouillie de caca chiffré, dans un tunnel TCP

🦈 **[capture 3-way handshake](screen/SSH.pcapng)**


🌞 **Demandez aux OS**

- repérez, avec un commande adaptée, la connexion SSH depuis votre machine
- ET repérez la connexion SSH depuis votre VM

```
C:\Windows\system32> netstat -fbn -p TCP 5

Connexions actives

  Proto  Adresse locale         Adresse distante       État
  TCP    10.3.1.1:52318         10.3.1.2:22            ESTABLISHED
 [ssh.exe]
```
```
[Archi@pc1 ~]$ sudo ss -ltpn
State      Recv-Q     Send-Q         Local Address:Port         Peer Address:Port    Process
LISTEN     0          128                  0.0.0.0:22                0.0.0.0:*        users:(("sshd",pid=699,fd=3))
LISTEN     0          128                     [::]:22                   [::]:*        users:(("sshd",pid=699,fd=4))
```

🦈 **Je veux une capture clean avec le 3-way handshake, un peu de trafic au milieu et une fin de connexion**

## 2. NFS

Allumez une deuxième VM Linux pour cette partie.

Vous allez installer un serveur NFS. Un serveur NFS c'est juste un programme qui écoute sur un port (comme toujours en fait, oèoèoè) et qui propose aux clients d'accéder à des dossiers à travers le réseau.

Une de vos VMs portera donc le serveur NFS, et l'autre utilisera un dossier à travers le réseau.

🌞 **Mettez en place un petit serveur NFS sur l'une des deux VMs**

- j'vais pas ré-écrire la roue, google it, ou [go ici](https://www.server-world.info/en/note?os=Rocky_Linux_8&p=nfs&f=1)
- partagez un dossier que vous avez créé au préalable dans `/srv`
- vérifiez que vous accédez à ce dossier avec l'autre machine : [le client NFS](https://www.server-world.info/en/note?os=Rocky_Linux_8&p=nfs&f=2)

> Si besoin, comme d'hab, je peux aider à la compréhension, n'hésitez pas à m'appeler.

```
[archi@Serveur ~]$ sudo dnf -y install nfs-utils
[...]
Complete!
[archi@Serveur ~]$ sudo nano /etc/idmapd.conf
[archi@Serveur ~]$ sudo nano /etc/exports
[archi@Serveur ~]$ cat /etc/exports
/srv/nfsshare 10.3.1.0/24(rw,no_root_squash)
[archi@Serveur ~]$ sudo systemctl enable --now rpcbind nfs-server
Created symlink /etc/systemd/system/multi-user.target.wants/nfs-server.service → /usr/lib/systemd/system/nfs-server.service.
[archi@Serveur ~]$ sudo firewall-cmd --add-service=nfs
success
[archi@Serveur ~]$ sudo firewall-cmd --runtime-to-permanent
success
[archi@Serveur ~]$ sudo mkdir /srv/nfsshare
[archi@Serveur ~]$ sudo nano /srv/nfsshare/helloworld.txt
[archi@Serveur ~]$ cat /srv/nfsshare/helloworld.txt
helloworld!
```

```
[archi@Client ~]$ sudo dnf -y install nfs-utils
[...]
Complete!
[archi@Client ~]$ sudo nano /etc/idmapd.conf
[archi@Client ~]$ sudo mount -t nfs 10.3.1.3:/srv/nfsshare /mnt
[archi@Client ~]$ df -hT /mnt
Filesystem             Type  Size  Used Avail Use% Mounted on
10.3.1.3:/srv/nfsshare nfs4  6.2G  1.2G  5.1G  18% /mnt
[archi@Client ~]$ cat /mnt/helloworld.txt
helloworld!
```

🌞 **Wireshark it !**

- une fois que c'est en place, utilisez `tcpdump` pour capturer du trafic NFS
- déterminez le port utilisé par le serveur

```
[archi@Serveur ~]$ sudo tcpdump -i enp0s8 -c 10 -w nfs.pcapng not port 22
dropped privs to tcpdump
tcpdump: listening on enp0s8, link-type EN10MB (Ethernet), snapshot length 262144 bytes
10 packets captured
25 packets received by filter
0 packets dropped by kernel
```

Le serveur a comme port d'écoute : 2049

🌞 **Demandez aux OS**

- repérez, avec un commande adaptée, la connexion NFS sur le client et sur le serveur

```
[archi@Serveur ~]$ sudo ss -ltpn | grep 2049
LISTEN 0      64           0.0.0.0:2049       0.0.0.0:*
LISTEN 0      64              [::]:2049          [::]:*
```

```
[archi@Client ~]$ sudo ss -tp
State                Recv-Q                Send-Q                                Local Address:Port                                 Peer Address:Port                 Process
ESTAB                0                     0                                          10.3.1.2:937    
```

🦈 **[trafic NFS](screen/nfs.pcapng)**


## 3. DNS

🌞 Utilisez une commande pour effectuer une requête DNS depuis une des VMs

- capturez le trafic avec un `tcpdump`
- déterminez le port et l'IP du serveur DNS auquel vous vous connectez

```
[archi@Serveur ~]$ sudo tcpdump -i enp0s3 -c 10 -w dns.pcapng not port 22 &
[1] 1557
[archi@Serveur ~]$ dig ynov.com

; <<>> DiG 9.16.23-RH <<>> ynov.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 37165
;; flags: qr rd ra; QUERY: 1, ANSWER: 3, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 512
;; QUESTION SECTION:
;ynov.com.                      IN      A

;; ANSWER SECTION:
ynov.com.               300     IN      A       172.67.74.226
ynov.com.               300     IN      A       104.26.11.233
ynov.com.               300     IN      A       104.26.10.233

;; Query time: 30 msec
;; SERVER: 8.8.8.8#53(8.8.8.8)
;; WHEN: Sat Oct 15 17:32:33 CEST 2022
;; MSG SIZE  rcvd: 85
```

🦈 **[DNS](screen/dns.pcapng)**
