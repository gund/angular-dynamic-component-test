import { Observable } from 'rxjs/Rx';
import { BaseComponent } from '../base/base.component';
import { Component, Input, Output } from '@angular/core';

@Component({
  selector: 'app-test1',
  templateUrl: './test1.component.html',
  styleUrls: ['./test1.component.css']
})
export class Test1Component extends BaseComponent {

  @Input() prop1: string;
  @Output() out1 = Observable.interval(1000).take(10);

}
