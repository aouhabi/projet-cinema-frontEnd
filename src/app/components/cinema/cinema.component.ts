import { Component, OnInit } from '@angular/core';

import { CinemaService } from "./../../services/cinema.service";
import { Ville } from 'src/app/models/Ville';
import { Cinema } from 'src/app/models/Cinema';
import {Salle} from '../../models/Salle';
import {Constants} from '../../Config';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {

  public villes : Ville[];
  public cinemas : Cinema[];
  public places : any;
  public currentVille : Ville ;
  public currentCinema : Cinema ;
  public currentSeance : any ;
  public salles: Salle[];
  public HOST = Constants.HOST ;
  public ticketClass="btn btn-success ticket";
  public selectedTickets=[];
  constructor(private cinemaServices : CinemaService) { }

  ngOnInit(): void {
     this.cinemaServices.getVilles().subscribe(data => {
       this.villes = data["_embedded"].villes
     })
  }

  public onGetCinema(ville : Ville){
    this.init();
    this.currentVille = ville ;
    this.cinemaServices.getCinemas(ville).subscribe(data => {
      this.cinemas = data["_embedded"].cinemas;
    })
  }

  onGetSalles(cinema: Cinema) {
    this.currentCinema = cinema ;
    return this.cinemaServices.getSalles(cinema).subscribe(data =>{
      this.salles = data["_embedded"].salles ;

      this.salles.forEach(salle =>{

        this.cinemaServices.getProjectionsFilm(salle).subscribe(proj =>{
         salle.projection = proj["_embedded"].projectionFilms;
        })
      })
    })
  }

  onGetTicketPlaces(projection: any) {
    this.currentSeance = projection ;
    console.log(projection);
    this.cinemaServices.getTicketPlaces(projection).subscribe(data => {
      this.currentSeance.tickets = data["_embedded"].tickets;
      this.selectedTickets = []
      //this.setTicketClass()
    })
  }

  onPayeTickets(form:any) {
    let listTicketId=[];
    this.selectedTickets.forEach(ticket =>{
      listTicketId.push(ticket.id);
    });
    form.listTicketId = listTicketId ;

    this.cinemaServices.payerTickets(form).subscribe(data => {

      alert("Ticket reservés avec succés !!");
      console.log("payement effectuer !");
      console.log(data);
      this.onGetTicketPlaces(this.currentSeance)
      //this.setTicketClass()
    })
  }


  onSelectTicket(ticket: any) {

    if(! ticket.selected){
      ticket.selected=true;
      this.selectedTickets.push(ticket)
      console.log(this.selectedTickets)
    }else {
      ticket.selected=false;
      this.selectedTickets.splice(this.selectedTickets.indexOf(ticket),1);
      console.log(this.selectedTickets)
    }
  }
  init(){
    this.currentSeance = null;
    this.salles=null;

  }


  public setTicketClass(ticket:any) {
    let cls = "btn ticket ";
    if (ticket.reserve){
      return cls+"btn-danger";
    }else if(ticket.selected){
      return cls+"btn-warning"
    }
    return  cls+" btn-success"
  }


}
