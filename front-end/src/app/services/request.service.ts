import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {GLOBAL} from './global';

@Injectable()
export class RequestService{
	public url:string;

	constructor(private _http:HttpClient){
		this.url=GLOBAL.url;
	}
	AddRequest(request_to_add,token): Observable<any>{
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded', 'Authorization': token});
		let json = JSON.stringify(request_to_add);
		let params = 'json='+json;
		return this._http.post(this.url+'saveRequest',params,{headers:headers}) ;
	}
	ViewRequest(assignment_id): Observable<any>{
		return this._http.get(this.url+'getRequests/'+assignment_id);
	} 

	updateRequest(request_id,newStatus,token) : Observable<any>{
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded','Authorization': token});
		return this._http.put(this.url + 'updateRequest/' + request_id + '/' + newStatus,'',{headers:headers});
	}
	
}