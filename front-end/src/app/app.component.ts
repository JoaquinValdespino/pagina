import { Component,DoCheck, OnInit,HostBinding } from '@angular/core';
import {UserService} from './services/user.service';
import {TemplateService} from './services/template.service';
import { Router,ActivatedRoute,Params } from '@angular/router';
import { Template } from'./models/template';
import {AssignmentService} from './services/assignment.service';
import { Assignment } from'./models/assignment';
import {GLOBAL} from './services/global';

//adicional

@Component({
  selector: 'body',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[UserService,TemplateService,AssignmentService]
})
export class AppComponent implements OnInit {
  @HostBinding('style.backgroundColor') 
  body_backgroundColor:string;
  @HostBinding('style.color') 
  body_color:string;
  @HostBinding('style.fontFamily') 
  body_fontFamily:string;

  public style_header = { 'backgroundImage':'' };
  public style_assig_name = {'color':'','fontFamily':''};

  public logoUnam: string;
  public logoFi: string;

  public title;
  public identity;
  public template;
  public assignment;
  public template_select;
  public assignment_id;
  public assignment_name;
  public url:string;
  
  constructor(
  	private _userService:UserService,
    private _route:ActivatedRoute,
    private _router:Router,
    private _templateService:TemplateService,
    private _assignmentService:AssignmentService
  ){
  	this.title= "app";
    this.url=GLOBAL.url;
  }
  ngOnInit(){
    this.identity=this._userService.getIdentity();
    this.assignment=this._assignmentService.getAssignment();
    this.template=this._assignmentService.getTemplate();
    //console.log(this.identity);
    
    if(this.template!=null){
      this.assignment_name = this.template.assignment_name;
      this.assignment_id = this.template.assignment;
      this._assignmentService.getInfoAssignment(this.template.assignment).subscribe(
        response=>{
          this.template_select = response.assignment[0].template_select;
        },
        error=>{
          console.log(<any>error);
        }
      );
    }
    if(this.assignment!=null){
      this._templateService.getInfoTemplate(this.assignment).subscribe(
        response=>{
            //Cargar valores actuales
            this.body_backgroundColor=response.assignment.style_body.backgroundColor;
            this.body_color=response.assignment.style_body.color;
            this.body_fontFamily=response.assignment.style_body.fontFamily;
            this.logoUnam = response.assignment.logos.unam;
            this.logoFi = response.assignment.logos.fi;
            let ruta = this.url + 'getsImage/' +  response.assignment.logos.assig;
            this.style_header.backgroundImage = 'url('+ ruta +')';
            this.style_assig_name.color = response.assignment.style_menu.color;
            this.style_assig_name.fontFamily = response.assignment.style_menu.fontFamily;
            },
            error=>{
              console.log(<any>error);
            }
      );
    }
    

  }
  ngDoCheck(){
    this.identity= this._userService.getIdentity();
    this.assignment=this._assignmentService.getAssignment();
    this.template=this._assignmentService.getTemplate();
  }

  logout(){
    //localStorage.clear();
    if(this.identity.role!="ROLE_ADMIN"){
      localStorage.removeItem('identity');
      localStorage.removeItem('token');
      this.identity=null;
      this._router.navigate(['/inicio']);
    }
    else{
      localStorage.removeItem('identity');
      localStorage.removeItem('token');
      this.identity=null;
      this._router.navigate(['/index'])
    }
   
  }

}
