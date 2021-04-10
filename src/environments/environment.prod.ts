// DON'T USE THIS FOR RUNTIME VARIABLES
// 1) make changes to src/assets/config.[environment].json
// 2) update src/app.config.ts
// 3) add constructor(@Inject(APP_CONFIG) public config: AppConfig) to your class
// 4) access config via this.config.apiEndpoint

export const environment = {
  production: true
};
