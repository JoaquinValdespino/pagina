import { Injectable } from '@angular/core';
//import { Http, Response, Headers} from '@angular/http';
//import 'rxjs/add/operator/map';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {GLOBAL} from './global';

@Injectable()
export class UploadService{
	public url:string;

	constructor(private _http: HttpClient){
		this.url = GLOBAL.url;
	}

	makeFileRequest(url:string,params: Array<string>,files:Array<File>,name: string){//AGREGAR TOKEN
		return new Promise(function(resolve,reject){
			var formData: any = new FormData();
			var xhr = new XMLHttpRequest();
			for(var i=0;i<files.length;i++){
				formData.append(name,files[i],files[i].name);
			}
			xhr.onreadystatechange = function(){
				if(xhr.readyState == 4){
					if(xhr.status==200){
						resolve(JSON.parse(xhr.response));
					}else{
						reject(xhr.response);
					}
				}
			}
			xhr.open('POST',url,true);
			//xhr.setRequestHeader('Authorization',token);//PARA EL TOKEN
			xhr.send(formData);
		});
	}
}