import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {routing,appRoutingProviders} from './app.routing';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { MatAutocompleteModule, MatFormFieldModule,
         MatInputModule, MatIconModule, MatButtonToggleModule,
         MatSelectModule, MatPaginatorModule, MatTableModule,
         MatProgressSpinnerModule, MatRadioModule, MatExpansionModule,
         MatSidenavModule} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule} from '@angular/material';

/**
 * Custom angular notifier options
 */
const customNotifierOptions: NotifierOptions = {
  position: {
		horizontal: {
			position: 'right',
			distance: 12
		},
		vertical: {
			position: 'top',
			distance: 12,
			gap: 10
		}
	},
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 5
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

//componentes
import { AppComponent } from './app.component';
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




//Servicios
import {UserService} from './services/user.service';
import {TemplateService} from './services/template.service';
import {AssignmentService} from './services/assignment.service';
import {TopicService} from './services/topic.service';
import {SubtopicService} from './services/subtopic.service';
import {MaterialService} from './services/material.service';
import {UploadService} from './services/upload.service';
import {ProfesorService} from './services/profesor.service';
import {RequestService} from './services/request.service';



//Pipes
import {SafePipe} from './pipes/safe.pipe';
import { from } from 'rxjs';



@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    IndexComponent,
    ContactoComponent,
    RegisterComponent,
    LoginComponent,    
    AddMaterialComponent,
    UpdateTempComponent,
    ViewMaterialComponent,
    SelectSubtopicComponent,
    SafePipe,
    DeleteMaterialComponent,
    SelectTemplateComponent,
    MyDataComponent,
    SolicitarEliminacionComponent,
    ViewRequestComponent,
    UpdatePasswordComponent,
    UpdateProfesorsComponent,
    LoadProgramComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    routing,
    MatAutocompleteModule, 
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatPaginatorModule,
    MatTableModule,
    BrowserAnimationsModule,
    MatButtonModule, 
    MatProgressSpinnerModule,
    MatRadioModule,
    MatExpansionModule,
    MatSidenavModule,
    MatCheckboxModule,
    NotifierModule.withConfig(customNotifierOptions)
  ],
  providers: [
    appRoutingProviders,{provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
