import { Component,OnInit,Input} from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import {AssignmentService} from '../../services/assignment.service';
import {UserService} from '../../services/user.service';
import {TopicService} from '../../services/topic.service';
import { Topic } from'../../models/topic';
import {SubtopicService} from '../../services/subtopic.service';
import { Subtopic } from'../../models/subtopic';
import {MaterialService} from '../../services/material.service';
import { Material } from'../../models/material';
import {RequestService} from '../../services/request.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'deletematerial',
  templateUrl: './deletematerial.component.html',
  styleUrls: ['./deletematerial.component.css'],
  providers: [AssignmentService,UserService,TopicService,SubtopicService,MaterialService,RequestService]
})
export class DeleteMaterialComponent implements OnInit{
  public title:String;
  public assignment;
  public template;
  public template_select;
  public subtopics:Subtopic[];
  public materials:Material[];
  public topics:Topic[];
  public message;
  public url:string;
  public materialName:String;
  public selectMat:Material;
  public nameError='ok';
  public token;
  public request;
  private notifier: NotifierService;  

  constructor(
    private _route:ActivatedRoute,
    private _router:Router,
    private _assignmentService:AssignmentService,
    private _userService:UserService,
    private _materialService:MaterialService,
    private _requestService:RequestService,
    private notifierService: NotifierService
  ){
    this.title='Eliminar material';
    this.notifier = notifierService;
  }

  ngOnInit(){
    this.token = this._userService.getToken();
    this._route.params.subscribe(
      params=>{
        this.request = params;
      });

      /*Se obtiene el template seleccionado para que se vea el HTML correspondiente */
     this.template=this._assignmentService.getTemplate();
     if(this.template!=null){
       this._assignmentService.getInfoAssignment(this.template.assignment).subscribe(
         response=>{
           this.template_select = response.assignment[0].template_select;
         },
         error=>{
           console.log(<any>error);
         }
       );
     }//fin IF
  }//Fin ngOninit
  
  // ****************** Funcion para mostrar las notificaciones
  public showNotification( type: string, message: string ): void {
    this.notifier.notify( type, message );
  }
  // ****************** Funcion para aceptar la solicitud y eliminar el material
  aceptar(){
    this._requestService.updateRequest(this.request.request_id,'Resuelto(Eliminado)',this.token).subscribe(
      response=>{
        this.showNotification('success',"Estatus actualizado correctamente");        
        this._materialService.DeleteMaterial(this.request.material_id,this.token).subscribe(
          response=>{
            this.showNotification('success',"Elemento eliminado correctamente");
          },
          error=>{
            console.log(<any>error);
            this.showNotification('error',"Algo salio mal al eliminar");
          }
        );
        setTimeout(()=>{ 
          this._router.navigate(['/viewrequest']);  
        },2500); 
      },
      error=>{
        console.log(<any>error);
      }
    );
    
  }//Fin aceptar

  // ****************** Funcion para rechazar la solicitud, solo actualiza el estatus
  rechazar(){
    //console.log(this.request);
    this._requestService.updateRequest(this.request.request_id,'Rechazado',this.token).subscribe(
      response=>{
        this.showNotification('success',"Solicitud rechazada correctamente");
      },
      error=>{
        console.log(<any>error);
        this.showNotification('error',"Algo salio mal al rechazar la solicitud");
      }
    );
    setTimeout(()=>{ 
      this._router.navigate(['/viewrequest']);  
    },2500); 
    
  }//Fin rechazar


}//Fin class
