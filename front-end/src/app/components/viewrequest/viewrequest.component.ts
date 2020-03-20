import { Component,OnInit,Input,ViewChild} from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import { Assignment } from'../../models/assignment';
import {AssignmentService} from '../../services/assignment.service';
import { User } from'../../models/user';
import {UserService} from '../../services/user.service';
import { Request } from'../../models/request';
import {RequestService} from '../../services/request.service';
import {GLOBAL} from '../../services/global';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'viewrequest',
  templateUrl: './viewrequest.component.html',
  styleUrls: ['./viewrequest.component.css'],
  providers: [UserService,AssignmentService,RequestService]
})
export class ViewRequestComponent implements OnInit{
	public subtopic;
	public requests:Request[];
	public url;
  public type;
  public template;
  public template_select;
  public identity;
  public title;
  public displayedColumns: string[] = ['Nombre','Subtema','Profesor','Estatus','Acciones'];
  public dataSource;
  private notifier: NotifierService;
  public ocultar = { 'display':'' };

  @ViewChild(MatPaginator) paginator: MatPaginator;
	constructor(
    private _route:ActivatedRoute,
    private _router:Router,
    private _userService:UserService,
    private _requestService:RequestService,
    private _assignmentService:AssignmentService,
    private notifierService: NotifierService
  ){
    this.url=GLOBAL.url;    
    this.identity=this._userService.getIdentity(); 
    this.title = "Solicitudes"
    this.notifier = notifierService;
  }
  ngOnInit(){
      if(this.identity.role != 'ROLE_ADMIN_MAESTRO'){
        this.ocultar.display = 'none';
      }
      this._requestService.ViewRequest(this.identity.assignment_id).subscribe(
      response=>{
        this.requests = response.requests;  
        if(this.requests.length == 0){
          this.showNotification('warning',"No hay solicitudes");        
        }
        else{   
          //console.log(this.requests);
          setTimeout(()=>{
            this.dataSource = new MatTableDataSource<Request>(this.requests);
            this.dataSource.paginator = this.paginator;     
          },500);
        } 
      },
      error=>{
        console.log(<any>error);     
        this.showNotification('warning',"Algo salio mal al obtener las solicitudes");   
      }
    );   

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
 }//Fin ngOnInit
// ****************** Funcion para el filtro 
 applyFilter(filterValue: string) {
  this.dataSource.filter = filterValue.trim().toLowerCase();
}
// ****************** Funcion para mostrar las notificaciones
public showNotification( type: string, message: string ): void {
  this.notifier.notify( type, message );
}

 enviar(request){
    this._router.navigate(['/deletematerial',request]);
 }
}