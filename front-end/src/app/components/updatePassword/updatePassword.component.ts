import {Component,OnInit} from '@angular/core';
import {Router,ActivatedRoute,Params} from '@angular/router';
import { User } from'../../models/user';
import {GLOBAL} from '../../services/global';
import {UserService} from '../../services/user.service';
import {AssignmentService} from '../../services/assignment.service';
import { Assignment } from'../../models/assignment';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';

@Component({
	selector:'updatePassword',
	templateUrl:'./updatePassword.component.html',
	styleUrls: ['./updatePassword.component.css'],
	providers: [UserService,AssignmentService]
})

export class UpdatePasswordComponent implements OnInit{
	public title:String;
	public admin_prof_user:User;
	public prof_user:User;
	public multi_user:User;
	public message:string;
	public url:string;
	public assignments:Assignment[];
	public assig_select:Assignment;
	public identity;
	public token;
	public template;
	public template_select;	
	public option;//para saber si es el usuario multimedia o un admin-maestro
	myControl = new FormControl();
	filteredOptions: Observable<Assignment[]>;
	public hide = true;
	private notifier: NotifierService;  
	
	constructor(
		private _route:ActivatedRoute,
		private _router:Router,
		private _userService:UserService,
		private _assignmentService:AssignmentService,
		private notifierService: NotifierService
	){
		this.title='Update password';
		this.identity=this._userService.getIdentity();
		this.token = this._userService.getToken();		
		this.url=GLOBAL.url;
		this.option = 'multi';
		this.assig_select=null;
		this.notifier = notifierService;
	}

	ngOnInit(){			
		if(this.identity.role == 'ROLE_ADMIN'){
			this.multi_user = new User(this.identity.sub,'','','','','',this.identity.role,'','');
			this.admin_prof_user = new User('','','','','','','ROLE_ADMIN_MAESTRO','','');
			this.prof_user = new User('','','','','','','ROLE_MAESTRO','','');			
			//obtener el listado de asignaturas actuales y guardar en un arreglo
			this._assignmentService.getInfoAssignments().subscribe(
				response=>{
					this.assignments=response.assignments;
					this.filteredOptions = this.myControl.valueChanges
					.pipe( startWith<string | Assignment>(''), map(value => typeof value === 'string' ? value : value.assignment_name),
					map(name => name ?  this._filter(name) : this.assignments.slice()) );					
				},
				error=>{
					console.log(<any>error);
					this.showNotification('error',"Algo salió mal al obtener las asignaturas");
				}
			);
		}
		else{
			this.admin_prof_user = new User(this.identity.sub,'','','','','',this.identity.role,'','');
			this.prof_user = new User(this.identity.sub+1,'','','','','','','','');
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
		}				
	}//Fin ngOnInit
	
	//Funcion para notificacion
	public showNotification( type: string, message: string ): void {
		this.notifier.notify( type, message );
	}

	//Funciones para el autocomplete
	displayFn(assig?: Assignment): string | undefined {
		return assig ? assig.assignment_name : undefined;
	}
	private _filter(value: string): Assignment[] {
		const filterValue = value.toLowerCase();	
		return this.assignments.filter(option => option.assignment_name.toLowerCase().includes(filterValue));
	}
		
	//Actualizar pass
	onSubmit(dataForm){
		let mapped = Object.keys(dataForm.value).map(function(k){
			return dataForm.value[k];
		}) ;
		if(this.identity.role == 'ROLE_ADMIN' && this.option=='assig'){
			this._userService.getMaster(this.myControl.value.assignment_name).subscribe(
				response=>{							
					this.admin_prof_user.user_id = response.user2[0].user_id;								
					if(mapped[2]=='ROLE_ADMIN_MAESTRO'){						
						mapped[0]=this.admin_prof_user.user_id;		
					}else{						
						mapped[0] = this.admin_prof_user.user_id+1;					
					}										
				},
				error=>{
					console.log(<any>error);
					this.showNotification('error',"Algo salió mal al obtener la información del profesor");
				}
			);
		}
		setTimeout(()=>{ 												
			//this._userService.updatePassword(this.user.assignment_id,this.user.password,this.token).subscribe(
			this._userService.updatePassword(mapped[0],mapped[1],this.token).subscribe(
				response=>{
					if(response.code==200){					
						this.showNotification('success',"Contraseña actualizada correctamente");
						this._router.navigate(['/updatePassword']);							
					}else{
						console.log('error');
						this.showNotification('error',response.message);
					}
				},
				error=>{
					console.log(<any>error);
					this.showNotification('error',"Algo salió mal al actualizar");
				}			
			);	
		},1000);
	}

	multi(){
		this.option = 'multi';
	}
	assig(){
		this.option='assig';
	}

}