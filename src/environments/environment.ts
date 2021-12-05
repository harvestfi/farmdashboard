// DON'T USE THIS FOR RUNTIME VARIABLES
// 1) make changes to src/assets/config.[environment].json
// 2) update src/app.config.ts
// 3) add constructor(@Inject(APP_CONFIG) public config: AppConfig) to your class
// 4) access config via this.config.variable example this.config.apiEndpoint

export const environment = {
  production: false,
  APP_ETH_PARSER_URL: 'https://ethparser.herokuapp.com',
  APP_HARVEST_KEY: '41e90ced-d559-4433-b390-af424fdc76d6',
  ZAPPER_API_KEY: '96e0cc51-a62e-42ca-acee-910ea7d2a241',
  APP_ETH_URL: 'https://eth-mainnet.alchemyapi.io/v2/R27MZFRy__nSPdA9g9G-3yz6cIS6Lpm-',
  CURRENCY_VALUE: 'USD',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
