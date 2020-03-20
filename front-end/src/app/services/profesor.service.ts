import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {GLOBAL} from './global';
import { retry } from 'rxjs/operators';

@Injectable()
export class ProfesorService{
	public url:string;

	constructor(private _http:HttpClient){
		this.url=GLOBAL.url;
	}
	
	getProfesors(assignment): Observable<any>{
		return this._http.get(this.url+'getNameProfesors/'+assignment);
	}

	saveProfesor(assig_id,newProf,token): Observable<any>{
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded', 'Authorization': token});
		let json = JSON.stringify(newProf);
		let params = 'json='+json;		
		return this._http.post(this.url+'saveProfesor/'+assig_id,params,{headers:headers}) ;
	}

	deleteProfesor(assignment_id,prof_id,token): Observable<any>{
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded', 'Authorization': token});
		return this._http.put(this.url + 'deleteProfesor/' + assignment_id + '/' + prof_id,'',{headers:headers});
	}


}

