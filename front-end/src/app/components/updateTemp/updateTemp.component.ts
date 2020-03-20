import { Assignment } from './../../models/assignment';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import {GLOBAL} from '../../services/global';
import {UserService} from '../../services/user.service';
import {TemplateService} from '../../services/template.service';
import { Template } from '../../models/template';
import {AssignmentService} from '../../services/assignment.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'updateTemp',
  templateUrl: './updateTemp.component.html',
  styleUrls: ['./updateTemp.component.css'],
  providers: [UserService,TemplateService,AssignmentService]
})

export class UpdateTempComponent implements OnInit{
   
    title: string;
    public user: User;
    public identity;
    public token;
    public template;
    public url;    
    public newTemplate: Template;
    private notifier: NotifierService;  
    //variables para cargar los valores actuales
    //auxiliares para los estilos del menu y el body
    auxTemp = { 'backgroundColor': '', 'color': '','fontFamily': '' };
    auxTemp2 = { 'backgroundColor': '', 'color': '','fontFamily': '' };
    tempCollapse = { 'backgroundColor': '', 'color': '','fontFamily': '' };
    public template2;
    public template_select;
    //variables para los logos
    public logos = { 'unam' : '', 'fi' : '', 'assig': '' };
    
    mont = { 'fontSize' : '1em', 'fontFamily' : 'Montserrat', 'backgroundColor' : '', 'color' : '' };
    ubun = { 'fontSize' : '1em', 'fontFamily' : 'Ubuntu', 'backgroundColor' : '', 'color' : '' };
    jos = { 'fontSize' :  '1em', 'fontFamily' : 'Josefin Sans', 'backgroundColor' : '', 'color' : '' };
    rob = { 'fontSize' :  '1em', 'fontFamily' : 'Roboto Mono', 'backgroundColor' : '', 'color' : '' };
    arc = { 'fontSize' :  '1em', 'fontFamily' : 'Architects Daughter', 'backgroundColor' : '', 'color' : '' };
    con = { 'fontSize' :  '1em', 'fontFamily' : 'Concert One', 'backgroundColor' : '', 'color' : '' };
    

    constructor(
      private _route:ActivatedRoute,
      private _router:Router,
      private _userService: UserService,
      private _templateService:TemplateService,
      private _assignmentService:AssignmentService,
      private notifierService: NotifierService
    ) {
      this.title = 'Update';
      this.newTemplate = new Template('',this.auxTemp,this.auxTemp2,this.logos);
      this.url=GLOBAL.url;
      this.notifier = notifierService;
    }

    ngOnInit(){
        this.token = this._userService.getToken();
        this.identity = this._userService.getIdentity();       

        this._templateService.getInfoTemplate(this.identity.assignment_id).subscribe(
            response=>{
                //Cargar valores actuales    
                this.tempCollapse= response.assignment.style_body;       
                this.newTemplate.style_menu.backgroundColor=response.assignment.style_menu.backgroundColor;
                this.newTemplate.style_body.backgroundColor=response.assignment.style_body.backgroundColor;
                this.newTemplate.style_body.color=response.assignment.style_body.color;
                this.newTemplate.style_menu.color=response.assignment.style_menu.color;
                this.newTemplate.style_body.fontFamily=response.assignment.style_body.fontFamily;
                this.newTemplate.style_menu.fontFamily=response.assignment.style_menu.fontFamily;

                this.logos.unam = response.assignment.logos.unam;
                this.logos.fi = response.assignment.logos.fi;
                this.logos.assig = response.assignment.logos.assig;
                
                this.mont.backgroundColor = response.assignment.style_body.backgroundColor;
                this.mont.color = response.assignment.style_body.color;
                this.ubun.backgroundColor = response.assignment.style_body.backgroundColor;
                this.ubun.color = response.assignment.style_body.color;
                this.jos.backgroundColor = response.assignment.style_body.backgroundColor;
                this.jos.color = response.assignment.style_body.color;
                this.rob.backgroundColor = response.assignment.style_body.backgroundColor;
                this.rob.color = response.assignment.style_body.color;
                this.arc.backgroundColor = response.assignment.style_body.backgroundColor;
                this.arc.color = response.assignment.style_body.color;
                this.con.backgroundColor = response.assignment.style_body.backgroundColor;
                this.con.color = response.assignment.style_body.color;
                this.showNotification('success','Valores cargados');
                },
                error=>{
                    console.log(<any>error);
                }
        );


        /*Se obtiene el template seleccionado para que se vea el HTML correspondiente */ 
        this.template2=this._assignmentService.getTemplate();
        if(this.template2!=null){
            this._assignmentService.getInfoAssignment(this.template2.assignment).subscribe(
                response=>{
                this.template_select = response.assignment[0].template_select;
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
        this._templateService.updateTemplate(this.identity.template_id,this.newTemplate,this.token).subscribe(
            response => {
                //updateForm.reset();
                //********************Recargar local storage******************************************
                this._templateService.getInfoTemplate(this.identity.assignment_id).subscribe(
                    response=>{
                        this.showNotification('success','Actualizando plantilla...');
                        this.template=response.assignment;
                        //localStorage.removeItem('template');
                        localStorage.setItem('template',JSON.stringify(this.template));
                        setTimeout(()=>{ 
                            window.location.reload();  
                          },1000);  
                        },
                        error=>{
                            console.log(<any>error);
                        }
                );
                this._router.navigate(['/inicio']);
                }, //Fin de response UpdateTemplate
                error => {
                    console.log(<any>error);
                    this.showNotification('error','Algo salió mal');
                }
        );
    }//Fin onSubmit
}

