import {Component,OnInit} from '@angular/core';
import {Router,ActivatedRoute,Params} from '@angular/router';
import { User } from'../../models/user';
import {GLOBAL} from '../../services/global';
import {UserService} from '../../services/user.service';
import {UploadService} from '../../services/upload.service';
import {AssignmentService} from '../../services/assignment.service';
import { NotifierService } from 'angular-notifier';

@Component({
	selector:'mydata',
	templateUrl:'./mydata.component.html',
	styleUrls: ['./mydata.component.css'],
	providers: [UserService,UploadService,AssignmentService]
})

export class MyDataComponent implements OnInit{
	public title:String;
	public user:User;
	public message:string;
	public filesToUpload: Array<File>;
	public url:string;
	public assignment_name:string;
	public identity;
	public token;
	public template;
	public template_select;
	private notifier: NotifierService;  

	constructor(
		private _route:ActivatedRoute,
		private _router:Router,
		private _userService:UserService,
		private _uploadService:UploadService,
		private _assignmentService:AssignmentService,
		private notifierService: NotifierService
	){
		this.title='Upload data';
		this.user= new User('','','','','','','','','');
		this.url=GLOBAL.url;
		this.identity=this._userService.getIdentity();
		this.token=this._userService.getToken();
		this.notifier = notifierService;
		//console.log(this.identity);
	}

	ngOnInit(){
		/*Se obtiene el template seleccionado para que se vea el HTML correspondiente */ 
		this.template=this._assignmentService.getTemplate();
		if(this.template!=null){
		  this._assignmentService.getInfoAssignment(this.template.assignment).subscribe(
			response=>{
			  this.template_select = response.assignment[0].template_select;
			  //console.log(this.template_select);
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

	onSubmit(mydataForm){
		if(!this.filesToUpload){
			this.showNotification('error',"No has seleccionado ningún archivo");
		}else{			
			this._uploadService.makeFileRequest(this.url+'uploadNewImage/'+this.identity.sub+'/'+this.identity.image,[],this.filesToUpload,'image') //AGREGAR TOKEN
			.then((result:any)=>{
				this.identity.image=result.image;
				this.showNotification('success',"Imagen actualizada correctamente");
				localStorage.setItem('identity',JSON.stringify(this.identity));
				this.user= new User('','','','','','','','','');
				setTimeout(()=>{ 
					window.location.reload();  
				},800); 
				this._router.navigate(['/inicio']);
			});
		}					
	}

	fileChangeEvent(fileInput:any){
   	 this.filesToUpload= <Array<File>>fileInput.target.files;
  	}
}