#!/usr/bin/env bash
echo DEPLOYMENT_ENV = $DEPLOYMENT_ENV
env
if [[ -z $DEPLOYMENT_ENV ]]; then
    echo "DEPLOYMENT_ENV is not set"
else
    if [[ $DEPLOYMENT_ENV == "prod" ]]; then 
        cp dist/farmdashboard-front/assets/config.prod.json dist/farmdashboard-front/assets/config.json
    fi

    if [[ $DEPLOYMENT_ENV == "stage" ]]; then 
        cp dist/farmdashboard-front/assets/config.stage.json dist/farmdashboard-front/assets/config.json
    fi
fi