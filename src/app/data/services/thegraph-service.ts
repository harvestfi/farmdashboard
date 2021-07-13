import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

const subGraphsListURL = environment.theGraphUrl;;

@Injectable({
  providedIn: 'root'
})
export class TheGraphService {

  constructor(private http: HttpClient) {
  }

  getSubGraphs(): any {
     const subGraphsQuery = `{"query":"{ subgraphs { id displayName } }", "variables": null}`;
     return this.http.post(subGraphsListURL, subGraphsQuery).pipe(map((result: {data}) => result.data));
  }
}
