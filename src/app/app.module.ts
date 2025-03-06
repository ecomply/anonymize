import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule,
    AppComponent,
    UploadComponent } from '@angular/common/http';

import {  } from './app.component';
import { UploadComponent } from './upload/upload.component';

@NgModule({
  declarations: [
    
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }