#!/usr/bin/env bash
if [[ -z $DEPLOYMENT_ENV ]]; then
    echo "-------------------"
    echo "SET DEPLOYMENT_ENV!"
    echo "-------------------"
    echo "---Using default---"
    echo "----config.json----"
    echo "-------------------"
else
    cp dist/farmdashboard-front/assets/config.$DEPLOYMENT_ENV.json dist/farmdashboard-front/assets/config.json
fi && npm start