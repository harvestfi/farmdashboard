web: if [[ -z $DEPLOYMENT_ENV ]]; then; echo "SET DEPLOYMENT_ENV!"; else; cp dist/farmdashboard-front/assets/config.$DEPLOYMENT_ENV.json dist/farmdashboard-front/assets/config.json; fi && npm start