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

  constructor( private http: HttpClient, private apollo: Apollo, @Inject(APP_CONFIG) public config: AppConfig ) {
      this.subGraphsListURL = config.theGraph.graphQlServerUrl;
  }

  getSubGraphs(): any {
     const subGraphsQuery = `{"query":"{ subgraphs { id displayName } }", "variables": null}`;
     return this.http.post(this.subGraphsListURL, subGraphsQuery).pipe(map((result: {data}) => result.data));
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
}
