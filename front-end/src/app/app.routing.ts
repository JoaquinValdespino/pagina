import { ModuleWithProviders } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';

//componentes
import { InicioComponent } from './components/inicio/inicio.component';
import { IndexComponent } from './components/index/index.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AddMaterialComponent} from './components/addmaterial/addmaterial.component';
import { UpdateTempComponent } from './components/updateTemp/updateTemp.component';
import { ViewMaterialComponent } from './components/viewmaterial/viewmaterial.component';
import { SelectSubtopicComponent } from './components/selectsubtopic/selectsubtopic.component';
import { DeleteMaterialComponent } from './components/deletematerial/deletematerial.component';
import { SelectTemplateComponent } from './components/selectTemplate/selectTemplate.component';
import { MyDataComponent } from './components/mydata/mydata.component';
import { SolicitarEliminacionComponent } from './components/solicitar_eliminacion/solicitar_eliminacion.component';
import { ViewRequestComponent } from './components/viewrequest/viewrequest.component';
import { UpdatePasswordComponent } from './components/updatePassword/updatePassword.component';
import { UpdateProfesorsComponent } from './components/updateProfesors/updateProfesors.component';
import { LoadProgramComponent } from './components/loadprogram/loadprogram.component';


const appRoutes: Routes = [
	{path:'',component:IndexComponent},
	{path:'inicio', component: InicioComponent},
	{path: 'index', component:IndexComponent},	
	{path: 'contacto', component:ContactoComponent},
	{path: 'registro', component:RegisterComponent},
	{path: 'login', component:LoginComponent},	
	{path: 'addmaterial', component:AddMaterialComponent},
	{path: 'updateTemp', component:UpdateTempComponent},
	{path: 'viewmaterial/:subtopic_id/:numsubt/:subtname/:type', component:ViewMaterialComponent},
	{path: 'selectsubtopic', component:SelectSubtopicComponent},
	{path: 'deletematerial', component:DeleteMaterialComponent},
	{path: 'selectTemplate', component:SelectTemplateComponent},
	{path: 'mydata', component:MyDataComponent},
	{path: 'solicitar_eliminacion', component:SolicitarEliminacionComponent},
	{path: 'viewrequest', component:ViewRequestComponent},
	{path: 'updatePassword', component:UpdatePasswordComponent},
	{path: 'updateProfesors', component:UpdateProfesorsComponent},
	{path: 'loadprogram', component:LoadProgramComponent}	
];

export const appRoutingProviders:any[]=[];
export const routing:ModuleWithProviders=RouterModule.forRoot(appRoutes);