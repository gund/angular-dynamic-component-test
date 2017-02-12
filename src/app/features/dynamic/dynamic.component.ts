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
  Provider,
  ReflectiveInjector,
  SimpleChange,
  SimpleChanges,
  Type,
  ViewContainerRef
} from '@angular/core';

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
export class DynamicComponent implements OnChanges, DoCheck {

  @Input() component: Type<any>;
  @Input() inputs: { [k: string]: any } = {};
  @Input() injector: Injector;
  @Input() providers: Provider[];
  @Input() content: any[][];

  private _componentRef: ComponentRef<any>;
  private _inputsDiffer = this._differs.find(this.inputs).create(null);
  private _lastInputChanges: SimpleChanges;

  constructor(
    private vcr: ViewContainerRef,
    private cfr: ComponentFactoryResolver,
    private _differs: KeyValueDiffers
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    const componentChange = changes['component'];

    if (componentChange) {
      this.createDynamicComponent();
      this.updateInputs(true);
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

  createDynamicComponent() {
    const factory = this.cfr.resolveComponentFactory(this.component);

    this.vcr.clear();
    this._componentRef = this.vcr.createComponent(factory, 0, this._resolveInjector(), this.content);
  }

  updateInputs(isFirstChange = false) {
    Object.keys(this.inputs).forEach(p => this._componentRef.instance[p] = this.inputs[p]);
    this.notifyOnInputChanges(this._lastInputChanges, isFirstChange);
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
    let injector = this.injector || this.vcr.parentInjector;

    if (this.providers) {
      injector = ReflectiveInjector.resolveAndCreate(this.providers, injector);
    }

    return injector;
  }

}
