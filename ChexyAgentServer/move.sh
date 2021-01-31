#scp -i ../ChexyAIHost_key.pem  ChexyAgentServer/ChexyAgent ChexyAgentServer/ChexyAgent.service ChexyAgentServer/deploy.sh ChexyAgentServer/build.sh ChexyAgentServer/ChexyAgent.py ChexyAgentServer/wsgi.py engg4000@52.228.34.15:~/ChexyAgent 
IP="52.138.11.153"
mkdir ../ChexyAgent
cp ChexyAgent ChexyAgent.service deploy.sh build.sh ChexyAgent.py wsgi.py ../ChexyAgent
scp -i ../../ChexyAIHost_key.pem -r ../ChexyAgent engg4000@$IP:~ 
scp -i ../../ChexyAIHost_key.pem -r ../game/dist/ engg4000@$IP:~
rm -r ../ChexyAgent
ssh -i ../../ChexyAIHost_key.pem engg4000@$IP

# then on server: cd ChexyAgent
# chmod +x build.sh deploy.sh
# ./build.sh
# sudo ./deploy.sh
