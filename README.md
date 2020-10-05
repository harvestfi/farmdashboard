# EthGasViewer
It's a simple solution to monitor different metrics.


You can find the frontend part in https://github.com/belbix/egv-grontend

For correct deployment clone both of them in the same OS folder.

Angular 2 is required.

Run in the frontend project folder 
```bash
ng build --prod
```

Now you can run maven install, all have been deployed in the dist folder.

It is recommended to use -Dhttps.protocols=TLSv1.2,TLSv1.1,TLSv1 for effective interaction with ethgasstation API
