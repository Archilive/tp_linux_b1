# Partie 1 : Préparation de la machine `backup.tp6.linux`

# I. Ajout de disque

🌞 **Ajouter un disque dur de 5Go à la VM `backup.tp6.linux`**

- pour me prouver que c'est fait dans le compte-rendu, vous le ferez depuis le terminal de la VM
- la commande `lsblk` liste les périphériques de stockage branchés à la machine
- vous mettrez en évidence le disque que vous venez d'ajouter dans la sortie de `lsblk`

```bash=
[archi@backup ~]$ lsblk
NAME        MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
sda           8:0    0    8G  0 disk
├─sda1        8:1    0    1G  0 part /boot
└─sda2        8:2    0    7G  0 part
  ├─rl-root 253:0    0  6.2G  0 lvm  /
  └─rl-swap 253:1    0  820M  0 lvm  [SWAP]
sdb           8:16   0    5G  0 disk
sr0          11:0    1 1024M  0 rom
```

# II. Partitioning

🌞 **Partitionner le disque à l'aide de LVM**

- créer un *physical volume (PV)* : le nouveau disque ajouté à la VM

```bash=
[archi@backup ~]$ sudo pvcreate /dev/sdb
[sudo] password for archi:
  Physical volume "/dev/sdb" successfully created.
```

```bash=
[archi@backup ~]$ sudo pvs
  PV         VG Fmt  Attr PSize  PFree
  /dev/sda2  rl lvm2 a--  <7.00g    0
  /dev/sdb      lvm2 ---   5.00g 5.00g
```
- créer un nouveau *volume group (VG)*
  - il devra s'appeler `backup`
  - il doit contenir le PV créé à l'étape précédente

```bash=
[archi@backup ~]$ sudo vgcreate backup /dev/sdb
  Volume group "backup" successfully created
```
```bash=
[archi@backup ~]$ sudo vgs
  VG     #PV #LV #SN Attr   VSize  VFree
  backup   1   0   0 wz--n- <5.00g <5.00g
  rl       1   2   0 wz--n- <7.00g     0
```
- créer un nouveau *logical volume (LV)* : ce sera la partition utilisable
  - elle doit être dans le VG `backup`
  - elle doit occuper tout l'espace libre
```bash=
[archi@backup ~]$ sudo lvcreate -l 100%FREE backup -n data
  Logical volume "data" created.
```
```bash=
[archi@backup ~]$ sudo lvs
  LV   VG     Attr       LSize   Pool Origin Data%  Meta%  Move Log Cpy%Sync Convert
  data backup -wi-a-----  <5.00g
  root rl     -wi-ao----  <6.20g
  swap rl     -wi-ao---- 820.00m
```

🌞 **Formater la partition**

- vous formaterez la partition en ext4 (avec une commande `mkfs`)
  - le chemin de la partition, vous pouvez le visualiser avec la commande `lvdisplay`
  - pour rappel un *Logical Volume (LVM)* **C'EST** une partition

```bash=
[archi@backup ~]$ sudo mkfs -t ext4 /dev/backup/data
mke2fs 1.45.6 (20-Mar-2020)
Creating filesystem with 1309696 4k blocks and 327680 inodes
Filesystem UUID: 9aa95643-f5bc-411c-b9c8-1e91097dfa75
Superblock backups stored on blocks:
        32768, 98304, 163840, 229376, 294912, 819200, 884736

Allocating group tables: done
Writing inode tables: done
Creating journal (16384 blocks): done
Writing superblocks and filesystem accounting information: done
```

🌞 **Monter la partition**

- montage de la partition (avec la commande `mount`)
  - la partition doit être montée dans le dossier `/backup`

```bash=
[archi@backup ~]$ sudo mkdir /mnt/backup
[archi@backup ~]$ sudo mount /dev/backup/data /mnt/backup
```
  - preuve avec une commande `df -h` que la partition est bien montée

```bash=
[archi@backup ~]$ df -h
Filesystem               Size  Used Avail Use% Mounted on
devtmpfs                 387M     0  387M   0% /dev
tmpfs                    405M     0  405M   0% /dev/shm
tmpfs                    405M  5.6M  400M   2% /run
tmpfs                    405M     0  405M   0% /sys/fs/cgroup
/dev/mapper/rl-root      6.2G  2.5G  3.8G  40% /
/dev/sda1               1014M  266M  749M  27% /boot
tmpfs                     81M     0   81M   0% /run/user/1000
/dev/mapper/backup-data  4.9G   20M  4.6G   1% /mnt/backup
```
  - prouvez que vous pouvez lire et écrire des données sur cette partition

```bash=
[archi@backup ~]$ sudo nano /mnt/backup/test
[archi@backup ~]$ sudo cat /mnt/backup/test
test
```
- définir un montage automatique de la partition (fichier `/etc/fstab`)
  - vous vérifierez que votre fichier `/etc/fstab` fonctionne correctement

```bash=
[archi@backup ~]$ cat /etc/fstab
...
/dev/mapper/backup-data /mnt/backup ext4 defaults 0 0
```

```bash=
[archi@backup ~]$ sudo mount -av
/                        : ignored
/boot                    : already mounted
none                     : ignored
mount: /mnt/backup does not contain SELinux labels.
       You just mounted an file system that supports labels which does not
       contain labels, onto an SELinux box. It is likely that confined
       applications will generate AVC messages and not be allowed access to
       this file system.  For more details see restorecon(8) and mount(8).
/mnt/backup              : successfully mounted
```

---

Ok ! Za, z'est fait. On a un espace de stockage dédié pour nos sauvegardes.  
Passons à la suite, [la partie 2 : installer un serveur NFS]
