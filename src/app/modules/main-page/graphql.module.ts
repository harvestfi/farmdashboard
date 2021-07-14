import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { APP_CONFIG, AppConfig } from '../../../app.config';

@NgModule({
    providers: [
        {
            provide: APOLLO_OPTIONS,
            useFactory: (httpLink: HttpLink, config: AppConfig): ApolloClientOptions<any> => ({
                    link: httpLink.create({uri: config.theGraph.graphQlServerUrl}), cache: new InMemoryCache()
            }),
            deps: [HttpLink, APP_CONFIG],
        },
    ],
})
export class GraphQLModule {}
