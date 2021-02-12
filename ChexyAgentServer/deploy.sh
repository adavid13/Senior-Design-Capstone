#Only run on server, requires nginx, the build.sh script must be run first, and
#ChexyAgent.service and ChexyAgent files must be in the ~/ChexyAgent folder
#dist folder must be in home directory e.g. ~/dist/index.html
#those files require the user name to be engg4000

cd ~/ChexyAgent
sudo apt install nginx
sudo cp ChexyAgent.service /etc/systemd/system/ChexyAgent.service
sudo systemctl start ChexyAgent
sudo systemctl restart ChexyAgent
sudo systemctl enable ChexyAgent
sudo cp ChexyAgent /etc/nginx/sites-available/ChexyAgent
sudo mv /etc/nginx/sites-enabled/ChexyAgent ~/ChexyAgent/oldChexyAgent
sudo ln -s /etc/nginx/sites-available/ChexyAgent /etc/nginx/sites-enabled
sudo ln -s ~/dist /var/www/html/game
sudo rm /etc/nginx/sites-enabled/default
sudo systemctl daemon-reload
sudo systemctl restart nginx
sudo ufw allow 'Nginx Full'
sudo ufw allow 80
sudo ufw allow 443
