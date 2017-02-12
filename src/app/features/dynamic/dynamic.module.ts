import { DynamicComponent } from './dynamic.component';
import { CommonModule } from '@angular/common';
import { ANALYZE_FOR_ENTRY_COMPONENTS, ModuleWithProviders, NgModule, Type } from '@angular/core';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DynamicComponent],
  exports: [DynamicComponent]
})
export class DynamicModule {

  static forRoot(components: Type<any>[]): ModuleWithProviders {
    return {
      ngModule: DynamicModule,
      providers: [
        { provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: components, multi: true }
      ]
    };
  }

}
