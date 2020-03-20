import { Component,OnInit} from '@angular/core';
import {TemplateService} from '../../services/template.service';
import {AssignmentService} from '../../services/assignment.service';
import { Router,ActivatedRoute,Params } from '@angular/router';
import { Assignment } from'../../models/assignment';
import {GLOBAL} from '../../services/global';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';


@Component({
  selector: 'index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  providers: [AssignmentService,TemplateService]
})
export class IndexComponent implements OnInit{
   
  public assignment;
  public template;
  public assignments:Assignment[];
  public url:string;
  myControl = new FormControl();
	filteredOptions: Observable<Assignment[]>;  

  constructor(
    private _route:ActivatedRoute,
    private _router:Router,
    private _assignmentService:AssignmentService,
    private _templateService:TemplateService
  ){    
    this.url=GLOBAL.url;
  }
  ngOnInit(){
    //Para que cada vez que se abra una nueva pestaña te envie directamente al index(asignaturas)
     localStorage.removeItem('template');
      localStorage.removeItem('assignment');
      localStorage.removeItem('identity');
      localStorage.removeItem('token');
      //obtener el listado de asignaturas actuales y guardar en un arreglo
      this._assignmentService.getInfoAssignments().subscribe(
        response=>{
            this.assignments=response.assignments;
            //console.log(response.assignments);
          },
          error=>{
            console.log(<any>error);
          }
      );
      setTimeout(()=>{ 
				this.filteredOptions = this.myControl.valueChanges
      .pipe( startWith<string | Assignment>(''), map(value => typeof value === 'string' ? value : value.assignment_name),
      map(name => name ?  this._filter(name) : this.assignments.slice()) );				
			},2500);	
      
    }//FIN ngOnInit

  //Funciones para el autocomplete
	displayFn(assig?: Assignment): string | undefined {
		return assig ? assig.assignment_name : undefined;
	}
	private _filter(value: string): Assignment[] {
		const filterValue = value.toLowerCase();	
		return this.assignments.filter(option => option.assignment_name.toLowerCase().includes(filterValue));
	}
  onSubmit(){    
    this.assignment = this.myControl.value.assignment_id;
    this._templateService.getInfoTemplate(this.assignment).subscribe(
       response=>{
            this.template=response.assignment;
            localStorage.removeItem('template');
            localStorage.removeItem('assignment');
            //localstorage para la materia y el template
            localStorage.setItem('template',JSON.stringify(this.template));
            localStorage.setItem('assignment',this.assignment);
            window.location.reload(); //Necesario
          },
          error=>{
            console.log(<any>error);
          }
      );      
      this._router.navigate(['/inicio']);      
  }//FIN onSubmit
}//Fin class
