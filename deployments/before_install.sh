#!/bin/bash
EXCLUDE_ENV=!(".|..|.env")
rm -rf /home/saojeong/dist/$EXCLUDE_ENV

find /home/saojeong/dist ! -name '.env' -mindepth 1 -exec rm -f {} \;
