import { Component,OnInit,Input,ViewChild} from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import { Assignment } from'../../models/assignment';
import {AssignmentService} from '../../services/assignment.service';
import {UserService} from '../../services/user.service';
import {TopicService} from '../../services/topic.service';
import {SubtopicService} from '../../services/subtopic.service';
import { Subtopic } from'../../models/subtopic';
import {MaterialService} from '../../services/material.service';
import { Material } from'../../models/material';
import {UploadService} from '../../services/upload.service';
import {GLOBAL} from '../../services/global';
import {MatTableDataSource} from '@angular/material';
import {MatPaginator} from '@angular/material';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'viewmaterial',
  templateUrl: './viewmaterial.component.html',
  styleUrls: ['./viewmaterial.component.css'],
  providers: [AssignmentService,UserService,TopicService,SubtopicService,MaterialService,UploadService]
})
export class ViewMaterialComponent implements OnInit{
	public subtopic:Subtopic;
	public materials:Material[];
	public url;
  public type;
  public template;
  public template_select;
  public assignment;
  public displayedColumns: string[] = ['Nombre','Dificultad','Profesor','Tipo','Archivo'];
  public dataSource;
  private notifier: NotifierService;

  @ViewChild(MatPaginator) paginator: MatPaginator;
	constructor(
    private _route:ActivatedRoute,
    private _router:Router,
    private _assignmentService:AssignmentService,
    private _userService:UserService,
    private _topicService:TopicService,
    private _subtopicService:SubtopicService,
    private _materialService:MaterialService,
    private _notifierService: NotifierService

  ){
    this.url=GLOBAL.url;
    this.notifier = _notifierService;
    this.subtopic = new Subtopic('','','','');
  }
  ngOnInit(){
    this.assignment=this._assignmentService.getAssignment();
    this._route.params.subscribe(
      params=>{
            if(params['subtopic_id']!=null){
              this.subtopic.subtopic_id = params['subtopic_id']; 
            }
            if(params['numsubt']!=null){
              this.subtopic.num_subtopic = params['numsubt']; 
            }
            if(params['subtname']!=null){
              this.subtopic.name = params['subtname']; 
            }
            if(params['type']!=null){
              this.type = params['type']; 
            }
      });    
    this._materialService.ViewMaterial(this.subtopic.subtopic_id,this.type).subscribe(
    response=>{
      this.materials = response.materials;
      if(this.materials.length == 0){
        this.showNotification('warning',"No hay materiales");        
      }
      else{    
        setTimeout(()=>{    
          this.dataSource = new MatTableDataSource<Material>(this.materials);
          this.dataSource.paginator = this.paginator;
        },900);
      }
    },
    error=>{
      console.log(<any>error);        
    }
    );   
  
   /*Se obtiene el template seleccionado para que se vea el HTML correspondiente */ 
    this.template=this._assignmentService.getTemplate();
    if(this.template!=null){
      this._assignmentService.getInfoAssignment(this.assignment).subscribe(
        response=>{
          this.template_select = response.assignment[0].template_select;
        },
        error=>{
          console.log(<any>error);
        }
      );
    }//fin IF
  }//Fin ngOnInit

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  public showNotification( type: string, message: string ): void {
    this.notifier.notify( type, message );
	}
}