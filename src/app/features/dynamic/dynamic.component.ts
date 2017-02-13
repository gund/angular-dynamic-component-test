import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  DoCheck,
  Injector,
  Input,
  KeyValueChangeRecord,
  KeyValueDiffers,
  OnChanges,
  OnDestroy,
  Provider,
  ReflectiveInjector,
  SimpleChange,
  SimpleChanges,
  Type,
  ViewContainerRef
} from '@angular/core';
import { Subject } from 'rxjs/Subject';

const UNINITIALIZED = Object.freeze({ __uninitialized: true });

class CustomSimpleChange extends SimpleChange {
  isFirstChange() {
    return this.previousValue === UNINITIALIZED || super.isFirstChange();
  }
}

@Component({
  selector: 'app-dynamic',
  template: ''
})
export class DynamicComponent implements OnChanges, DoCheck, OnDestroy {

  @Input() component: Type<any>;
  @Input() inputs: { [k: string]: any } = {};
  @Input() outputs: { [k: string]: Function } = {};
  @Input() injector: Injector;
  @Input() providers: Provider[];
  @Input() content: any[][];

  private _componentRef: ComponentRef<any>;
  private _lastInputChanges: SimpleChanges;
  private _inputsDiffer = this._differs.find(this.inputs).create(null);
  private _destroyed$ = new Subject<void>();

  constructor(
    private _vcr: ViewContainerRef,
    private _cfr: ComponentFactoryResolver,
    private _differs: KeyValueDiffers
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    const componentChange = changes['component'];

    if (componentChange) {
      this.createDynamicComponent();
      this.updateInputs(true);
      this.bindOutputs();
    }
  }

  ngDoCheck() {
    const inputsChanges = this._inputsDiffer.diff(this.inputs);

    if (inputsChanges) {
      const isNotFirstChange = !!this._lastInputChanges;
      this._lastInputChanges = this._collectChangesFromDiffer(inputsChanges);

      if (isNotFirstChange) {
        this.updateInputs();
      }
    }
  }

  ngOnDestroy() {
    this._destroyed$.next();
  }

  createDynamicComponent() {
    this._vcr.clear();

    this._componentRef = this._vcr.createComponent(
      this._cfr.resolveComponentFactory(this.component),
      0, this._resolveInjector(), this.content
    );
  }

  updateInputs(isFirstChange = false) {
    Object.keys(this.inputs).forEach(p => this._componentRef.instance[p] = this.inputs[p]);
    this.notifyOnInputChanges(this._lastInputChanges, isFirstChange);
  }

  bindOutputs() {
    this._destroyed$.next();

    Object.keys(this.outputs)
      .filter(p => this._componentRef.instance[p])
      .forEach(p => this._componentRef.instance[p]
        .takeUntil(this._destroyed$)
        .subscribe(this.outputs[p]));
  }

  notifyOnInputChanges(changes: SimpleChanges, forceFirstChanges: boolean) {
    if (forceFirstChanges) {
      changes = this._collectFirstChanges();
    }

    if (changes) {
      this._componentRef.instance.ngOnChanges(changes);
    }
  }

  private _collectFirstChanges(): SimpleChanges {
    const changes = {} as SimpleChanges;

    Object.keys(this.inputs).forEach(prop =>
      changes[prop] = new CustomSimpleChange(UNINITIALIZED, this.inputs[prop]));

    return changes;
  }

  private _collectChangesFromDiffer(differ: any): SimpleChanges {
    const changes = {} as SimpleChanges;

    differ.forEachItem((record: KeyValueChangeRecord) =>
      changes[record.key] = new CustomSimpleChange(record.previousValue, record.currentValue));

    differ.forEachAddedItem((record: KeyValueChangeRecord) =>
      changes[record.key].previousValue = UNINITIALIZED);

    return changes;
  }

  private _resolveInjector(): Injector {
    let injector = this.injector || this._vcr.parentInjector;

    if (this.providers) {
      injector = ReflectiveInjector.resolveAndCreate(this.providers, injector);
    }

    return injector;
  }

}
