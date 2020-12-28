#Only run on server, requires nginx, the build.sh script must be run first, and
#ChexyAgent.service and ChexyAgent files must be in the ~/ChexyAgent folder
#those files require the user name to be engg4000

#run with sudo
cd ~/ChexyAgent
mv ChexyAgent.service /etc/systemd/system/ChexyAgent.service
sudo systemctl start ChexyAgent
sudo systemctl enable ChexyAgent
mv ChexyAgent /etc/nginx/sites-available/ChexyAgent
rm /etc/nginx/sites-enabled/ChexyAgent
sudo ln -s /etc/nginx/sites-available/ChexyAgent /etc/nginx/sites-enabled
rm /etc/nginx/sites-enabled/default
systemctl daemon-reload
sudo systemctl restart nginx
sudo ufw allow 'Nginx Full'