#!/bin/bash

if [ $# -lt 1 ]; then 
  echo "Usage: $0 <your hostname in IP or FQDN> [<nonPomeloRpcHost>]"
  exit 1
fi

basedir=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd ) 

hostname=$1

nonPomeloRpcHost=$2
if [ -z $nonPomeloRpcHost ]; then
  nonPomeloRpcHost=$hostname
fi

config_templates="$basedir/game-server/config.template/*"
mkdir -p $basedir/game-server/config/

for template in $config_templates
do
  filename=$(basename $template) 
  conf="$basedir/game-server/config/$filename"
  cat $template | sed "s/<hostname>/$hostname/g" | sed "s/<nonPomeloRpcHost>/$nonPomeloRpcHost/g" > $conf    
  echo "$template > $conf"
done
