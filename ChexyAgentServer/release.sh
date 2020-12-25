#cd ChexyAgentServer
#chmod +x release.sh
#./release.sh
pip install -e .
pip list | grep ChexyAgent
python setup.py bdist_wheel
export FLASK_APP=ChexyAgent
waitress-serve --call 'ChexyAgent:create_app'