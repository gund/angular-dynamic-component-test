import { AppComponent } from './app.component';
import { BaseComponent } from './components/base/base.component';
import { Test1Component } from './components/test1/test1.component';
import { Test2Component } from './components/test2/test2.component';
import { DynamicModule } from './features/dynamic/dynamic.module';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    AppComponent,
    Test1Component,
    Test2Component,
    BaseComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    DynamicModule.withComponents([
      Test1Component,
      Test2Component
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
