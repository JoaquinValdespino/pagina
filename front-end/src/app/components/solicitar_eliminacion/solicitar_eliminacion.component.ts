import { Component,OnInit,Input} from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import { Assignment } from'../../models/assignment';
import {AssignmentService} from '../../services/assignment.service';
import { User } from'../../models/user';
import {UserService} from '../../services/user.service';
import {SubtopicService} from '../../services/subtopic.service';
import { Subtopic } from'../../models/subtopic';
import {TopicService} from '../../services/topic.service';
import { Topic } from'../../models/topic';
import {MaterialService} from '../../services/material.service';
import { Material } from'../../models/material';
import { Request } from'../../models/request';
import {RequestService} from '../../services/request.service';
import {ProfesorService} from '../../services/profesor.service';
import {GLOBAL} from '../../services/global';
import { Response } from '@angular/http';
import { NotifierService } from 'angular-notifier';


@Component({
  selector: 'solicitar_eliminacion',
  templateUrl: './solicitar_eliminacion.component.html',
  styleUrls: ['./solicitar_eliminacion.component.css'],
  providers: [AssignmentService,UserService,SubtopicService,RequestService,TopicService,ProfesorService,MaterialService]
})
export class SolicitarEliminacionComponent implements OnInit{
  public title:String;
  public assignment;
  public template;
  public template_select;
  public request:Request;
  public subtopics:Subtopic[];
  public topics:Topic[];
  public message;
  public url:string;
  public nameError='ok';
  public token;
  public profesors;
  public identity;
  public materials:Material[];
  private notifier: NotifierService;  
  public space;

  constructor(
    private _route:ActivatedRoute,
    private _router:Router,
    private _assignmentService:AssignmentService,
    private _userService:UserService,
    private _subtopicService:SubtopicService,
    private _requestService:RequestService,
    private _topicService:TopicService,
    private _profesorService:ProfesorService,
    private _materialService:MaterialService,
    private notifierService: NotifierService
    
  ){
    this.title='Solicitar eliminar material';
    this.identity=this._userService.getIdentity();
    this.request= new Request('','','','','','','','',null,null,this.identity.assignment);
    this.notifier = notifierService;
    this.space=' ';
  }

  ngOnInit(){
    this.token = this._userService.getToken();    
    var l = [];
    this.assignment=this._assignmentService.getAssignment();
    this._topicService.getInfoTopics(this.assignment).subscribe(//AGREGAR TOKEN
      response=>{
          this.topics=response.topics;          
          for (let t in this.topics) {            
              this._subtopicService.getInfoSubtopics(this.topics[t].topic_id).subscribe(
                response=>{
                    l=l.concat(response.subtopics);                    
                    this.subtopics=l;                    
                  },
                  error=>{
                    console.log(<any>error);
                    this.showNotification('warning',"Algo salio mal al obtener los subtemas");
                  }
              );
          }
          this._profesorService.getProfesors(this.assignment).subscribe(
                response=>{
                    this.profesors=response.profesors;
                  },
                  error=>{
                    console.log(<any>error);
                    this.showNotification('warning',"Algo salio mal al obtener los profesores");
                  }
              );
        },
        error=>{
          console.log(<any>error);
          this.showNotification('warning',"Algo salio mal al obtener los temas");
        }
    );

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

  }// ****************** FIN ngOnInit
 
  public showNotification( type: string, message: string ): void {
    this.notifier.notify( type, message );
  }

  onSubmit(requestForm){        
    this.request.name=this.request.name.trim();
    this._materialService.ViewMaterial(this.request.subtopic,this.request.tipoET).subscribe(
      response=>{
        this.materials = response.materials;
        if(this.materials.length == 0){          
          this.showNotification('warning',"No hay materiales guardados para el subtema y tipo de material elegidos.");         
        }
        else{//Se busca el material 
          for(let mat in this.materials){            
            if(this.request.name == this.materials[mat].name){
              this.nameError = 'ok';
              this.request.material_id = this.materials[mat].material_id;
              this.request.file_name = this.materials[mat].file;
              this.request.link = this.materials[mat].link;
              this.request.assignment_id = this.assignment
              //Se crea el request en la base 
              this._requestService.AddRequest(this.request,this.token).subscribe(
                response=>{                                 
                  if(response.code == 200 && response.status == 'success'){                    
                    this.message = response.status;
                    this.showNotification('success',response.message);
                    setTimeout(()=>{ 
                              this._router.navigate(['/viewrequest']);  
                            },2800);
                    this.request= new Request('','','','','','','','',null,null,this.identity.assignment);
                    //requestForm.reset(); 
                  } 
                  else{
                    this.showNotification('error',response.message);                    
                  }
                },
                error=>{
                  console.log(<any>error);
                  this.showNotification('error',"Error al guardar la solicitud");
                }
              );
              break; //Para que ya no busque mas
            }//Fin IF
            else{
              this.nameError = 'No';
            }
          }//Fin For
          if( this.nameError == 'No' ){
            this.showNotification('error',"Nombre de material incorrecto");            
          }
        }//Fin else
      },
      error=>{
        console.log(<any>error);
        this.showNotification('error',"Error buscando materiales");
      }
    );    
  }//Fin onSubmit
}//Fin
