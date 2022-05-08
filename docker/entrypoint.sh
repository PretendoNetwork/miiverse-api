#!/bin/sh

files='config.json certs/access/private.pem certs/access/aes.key'

for file in $files; do
    if [ ! -f $file ]; then
        echo "$PWD/$file file does not exist. Please mount and try again."
        exit 1
    fi
done

exec node src/server.js
