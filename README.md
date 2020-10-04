# EthGasViewer
It's a simple project for monitoring different metrics.


Frontend part in https://github.com/belbix/egv-grontend

For correct deployment clone the both in the same OS folder.

Angular 2 required

Run in the frontend project folder 
```bash
ng build --prod
```

Now you can run maven install, all have been deployed in the dist folder.

Recommend to use -Dhttps.protocols=TLSv1.2,TLSv1.1,TLSv1 for correct interaction with ethgasstation API
