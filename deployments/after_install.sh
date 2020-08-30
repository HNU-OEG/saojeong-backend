#!/bin/bash
cd /home/saojeong/dist
/home/ubuntu/.nvm/versions/node/v10.15.3/bin/pm2 delete all
/home/ubuntu/.nvm/versions/node/v10.15.3/bin/pm2 start /home/saojeong/dist/server.js --env --watch
rm after_install.sh appspec.yml before_install.sh package.json
