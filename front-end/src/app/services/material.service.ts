import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {GLOBAL} from './global';

@Injectable()
export class MaterialService{
	public url:string;

	constructor(private _http:HttpClient){
		this.url=GLOBAL.url;
	}

	AddMaterial(material_to_add,token): Observable<any>{
		let json = JSON.stringify(material_to_add);
		let params = 'json='+json;
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded','Authorization': token});
		return this._http.post(this.url+'saveMaterial',params,{headers:headers});
	}
	ViewMaterial(subtopic,type): Observable<any>{
		return this._http.get(this.url+'getInfos/'+subtopic+'/'+type);
	}
	DeleteMaterial(id,token): Observable<any>{
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded','Authorization': token});
		return this._http.delete(this.url+'deleteMaterial/'+id,{headers:headers});
	}
}