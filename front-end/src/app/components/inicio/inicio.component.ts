import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {UserService} from '../../services/user.service';
import {TemplateService} from '../../services/template.service';
import { Template } from '../../models/template';
import {AssignmentService} from '../../services/assignment.service';
import { Assignment } from'../../models/assignment';
import {ProfesorService} from '../../services/profesor.service';

@Component({
  selector: 'inicio',
  templateUrl: './inicio.component.html',
  styleUrls: [ './inicio.component.css' ],
  providers: [UserService,TemplateService,AssignmentService,ProfesorService]
})

export class InicioComponent implements OnInit  {
  public title;
  public template;
  public template_select;
  public assignment_id;
  public assignment_name;
  public profesors;
  public assignment;
  public clave_assignment;
  
  constructor(
    private _route:ActivatedRoute,
    private _router:Router,
    private _templateService:TemplateService,
    private _assignmentService:AssignmentService,
    private _profesorService:ProfesorService
  ){
  	this.title= "inicio";
  }


  ngOnInit(){
    /*Se obtiene el template seleccionado para que se vea el HTML correspondiente */ 
    this.template=this._assignmentService.getTemplate();
    this.assignment=this._assignmentService.getAssignment();
    //console.log(this.template);
    
    if(this.template!=null){      
      //Se debe mandar el ID del assignment
      this.assignment_id = this.template.assignment;

      this._assignmentService.getInfoAssignment(this.assignment_id).subscribe(
        response=>{
          
          this.template_select = response.assignment[0].template_select;
          this.assignment_name = response.assignment[0].assignment_name;
          this.clave_assignment = response.assignment[0].clave_assignment;
        },
        error=>{
          console.log(<any>error);
        } 
      );
      //Se obtiene la lista de profesores participantes
      this._profesorService.getProfesors(this.assignment).subscribe(
        response=>{
            this.profesors=response.profesors;
          },
          error=>{
            console.log(<any>error);
          }
      );
    }//fin IF
    else{
      this.title='inicioMulti';
    }
  }//Fin ngOnInit
  ngDoCheck(){
    this.assignment=this._assignmentService.getAssignment();
  }
}//Fin class
