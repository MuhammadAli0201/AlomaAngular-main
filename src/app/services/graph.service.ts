import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Graph {
  label: string;
  count: number;
  percentage: number;
}
export interface GraphDashboard {
  outcome: Graph[];
  weight: Graph[];
  sepsis: Graph[];
  hieGraph : Graph []
  //congenitalInfection: Graph[];  
  //fungalSepsisPresence: Graph[]; 
  // add hie if you want later
}

@Injectable({
  providedIn: 'root'
})

  export class GraphService {

  private apiUrl = 'https://localhost:7008/api/Graphs/dashboard';  // replace with your actual URL

  constructor(private http: HttpClient) { }

  getDashboard(): Observable<GraphDashboard> {
    return this.http.get<GraphDashboard>(this.apiUrl);
  }
}

