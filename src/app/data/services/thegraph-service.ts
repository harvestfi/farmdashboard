import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { environment } from '../../../environments/environment';

const subGraphsListURL = environment.theGraphUrl;;

@Injectable({
  providedIn: 'root'
})
export class TheGraphService {

  constructor(private http: HttpClient, private apollo: Apollo) {
  }

  getSubGraphs(): any {
     const subGraphsQuery = `{"query":"{ subgraphs { id displayName } }", "variables": null}`;
     return this.http.post(subGraphsListURL, subGraphsQuery).pipe(map((result: {data}) => result.data));
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
