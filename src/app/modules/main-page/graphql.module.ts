import { NgModule } from '@angular/core';
import { APOLLO_NAMED_OPTIONS, APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { APP_CONFIG, AppConfig } from '../../../app.config';

export function createNamedApollo(httpLink: HttpLink, config: AppConfig): Record<string, ApolloClientOptions<any>> {
    return {
        second: {
            name: 'second',
            link: httpLink.create({ uri: config.theGraph.graphQlAnalyticsUrl }),
            cache: new InMemoryCache()
        },
        third: {
            name: 'third',
            link: httpLink.create({ uri: config.theGraph.graphQlAnalyticsUrl }),
            cache: new InMemoryCache()
        }
    };
}

@NgModule({
    providers: [
        {
            provide: APOLLO_OPTIONS,
            useFactory: (httpLink: HttpLink, config: AppConfig): ApolloClientOptions<any> => ({
                    link: httpLink.create({uri: config.theGraph.graphQlServerUrl}), cache: new InMemoryCache()
            }),
            deps: [HttpLink, APP_CONFIG],
        },
        {
            provide: APOLLO_NAMED_OPTIONS,
            useFactory: createNamedApollo,
            deps: [HttpLink, APP_CONFIG],
        },
    ],
})
export class GraphQLModule {}
