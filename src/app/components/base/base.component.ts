import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  DoCheck,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';

@Component({
  template: ''
})
export class BaseComponent implements OnInit, OnDestroy, OnChanges, DoCheck,
  AfterViewInit, AfterViewChecked, AfterContentInit, AfterContentChecked {

  private get _cmpName(): string {
    return Object.getPrototypeOf(this).constructor.name;
  }

  ngOnInit() {
    console.log('ngOnInit', this._cmpName);
    console.log('inputs', Object.keys(this).map(p => p + '=' + this[p]));
  }

  ngOnDestroy() {
    console.log('ngOnDestroy', this._cmpName);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges', changes);
    console.log('first change?', Object.keys(changes).map(c => changes[c].isFirstChange()));
  }

  ngDoCheck() {
    console.log('ngDoCheck', this._cmpName);
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit', this._cmpName);
  }

  ngAfterViewChecked() {
    console.log('ngAfterViewChecked', this._cmpName);
  }

  ngAfterContentInit() {
    console.log('ngAfterContentInit', this._cmpName);
  }

  ngAfterContentChecked() {
    console.log('ngAfterContentChecked', this._cmpName);
  }

}
