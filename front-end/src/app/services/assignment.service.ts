import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {GLOBAL} from './global';

@Injectable()
export class AssignmentService{
	public url:string;
	public template;
	public assignment;

	constructor(public  _http:HttpClient){
		this.url=GLOBAL.url;
	}
	
	getInfoAssignments(): Observable<any>{		
		return this._http.get(this.url+'getInfoAssignments');
	}
	getInfoAssignment(assignment_name): Observable<any>{
		return this._http.get(this.url+'getInfoAssignment/'+assignment_name);
	}
	getTemplate(): Observable<any>{
		let template=JSON.parse(localStorage.getItem('template'));
		if(template!="undefined"){
			this.template = template;
		}else{
			this.template = null;
		}
		return this.template;
	}
	getAssignment(): Observable<any>{
		let assignment=localStorage.getItem('assignment');
		if(assignment!="undefined"){
			this.assignment = assignment;
		}else{
			this.assignment = null;
		}
		return this.assignment;
	}
	updateAssignment(assignment_id,tempSelect,token): Observable<any> {
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded', 'Authorization': token});
		let par =  { 'template_select' : tempSelect	}		
		let json = JSON.stringify(par);
		let params = 'json='+json;		
		return this._http.put(this.url + 'updateAssignment/' + assignment_id,params,{headers:headers});
	}
}

