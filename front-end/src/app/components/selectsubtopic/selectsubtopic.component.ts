import { Component,OnInit,Input} from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import { Assignment } from'../../models/assignment';
import {AssignmentService} from '../../services/assignment.service';
import {UserService} from '../../services/user.service';
import {TopicService} from '../../services/topic.service';
import { Topic } from'../../models/topic';
import {SubtopicService} from '../../services/subtopic.service';
import { Subtopic } from'../../models/subtopic';
import {MaterialService} from '../../services/material.service';
import { Material } from'../../models/material';
import {UploadService} from '../../services/upload.service';



@Component({
  selector: 'selectsubtopic',
  templateUrl: './selectsubtopic.component.html',
  styleUrls: ['./selectsubtopic.component.css'],
  providers: [AssignmentService,UserService,TopicService,SubtopicService,MaterialService,UploadService]
})
export class SelectSubtopicComponent implements OnInit{
 
  public title:String;
  public assignment;
  public template;
  public template_select;
  public subtopics:Subtopic[];
  public material:Material;
  public topics:Topic[];
  public message;
  public filesToUpload: Array<File>;
  public url:string;
  public space;
  public subtopicSelect:Subtopic;

  constructor(
    private _route:ActivatedRoute,
    private _router:Router,
    private _assignmentService:AssignmentService,
    private _userService:UserService,
    private _topicService:TopicService,
    private _subtopicService:SubtopicService,
    private _materialService:MaterialService,
    private _uploadService:UploadService
  ){
    this.title='SelectSubtopic';
    this.space=' ';//para concatener el num_subtopic con su nombre
    this.subtopicSelect= new Subtopic('','','','');
  }
  ngOnInit(){
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
                  }
              );
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

  }//FIN ngOnInit

  onSubmit(type){    
     this._router.navigate(['/viewmaterial',this.subtopicSelect.subtopic_id,this.subtopicSelect.num_subtopic,this.subtopicSelect.name,type]);
    }

}