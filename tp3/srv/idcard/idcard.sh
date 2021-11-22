#!/usr/bin/env bash


source /etc/os-release
host=$(hostname)
os=${NAME}
version=${VERSION}
ip=$(ip a | grep -w inet | sed -n '3p' | cut -d "d" -f2 | cut -d " " -f2)
ram_space_left=$(free -mh | grep -w Mem: |  awk '{print $4}')
ram_space=$(free -mh | grep -w Mem: |  awk '{print $2}')
disk_space_left=$( df --total -h | tail -n 1 | awk '{print $4}')

mem_process_use=$(ps aux --sort -rss | head -n 6 | tail -n 5 | awk '{print $4,$11}')

port=$(ss -lntp | tail -n +2 | awk '{ print $4; }' | sed 's/:/ /' | awk '{ print $2;}' | cut -d":" -f1)
programm=$(ss -lntp | tail -n +2 | awk '{ print $6;}' | tr \" " " | awk '{ print $2; }')


echo "Machine name :" $host
echo "OS" $os "and kernel version is" $version
echo "IP :" $ip
echo "RAM :" $ram_space_left "RAM restante sur" $ram_space
echo "Disque :" $disk_space_left "space left"

echo "Top 5 processes by RAM usage :"

echo "$mem_process_use" | while read i; do
  echo  "   -" $i
done

echo "Listening ports :"

array_port=($port)
array_programm=($programm)

for ((i = 0 ; i < ${#array_port[@]}; i++)); do
  echo "   -" ${array_port[i]} ":" ${array_programm[i]}
done

chat=$(curl https://api.thecatapi.com/v1/images/search --silent | cut -d'"' -f10)
echo "Here's your random cat :" $chat
