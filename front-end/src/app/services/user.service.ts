import { Injectable } from '@angular/core';
//import { Http, Response, Headers} from '@angular/http';
//import 'rxjs/add/operator/map';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {GLOBAL} from './global';

@Injectable()
export class UserService{
	public url:string;
	public identity;
	public token;

	constructor(private _http:HttpClient){
		this.url=GLOBAL.url;
	}

	Register(user_to_register,clave_assignment,token): Observable<any>{
		let clave = {'clave_assignment' : clave_assignment};
		let join = {};
		Object.assign(join,user_to_register,clave);
		let json = JSON.stringify(join);
		let params = 'json='+json;			
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded','Authorization': token});
		return this._http.post(this.url+'register',params,{headers:headers});
	}
	Login(user_to_login , gettoken=null): Observable<any>{
		if(gettoken != null){
			user_to_login.gettoken = gettoken;
		}
		let json = JSON.stringify(user_to_login);
		let params = 'json='+json;
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'login',params,{headers:headers});
	}
	getIdentity(): Observable<any>{
		let identity=JSON.parse(localStorage.getItem('identity'));
		if(identity!="undefined"){
			this.identity = identity;
		}else{
			this.identity = null;
		}
		return this.identity;
	}

	getToken(): Observable<any>{
		let token=localStorage.getItem('token');
		if(token!="undefined"){
			this.token = token;
		}else{
			this.token = null;
		}
		return this.token;
	}

	getMaster(assignment_name): Observable<any>{
		return this._http.get(this.url+'getMaster/'+assignment_name);
	}

	Upload(user_to_update): Observable<any>{
		let params = JSON.stringify(user_to_update);
		return this._http.put(this.url+'update_user/'+user_to_update._id,params);
	}

	updatePassword(id,password,token): Observable<any>{
		let headers = new HttpHeaders({'Authorization': token});
		return this._http.put(this.url+'updatePassword/'+id+'/'+password,'',{headers:headers}) ;
	}
}