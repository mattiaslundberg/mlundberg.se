#!/usr/bin/env sh
ssh root@$1 mkdir -p /var/www/$1
scp -r * root@$1:/var/www/$1/
ssh root@$1 service nginx restart
