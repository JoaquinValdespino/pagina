import { Component,OnInit } from '@angular/core';
import {AssignmentService} from '../../services/assignment.service';
import { Assignment } from '../../../app/models/assignment';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {GLOBAL} from '../../services/global';
import {UserService} from '../../services/user.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'selectTemplate',
  templateUrl: './selectTemplate.component.html',
  styleUrls: ['./selectTemplate.component.css'],
  providers: [AssignmentService,UserService]
})
export class SelectTemplateComponent implements OnInit{
  public title;
  public token;
  public template;
  public template_select;  
  public assignmentId;
  public newAssignment: Assignment;
  public url: string;
  private notifier: NotifierService;  

  constructor(
    private _assignmentService:AssignmentService,
    private _route:ActivatedRoute,
    private _router:Router,
    private _userService: UserService,
    private notifierService: NotifierService
  ){
      this.title= "Seleccionar plantilla";
      this.newAssignment = new Assignment('','','','','');//NUEVO
      this.url=GLOBAL.url;
      this.notifier = notifierService;
  }

  ngOnInit(){
    /*Se obtiene el template seleccionado para que se vea el HTML correspondiente */ 
    this.token = this._userService.getToken();
    //console.log(this.token);
    this.template=this._assignmentService.getTemplate();
    if(this.template!=null){
      this._assignmentService.getInfoAssignment(this.template.assignment).subscribe(
        response=>{
          this.template_select = response.assignment[0].template_select;
          this.assignmentId = response.assignment[0].assignment_id;
          this.newAssignment.template_select = response.assignment[0].template_select;          
        },
        error=>{
          console.log(<any>error);
        }
      );
    }//fin IF
  }//Fin ngOnInit

  public showNotification( type: string, message: string ): void {
    this.notifier.notify( type, message );
  }

  onSubmit(){        
    this._assignmentService.updateAssignment(this.assignmentId,this.newAssignment.template_select,this.token).subscribe(
        response => {
          if(response.code==200){
            this.showNotification('success',"Aplicando cambios...");
            setTimeout(()=>{ 
              window.location.reload();  
            },900); 
            this._router.navigate(['/inicio']);              
          }
          else{
            this.showNotification('error',response.message);
          }
        }, //Fin de response UpdateTemplate
        error => {
            console.log(<any>error);
            this.showNotification('error',"Algo salio mal al actualizar");
        }
    );
  }//Fin onSubmit
}//FIN CLASS
