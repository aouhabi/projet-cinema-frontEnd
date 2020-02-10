import { Injectable } from '@angular/core';
import { Observable, of } from "rxjs";
import { catchError,map,tap } from "rxjs/operators";
import { HttpClient, HttpHeaders,HttpErrorResponse } from "@angular/common/http";

import { Ville } from "./../models/Ville";
import { Cinema } from "./../models/Cinema";
import {Salle} from '../models/Salle';
import {Constants} from '../Config';

@Injectable({
  providedIn: 'root'
})
export class CinemaService {

  constructor(private http:HttpClient) { }

public getVilles (): Observable<Ville[]>{
  return this.http.get<Ville[]>(Constants.HOST+"/villes").pipe(
    tap(_=> this.log("fetched villes")),
    catchError(this.handleError("getVilles", []))

    );
}

public getCinemas(ville : Ville): Observable<Cinema[]>{
  return this.http.get<Cinema[]>(ville["_links"].cinemas.href).pipe(
    tap(_=> this.log("fetched cinemas")),
    catchError(this.handleError("getCinemas", []))

    );
}

  public getSalles(cinema: Cinema) : Observable<Salle[]>{
    return this.http.get<Salle[]>(cinema["_links"].salles.href).pipe(
      tap(_=> this.log("fetched salles")),
      catchError(this.handleError("getSalles", []))

    );
  }

  public getProjectionsFilm(salle : Salle):Observable<any>{
    let url = salle["_links"].projectionFilms.href.replace("{?projection}","?projection=p1");
    return this.http.get<any>(url).pipe(
      tap(_=> this.log("fetched projectionFilms")),
      catchError(this.handleError("getProjectionsFilm", []))

    );
  }

  getTicketPlaces(projection: any):Observable<any> {
    let url = projection["_links"].tickets.href.replace("{?projection}","?projection=p2");
    return this.http.get<any>(url).pipe(
        tap(_=> this.log("fetched ticketsPlace")),
        catchError(this.handleError("getTicketPlaces", []))

    );

  }

  private log(log :string): void{
    console.info(log);
  }
  private handleError<T>(operation='operation',result?:T) {
   return (error : any) :Observable <T> => {
     console.log(error);
     console.log(`${error} failed : ${error.message}`)
     return of(result as T)

   }

  }



}
