import { Component, input, model } from '@angular/core';

/**
 * Model Input
 * 参考文献
 *
 *
 */

@Component({
  selector: 'app-parent',
  standalone: true,
  imports: [],
  template: '',
})
export class ParentComponent {
  // model input
  checked = model(false);

  // standard input.
  disabled = input(false);
}

@Component({
  selector: 'app-model-input',
  standalone: true,
  imports: [ParentComponent],
  template: '<app-parent></app-parent>',
})
export class ModelInputComponent {}
