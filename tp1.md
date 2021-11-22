# TP 1 : Are you dead yet ?

--- 

**🌞 Plusieurs façons différentes de péter la machine virtuelle :**

**➜ First Method :** 

Suppression du fichier racine

    archi@archi-Virtualbox:~$ sudo rm -rf / --no-preserve-root

**➜ Second Method :**

Création d'une boucle infini lorsqu'un utilisateur ouvre le terminal ce qui rend ce dernier unitilisable

Modification du fichier du terminal qui permet d'executer une commande lors du démarrage du terminal

    archi@archi-Virtualbox:~$ sudo nano ~/bashrc

Boucle qui est lancé en tant que processus (impossible de CTRL C)

    while :; do echo "GetHacked"; sleep 0; done &

**➜ Third Method :**

Installation de sl

    archi@archi-Virtualbox:~$ sudo apt install sl

Dans Sessions and Startup :

    créer une variable (terminal) qui ouvre un terminal a chaque login
    exo-open --launch TerminalEmulator

Modification du fichier du terminal qui permet d'executer une commande lors du démarrage du terminal

    archi@archi-Virtualbox:~$ sudo nano ~/bashrc

Récupération de l'animation du train
désactivation de la souris et du clavier
désactivation du la touche alt (anti alt f4)
création de la boucle infini avec le train

    sh train.sh
    xinput disable 12
    xinput disable 11
    train.sh = xmodmap -e 'keycode 64='
    while true 
    do
        sl
    done

**➜ Fourth Method :**

Dans Sessions and Startup :

    créer une variable (terminal) qui ouvre un terminal a chaque login
    exo-open --launch TerminalEmulator

Modification du fichier du terminal qui permet d'executer une commande lors du démarrage du terminal

    archi@archi-Virtualbox:~$ sudo nano ~/bashrc

désactivation de la souris et du clavier
désactivation du la touche alt (anti alt f4)
Création de la boucle infini qui relance un terminal lorsqu'un terminal s'ouvre

    xinput disable 12
    xinput disable 11
    xmodmap -e 'keycode 64='
    exo-open --launch TerminalEmulator

**➜ Fifth Method :**

Modification du ficher 'sysrq-trigger' avec une lettre magique comprise par le noyau Linux, qui permet d'éxecuter des commandes tel que ShutDown ou faire Crash volontairement

    archi@archi-Virtualbox:~$ sudo su - (se co en tant que root)
    root@archi-Virtualbox:~$ echo c > /proc/sysrq-trigger (crash)
    root@archi-Virtualbox:~$ echo o > /proc/sysrq-trigger (shutdown)
