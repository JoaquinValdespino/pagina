import { Component,OnInit } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import { User } from'../../models/user';
import {GLOBAL} from '../../services/global';
import {UserService} from '../../services/user.service';
import {TemplateService} from '../../services/template.service';
import { Template } from'../../models/template';
import {AssignmentService} from '../../services/assignment.service';
import { NotifierService } from 'angular-notifier';
import { isArray } from 'util';

@Component({
	selector:'login',
	templateUrl:'./login.component.html',
	styleUrls: ['./login.component.css'],
	providers: [UserService,TemplateService,AssignmentService]
})

export class LoginComponent implements OnInit{
	public title:String;
	public user:User;
	public identity;
	public token;
	public status:string;
	public template;
	public template_select;
	public hide;
	private notifier: NotifierService;


	constructor(
		private _route:ActivatedRoute,
		private _router:Router,
		private _userService:UserService,
		private _templateService:TemplateService,
		private _assignmentService:AssignmentService,
		private notifierService: NotifierService
	){
		this.title='Inicio de Sesión';
		this.user= new User('','','','','','','','','');
		this.hide = true;
		this.notifier = notifierService;
	}
 
	ngOnInit(){
		//Si el usuario ya esta logeado
		if (this._userService.getIdentity() != null){
			this._router.navigate(['/inicio']); 
		}

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
	}//FIn ngOnInit

	// *********************** FUncion para las notificaciones
	public showNotification( type: string, message: string ): void {
		this.notifier.notify( type, message );
		}

	onSubmit(){
		this.status='wait';
		this._userService.Login(this.user).subscribe(
			//Datos del usuario
			response=>{						
				if(typeof(response)!='string'){
					this.showNotification('error',"Datos incorrectos");					
					this.status='pause';						
				}		
				else{
					this.token=response; //token									
					this._userService.Login(this.user,'true').subscribe(
						response=>{
							this.identity=response;						
							if(!this.identity || !this.identity.sub){
								//alert('usuario login no correctamente');
								setTimeout(()=>{ 
									this.showNotification('error',"Datos incorrectos");																				
									this.status='pause';																
								},1500);
							}else{
								localStorage.setItem('token',this.token);
								localStorage.setItem('identity',JSON.stringify(this.identity));
								if(this.identity.role=='ROLE_ADMIN'){
									localStorage.removeItem('template');
									localStorage.removeItem('assignment');
									this.showNotification('success',"Iniciando...");
								}
								else{
									this._templateService.getInfoTemplate(this.identity.assignment_id).subscribe(
										response=>{
											this.template=response.assignment;
											//localstorage para la materia y el template
											localStorage.setItem('template',JSON.stringify(this.template));
											localStorage.setItem('assignment',this.identity.assignment_id);	
											this.showNotification('success',"Iniciando...");										
										},
										error=>{
											console.log("Error getInfoTemplate")
											console.log(<any>error);
										}
									);								
								}
								//redireccinamiento cuando inicio sesion
								setTimeout(()=>{ 
									this.status='pause';
									window.location.reload();
									this._router.navigate(['/inicio']);		  
								},1700); 														
							}
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
	}//Fin onSubmit
	
}//FIN clas