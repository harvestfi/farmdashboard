if [\"$DEPLOYMENT_ENV\" == \"prod\"]
then 
    mv dist/farmdashboard-front/assets/config.prod.json dist/farmdashboard-front/assets/config.json

if [\"$DEPLOYMENT_ENV\" == \"stage\"]
then 
    mv dist/farmdashboard-front/assets/config.stage.json dist/farmdashboard-front/assets/config.json