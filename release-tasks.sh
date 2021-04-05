echo DEPLOYMENT_ENV = $DEPLOYMENT_ENV
if [[ -z $DEPLOYMENT_ENV ]]; then
    echo "1"
else
    if [[ $DEPLOYMENT_ENV == "prod" ]]; then 
        cp dist/farmdashboard-front/assets/config.prod.json dist/farmdashboard-front/assets/config.json
    fi

    if [[ $DEPLOYMENT_ENV == "stage" ]]; then 
        cp dist/farmdashboard-front/assets/config.stage.json dist/farmdashboard-front/assets/config.json
    fi
fi