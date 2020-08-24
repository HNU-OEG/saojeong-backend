#!/bin/bash
find /home/saojeong/dist ! -name '.env' -mindepth 1 -exec rm -f {} \;
