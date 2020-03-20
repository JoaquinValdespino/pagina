import { Component,OnInit } from '@angular/core';
import {AssignmentService} from '../../services/assignment.service';
import {GLOBAL} from '../../services/global';

@Component({
  selector: 'contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css'],
  providers: [AssignmentService]
})
export class ContactoComponent implements OnInit{
  public title;
  public template;
  public template_select;
  public url:string;

  constructor(
    private _assignmentService:AssignmentService
  ){
    this.title= "Contacto";
    this.url=GLOBAL.url;
  }

  ngOnInit(){
    /*Se obtiene el template seleccionado para que se vea el HTML correspondiente */ 
    this.template=this._assignmentService.getTemplate();
    if(this.template!=null){
      this._assignmentService.getInfoAssignment(this.template.assignment).subscribe(
        response=>{
          this.template_select = response.assignment[0].template_select;
          //console.log(this.template_select);
        },
        error=>{
          console.log(<any>error);
        }
      );
    }//fin IF
  }//Fin ngOnInit

}//FIN CLASS
