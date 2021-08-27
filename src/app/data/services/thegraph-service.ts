import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { APP_CONFIG, AppConfig } from '../../../app.config';

@Injectable({
  providedIn: 'root'
})
export class TheGraphService {

  subGraphsListURL = '';
  subGraphsAnalyticsURL = '';

  constructor( private http: HttpClient, private apollo: Apollo, @Inject(APP_CONFIG) public config: AppConfig ) {
      this.subGraphsListURL = config.theGraph.graphQlServerUrl;
      this.subGraphsAnalyticsURL = config.theGraph.graphQlAnalyticsUrl;

  }

  getSubGraphs(): any {
      const query = gql`
          {
              subgraphs {
                id
                displayName
            }
          }
        `;
      return this.apollo.watchQuery({
          query
      }).valueChanges.pipe(map(result => result.data));
  }

  getExactSubGraph(id): any {
      const query = gql`
          {
             subgraph ( id: "${id}") {
                id
                displayName
                image
            }
          }
        `;
      return this.apollo.watchQuery({
          query
      }).valueChanges.pipe(map(result => result.data));
  }

  getGraphAnalytics(id): any {
      const subGraphsQuery = ``;
      return this.http.post(this.subGraphsAnalyticsURL, subGraphsQuery).pipe(map((result: {data}) => result.data));
  }



}
