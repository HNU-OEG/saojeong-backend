#!/bin/bash
cd /home/saojeong/dist
/home/ubuntu/.nvm/versions/node/v10.15.3/bin/pm2 delete all
/home/ubuntu/.nvm/versions/node/v10.15.3/bin/pm2 start /home/saojeong/dist/app.js --env --watch
