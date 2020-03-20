import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';
import { User } from'../../models/user';
import {GLOBAL} from '../../services/global';
import { Assignment } from'../../models/assignment';
import {UserService} from '../../services/user.service';
import {UploadService} from '../../services/upload.service';
import {AssignmentService} from '../../services/assignment.service';
import {TopicService} from '../../services/topic.service';
import { Topic } from'../../models/topic';
import {SubtopicService} from '../../services/subtopic.service';
import { Subtopic } from'../../models/subtopic';
import {map, startWith} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'loadprogram',
  templateUrl: './loadprogram.component.html',
  styleUrls: ['./loadprogram.component.css'],
  providers: [UserService,UploadService,AssignmentService,TopicService,SubtopicService]
})
export class LoadProgramComponent implements OnInit {
  //Varibles a usar
	public url:string;
	public token;
  public identity;public assignments:Assignment[];
  private notifier: NotifierService;  
  myControl = new FormControl();
  filteredOptions: Observable<Assignment[]>;
  public assignment;
  public topics:Topic[];
  public subtopics:Subtopic[];
  public space=' ';//Para hacer espacion entre el num_topic y su nombre
  public topicsFile: Array<File>;
  public subtopicsFile: Array<File>;
  public temario;

  constructor(
    private _userService:UserService,
		private _uploadService:UploadService,
    private _assignmentService:AssignmentService,
    private notifierService: NotifierService,
    private _topicService:TopicService,
    private _subtopicService:SubtopicService
  ) {
    this.url=GLOBAL.url;
		this.identity=this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.notifier = notifierService;   
    this.temario='inicio'; 
  }

  ngOnInit() {
    //obtener el listado de asignaturas actuales y guardar en un arreglo
		this._assignmentService.getInfoAssignments().subscribe(
			response=>{
				this.assignments=response.assignments;
        //console.log(this.assignments);
        this.filteredOptions = this.myControl.valueChanges
        .pipe( startWith<string | Assignment>(''), map(value => typeof value === 'string' ? value : value.assignment_name),
        map(name => name ?  this._filter(name) : this.assignments.slice()) );			
			},
			error=>{
				console.log(<any>error);
			}
    );//Fin assignmentService
   
  }//FIN ngOnInit
  
  // ------------- Funcion para las notificaciones
	public showNotification( type: string, message: string ): void {
		this.notifier.notify( type, message );
  }
  
  // ------------- Funcion para acceder a la info de la asignatura
  ver(opt){
    if(this.myControl.value.assignment_id){//se usa saber si se ha seleccionado una assignatura valida
      //Obtener topics y subtopics
      var l = [];    
      this._topicService.getInfoTopics(this.myControl.value.assignment_id).subscribe(
        result=>{
            this.topics=result.topics;
            if(this.topics.length == 0){
              this.showNotification('warning','No hay temario cargado');
              this.temario='no';
            }else{              
              setTimeout(()=>{ 
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
                }//FIn for 
              },800);
              this.temario = 'si';
              if(!opt){
                this.showNotification('success','Temario ya existe para esta asignatura');
              }
              
            }//FIn else                    
          },
          error=>{
            console.log(<any>error);
            this.showNotification('error',"Algo salió mal");
          }
      );
    }else{
      this.showNotification('error',"Selecciona una asignatura válida");
      this.temario='null'
    }
  }//FIn ver()

  // ------------- Funciones para el autocomplete
	displayFn(assig?: Assignment): string | undefined {
		return assig ? assig.assignment_name : undefined;
	}
	private _filter(value: string): Assignment[] {
		const filterValue = value.toLowerCase();	
		return this.assignments.filter(option => option.assignment_name.toLowerCase().includes(filterValue));
  }
  
  // ------------- Funciones para los archivo
  fileChangeEvent(fileInput:any){
    this.topicsFile= <Array<File>>fileInput.target.files;
  }
  fileChangeEvent2(fileInput:any){
    this.subtopicsFile= <Array<File>>fileInput.target.files;
  }

  // ------------- Funcion para cargar el temario
  carga(){    
    this._uploadService.makeFileRequest(this.url+'uploadCatalogoTopics/'+this.myControl.value.assignment_id,[],this.topicsFile,'file')
      .then((result:any)=>{                               
        //console.log(result);         
      });  
      setTimeout(()=>{ 
        this._uploadService.makeFileRequest(this.url+'uploadCatalogoSubtopics/'+this.myControl.value.assignment_id,[],this.subtopicsFile,'file') 
        .then((result:any)=>{        
          //console.log(result);                           
        });
        this.showNotification('success',"Temario guardado correctamente");  
        this.ver(true);
      },1200);    
      
  }
}
