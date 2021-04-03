import { enableProdMode } from '@angular/core'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { environment } from './environments/environment'
import { AppConfig, APP_CONFIG } from './app.config'
import { AppModule } from './app/app.module'

fetch('/assets/config.json')
  .then((response) => response.json())
  .then((config) => {
    if (environment.production) {
      enableProdMode()
    }

    platformBrowserDynamic([{ provide: APP_CONFIG, useValue: config }])
      .bootstrapModule(AppModule)
      .catch((err) => console.error(err))
})