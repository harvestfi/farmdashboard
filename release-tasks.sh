#!/usr/bin/env bash
echo DEPLOYMENT_ENV = $DEPLOYMENT_ENV
env
if [[ -z $DEPLOYMENT_ENV ]]; then
    echo "DEPLOYMENT_ENV is not set"
else
    if [[ $DEPLOYMENT_ENV == "prod" ]]; then 
        pwd
        cat dist/farmdashboard-front/assets/config.prod.json
        cp dist/farmdashboard-front/assets/config.prod.json dist/farmdashboard-front/assets/config.json
    fi

    if [[ $DEPLOYMENT_ENV == "stage" ]]; then 
        pwd
        dist/farmdashboard-front/assets/config.stage.json
        cp dist/farmdashboard-front/assets/config.stage.json dist/farmdashboard-front/assets/config.json
    fi
fi