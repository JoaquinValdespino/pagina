import { Component,OnInit,Input} from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import { Assignment } from'../../models/assignment';
import {AssignmentService} from '../../services/assignment.service';
import { User } from'../../models/user';
import {UserService} from '../../services/user.service';
import {TopicService} from '../../services/topic.service';
import { Topic } from'../../models/topic';
import {SubtopicService} from '../../services/subtopic.service';
import { Subtopic } from'../../models/subtopic';
import {MaterialService} from '../../services/material.service';
import { Material } from'../../models/material';
import {UploadService} from '../../services/upload.service';
import {ProfesorService} from '../../services/profesor.service';
import {GLOBAL} from '../../services/global';
import { NotifierService } from 'angular-notifier';
//import 'rxjs/add/operator/toPromise';


@Component({
  selector: 'addmaterial',
  templateUrl: './addmaterial.component.html',
  styleUrls: ['./addmaterial.component.css'],
  providers: [AssignmentService,UserService,TopicService,SubtopicService,MaterialService,UploadService,ProfesorService]
})
export class AddMaterialComponent implements OnInit{
 
  public title:String;
  public material:Material;
  public assignment;
  public topics:Topic[];
  public subtopics:Subtopic[];
  public message;
  public filesToUpload: Array<File>;
  public url:string;
  public template;
  public template_select;
  public profesors;
  public token;
  public material_id;
  private notifier: NotifierService;
  public space;  
  public option;

  constructor(
    private _route:ActivatedRoute,
    private _router:Router,
    private _assignmentService:AssignmentService,
    private _userService:UserService,
    private _topicService:TopicService,
    private _subtopicService:SubtopicService,
    private _materialService:MaterialService,
    private _uploadService:UploadService,
    private _profesorService:ProfesorService,
    private notifierService: NotifierService
  ){
    this.title='Asignaturas';
    this.material= new Material('','','','','','','','',null);
    this.url=GLOBAL.url;
    this.token = this._userService.getToken();
    this.notifier = notifierService;
    this.space=' ';     
    this.option=true; 
  }

  ngOnInit(){
      //Se obtiene la lista de subtemas
      var l = [];
      this.assignment=this._assignmentService.getAssignment();
      this._topicService.getInfoTopics(this.assignment).subscribe(//AGREGAR TOKEN
        result=>{
            this.topics=result.topics;
            for (let t in this.topics) {
                this._subtopicService.getInfoSubtopics(this.topics[t].topic_id).subscribe(
                 result=>{
                      l=l.concat(result.subtopics);
                      this.subtopics=l;
                   },
                    error=>{
                     console.log(<any>error);
                   }
                );
            }
            //Se obtiene la lista de profesores
            this._profesorService.getProfesors(this.assignment).subscribe(
                result=>{
                    this.profesors=result.profesors;
                  },
                  error=>{
                    console.log(<any>error);
                  }
            );
          },
          error=>{
            console.log(<any>error);
          }
      );

    /*Se obtiene el template seleccionado para que se vea el HTML correspondiente */ 
    this.template=this._assignmentService.getTemplate();
    if(this.template!=null){
      this._assignmentService.getInfoAssignment(this.assignment).subscribe(
        result=>{
          this.template_select = result.assignment[0].template_select;
        },
        error=>{
          console.log(<any>error);
        }
      );
    }//fin IF
  }//Fin ngOnINit

  //*************** funcion para las notificaciones
  public showNotification( type: string, message: string ): void {
    this.notifier.notify( type, message );
  }
  
  onSubmit(materialForm){  
    this.material.name = this.material.name.trim();  
    //Saber si es un archivo o enlace
    if(this.option){   
      //Para una notificacion se necesita especificar el tipo y el mensaje a mostrar   
      this.showNotification('info',"Validando datos....");
      if(!this.filesToUpload){
        this.showNotification('error',"No has seleccionado un archivo");
      }else{
        //Se usa el servicio AddMaterial que se conecta al back para guardar los datos en la tabla
        this._materialService.AddMaterial(this.material,this.token).subscribe(
          result=>{       
            //Si se agrego correctamente, se obtiene la info  
            if(result.material){            
              this.material = result.material;
              this.material_id = result.material_id;                                              
              //Subir archivo al servidor            
              this._uploadService.makeFileRequest(this.url+'uploadFile/'+this.material_id,[],this.filesToUpload,'file') 
                  .then((result:any)=>{
                    this.material.file=result.file;                                                         
                    if(result.code==400){
                      this.showNotification('error',result.message);                                                          
                    }
                    //Si el archivo se guardo con exito se muestra la notificación
                    else if(result.code==200){
                      this.showNotification('success',"Material guardado correctamente");
                      setTimeout(()=>{                                                     
                          this._router.navigate(['/inicio']); 
                          this.material= new Material('','','','','','','','','');
                          materialForm.reset();                        
                      },1500);    
                    }
                  });                                                                                                             
            }else{  //Error en addmaterial             
              this.showNotification('error',result.message);
            }          
          },//Fin result=>
          error=>{
            console.log(<any>error);
            this.showNotification('error',"Algo salio mal");
          }
        );//Fin addmaterial
      }
    }//FIN IF option
    else{//Option == link
      this.showNotification('info',"Validando datos....");
      this.material.tipoVD='Enlace';      
      this._materialService.AddMaterial(this.material,this.token).subscribe(
        result=>{          
          if(result.material){            
            this.material = result.material;
            this.material_id = result.material_id;                         
            this.showNotification('success',"Material guardado correctamente");
            setTimeout(()=>{                                             
              this._router.navigate(['/inicio']);  
              this.material= new Material('','','','','','','','',null);            
            },1000);
          }else{            
            this.showNotification('error',result.message);
          }          
        },//Fin result=>
        error=>{
          console.log(<any>error);
          this.showNotification('error',"Algo salio mal");
        }
      );//Fin addmaterial
    }//FIN else option   
  }//Fin onSubmit
  
  fileChangeEvent(fileInput:any){
    this.filesToUpload= <Array<File>>fileInput.target.files;
  }
  
}//Fin class
