import {Component,OnInit, ViewChild} from '@angular/core';
import {Router,ActivatedRoute,Params} from '@angular/router';
import { User } from'../../models/user';
import {GLOBAL} from '../../services/global';
import { Assignment } from'../../models/assignment';
import { Profesor } from'../../models/profesor';
import {UserService} from '../../services/user.service';
import {UploadService} from '../../services/upload.service';
import {AssignmentService} from '../../services/assignment.service';
import {ProfesorService} from '../../services/profesor.service';
import {map, startWith} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import { NotifierService } from 'angular-notifier';


@Component({
	selector:'updateProfesors',
	templateUrl:'./updateProfesors.component.html',
	styleUrls: ['./updateProfesors.component.css'],
	providers: [UserService,UploadService,AssignmentService,ProfesorService]
})

export class UpdateProfesorsComponent implements OnInit{
	public title:String;
	public user:User;
	public message:string;
	public filesToUploadCatalogProfesor: Array<File>;
	public url:string;
	public token;
	public identity;
	public assignments:Assignment[];
	public assignmentBody;
	public path;
	public option;
	public profesors;
	public newProf:Profesor;
	myControl = new FormControl();
	filteredOptions: Observable<Assignment[]>;
	public displayedColumns: string[] = ['Nombre','Correo','RFC','Acciones'];
	public dataSource;
	private notifier: NotifierService;  

	@ViewChild(MatPaginator) paginator: MatPaginator;

	constructor(
		private _route:ActivatedRoute,
		private _router:Router,
		private _userService:UserService,
		private _uploadService:UploadService,
		private _assignmentService:AssignmentService,
		private _profesorService:ProfesorService,
		private notifierService: NotifierService
	){
		this.url=GLOBAL.url;
		this.identity=this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.option=null;
		this.newProf=new Profesor('','','','','','');
		this.notifier = notifierService;
	}

	ngOnInit(){
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
		);		
	}//FIN ngOnInit

	// ------------- Funciones para el autocomplete
	displayFn(assig?: Assignment): string | undefined {
		return assig ? assig.assignment_name : undefined;
	}
	private _filter(value: string): Assignment[] {
		const filterValue = value.toLowerCase();	
		return this.assignments.filter(option => option.assignment_name.toLowerCase().includes(filterValue));
	}

	// ------------- Funcion para el filtrado en la tabla
	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	// ------------- Funcion para las notificaciones
	public showNotification( type: string, message: string ): void {
		this.notifier.notify( type, message );
	}

	// ------------- Funcion para poder ver la tabla de profesores
	ver(){
		//console.log(this.myControl.value);
		if(this.myControl.value.assignment_id){//se usa saber si se ha seleccionado una assignatura valida
			this._profesorService.getProfesors(this.myControl.value.assignment_id).subscribe(
				response=>{
					this.profesors=response.profesors;
					this.dataSource = new MatTableDataSource<Request>(this.profesors);
					this.dataSource.paginator = this.paginator;
					if(this.profesors.length != 0){
						this.showNotification('info','Lista de profesores cargada');
					}else{
						this.showNotification('warning','No hay profesores registrados');
					}								
				},
				error=>{
				console.log(<any>error);
				this.showNotification('error','Algo salió mal');
				}
			);			
			this.option='ver';	
		}//Fin IF
		else{
			this.showNotification('error',"Selecciona una asignatura válida");
			this.option='error';
		}
		
	}//Fin VER

	// ------------- FUncion para activar el formulario de agregar profesor
	add(){
		this.option='add';		
	}//FIN ADD

	// ------------- Funcion para eliminar un profesor de la asignatura
	eliminar(profData){
		//console.log(profData);
		//console.log(this.token);
		this._profesorService.deleteProfesor(this.myControl.value.assignment_id,profData.profesor_id,this.token).subscribe(
			response=>{
				//console.log(response);
				if(response.code == 200){
					this.showNotification('success',response.message);					
					this.ver();//Volver a cargar la tabla de profesores
				}	
			},
			error=>{
				console.log(<any>error);
				this.showNotification('error',error.message);
			}
		);
	}
	// ------------- Funcion para enviar los datos y guardar el nuevo profesor
	onSubmit(){		
		this.newProf.profesor_name = this.newProf.profesor_name.trim();
		this.newProf.profesor_first_last_name = this.newProf.profesor_first_last_name.trim();
		this.newProf.profesor_second_last_name = this.newProf.profesor_second_last_name.trim();
		//console.log(this.newProf)
		//console.log(this.myControl.value);
		this._profesorService.saveProfesor(this.myControl.value.assignment_id,this.newProf,this.token).subscribe(
			response=>{				
				if(response.code == 200){
					this.showNotification('success',response.message);					
					this.ver();
				}	
				else{
					this.showNotification('error',response.message);
				}			
			},
			error=>{
				console.log(<any>error);
				this.showNotification('error',error.message);
			}
		);
	}//FIN onSubmit
}//FIN class