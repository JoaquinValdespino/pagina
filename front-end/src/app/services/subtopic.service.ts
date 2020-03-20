import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {GLOBAL} from './global';
@Injectable()
export class SubtopicService{
	public url:string;

	constructor(private _http:HttpClient){
		this.url=GLOBAL.url;
	}
	
	getInfoSubtopics(topic): Observable<any>{
		return this._http.get(this.url+'getInfoSubtopics/'+topic);
	}
}

