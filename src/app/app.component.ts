import { Test2Component } from './components/test2/test2.component';
import { Test1Component } from './components/test1/test1.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  component = this.getComponent();
  inputs = { prop1: '123' };
  outputs = { out1: this.onOut1.bind(this) };

  changeComponent() {
    this.component = this.getComponent();
  }

  changeInputs() {
    this.inputs.prop1 = '' + Math.round(Math.random() * 999);
  }

  addInput() {
    this.inputs['new'] = 'really';
  }

  getComponent() {
    return Math.random() > 0.5 ? Test1Component : Test2Component;
  }

  onOut1(data: any) {
    console.log('out1', data);
  }
}
