import { Injectable } from '@angular/core';
//import { Http, Response, Headers} from '@angular/http';
//import 'rxjs/add/operator/map';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {GLOBAL} from './global';
@Injectable()
export class TemplateService{
	public url:string;

	constructor(private _http:HttpClient){
		this.url=GLOBAL.url;
	}
	
	getInfoTemplate(assignment_id): Observable<any>{
		return this._http.get(this.url+'getInfoTemplate/'+assignment_id);
	}

	
	updateTemplate(template_id,newTemp,token) : Observable<any>{
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded', 'Authorization': token});
		//let params = JSON.stringify(newTemp);
		let par =  {
			'style_menu' : {
				'backgroundColor' : '',
				'color': '',
				'fontFamily': ''
			},
			'style_body' : {
				'backgroundColor' : '',
				'color': '',
				'fontFamily': ''
			},
			'logos' : {
				'unam' : '',
				'fi' : '',
				'assig' : ''
			}
		}
		//console.log(newTemp);
		par.style_menu = newTemp.style_menu;
		par.style_body = newTemp.style_body;
		par.logos = newTemp.logos;
		let json = JSON.stringify(par);
		let params = 'json='+json;		
		return this._http.put(this.url + 'updateTemplate/' + template_id,params,{headers:headers});
	}
}

