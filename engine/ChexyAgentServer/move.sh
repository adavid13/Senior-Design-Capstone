#scp -i ../ChexyAIHost_key.pem  ChexyAgentServer/ChexyAgent ChexyAgentServer/ChexyAgent.service ChexyAgentServer/deploy.sh ChexyAgentServer/build.sh ChexyAgentServer/ChexyAgent.py ChexyAgentServer/wsgi.py engg4000@52.228.34.15:~/ChexyAgent 
#before running move.sh build the game:
#sudo run npm install
#sudo npm run build
IP="52.233.37.124"
mkdir ../ChexyAgent
cp ChexyAgent ChexyAgent.service deploy.sh build.sh ChexyAgent.py https_certification.sh wsgi.py ../ChexyAgent
scp -i ../../ChexyAIHost_key.pem -r ../ChexyAgent engg4000@$IP:~ 
scp -i ../../ChexyAIHost_key.pem -r ../game/dist/ engg4000@$IP:~
rm -r ../ChexyAgent
ssh -i ../../ChexyAIHost_key.pem engg4000@$IP

# then on server: cd ChexyAgent
# chmod +x build.sh deploy.sh http_certification.sh
# ./build.sh
# ./deploy.sh
# ./http_certification.sh
