import {Component,OnInit} from '@angular/core';
import {Router,ActivatedRoute,Params} from '@angular/router';
import { User } from'../../models/user';
import {GLOBAL} from '../../services/global';
import {UserService} from '../../services/user.service';
import {UploadService} from '../../services/upload.service';
import { Assignment } from'../../models/assignment';
import {AssignmentService} from '../../services/assignment.service';
import { NotifierService } from 'angular-notifier';


@Component({
	selector:'register',
	templateUrl:'./register.component.html',
	styleUrls: ['./register.component.css'],
	providers: [UserService,UploadService,AssignmentService]
})

export class RegisterComponent implements OnInit{
	public title:String;
	public user:User;
	public token;
	public message:string;
	public filesToUpload: Array<File>;
	public url:string;
	public assignment_name:string;
	public filesToUploadCatalogProfesor: Array<File>;
	public assignment;
	public identity;
	public clave_assignment:string;
	public hide;
	private notifier: NotifierService;

	constructor(
		private _route:ActivatedRoute,
		private _router:Router,
		private _userService:UserService,
		private _uploadService:UploadService,
		private _assignmentService:AssignmentService,
		private notifierService: NotifierService

	){
		this.title='Registro';
		this.token = this._userService.getToken();
		this.user= new User('','','','','','','','','');
		this.url=GLOBAL.url;
		this.hide=true;
		this.notifier = notifierService;
	}

	ngOnInit(){		
		this.identity=this._userService.getIdentity();
	}

	public showNotification( type: string, message: string ): void {
		this.notifier.notify( type, message );
	}

	onSubmit(registerForm){		
		this.user.assignment_name =this.user.assignment_name.trim();
		this.user.name =  this.user.name.trim();
		this.clave_assignment = this.clave_assignment.trim();
		this._userService.Register(this.user,this.clave_assignment,this.token).subscribe(
			response=>{
				if(response.user){
					this.user = response.user;
					this.user.user_id = response.user_id;
					this.assignment_name=this.user.assignment_name;
					this.showNotification('success',"Asignatura registrada correctamente");
					 if(!this.filesToUpload){
						this._router.navigate(['/inicio']);
			          }else{
			            //Subir archivo
			            this._uploadService.makeFileRequest(this.url+'uploadImage/'+this.user.user_id,[],this.filesToUpload,'image') //AGREGAR TOKEN
			                .then((result:any)=>{
			                  this.user.image=result.image;			                 
							},
							error=>{
								console.log(<any>error);
								this.showNotification('error',"Problemas al subir la imagen");
							});			                  
			          }
					this.user= new User('','','','','','','','','');
					this._router.navigate(['/inicio']);
					//registerForm.reset();
				}else{
					console.log("no es el codigo");
					this.showNotification('error',response.message);
				}
			},
			error=>{
				console.log(<any>error);
				this.showNotification('error',"Algo salió mal, Response");
			}
		);
	}//Fin onSubmit
	fileChangeEvent(fileInput:any){
   	 this.filesToUpload= <Array<File>>fileInput.target.files;
  	}
  	fileChangeEventCatalogProfesor(fileInput:any){
   	 this.filesToUploadCatalogProfesor= <Array<File>>fileInput.target.files;
  	}
}