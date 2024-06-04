import { Component, computed, effect, input } from '@angular/core';

/**
 * Signal Input
 * 参考文献
 * https://blog.angular.dev/signal-inputs-available-in-developer-preview-6a7ff1941823
 * https://angular.io/guide/signal-inputs
 * https://zenn.dev/lacolaco/articles/angular-signal-inputs
 */

@Component({
  selector: 'app-child',
  standalone: true,
  imports: [],
  template: `<p>firstName: {{ firstName() }}</p>
    <p>age: {{ age() }}</p>
    <p>lastName: {{ lastName() }}</p>
    <p>country: {{ country() }}</p>`,
})
export class ChildComponent {
  // optional input & 初期値なし
  firstName = input<string>();
  // optional input & 初期値あり
  age = input(0);

  ageMultiplied = computed(() => this.age() * 2);

  // required input & 初期値なし
  lastName = input.required<string>();

  // aliasing
  country = input('us', { alias: 'homeCountry' });

  // value transform
  disabled = input(false, {
    transform: (value: boolean | string) =>
      typeof value === 'string' ? value === '' : value,
  });

  enabled = input(false);

  constructor() {
    effect(() => {
      // firstName が変更とき"のみ"実行される
      console.log(this.firstName());
    });
  }
}

@Component({
  selector: 'app-parent',
  standalone: true,
  imports: [ChildComponent],
  template: ` <app-child
    [lastName]="'Yamada'"
    [firstName]="'Taro'"
    [age]="20"
    [homeCountry]="'jp'"
    disabled
  ></app-child>`,
})
export class ParentComponent {}

@Component({
  selector: 'app-signal-input',
  standalone: true,
  imports: [ParentComponent],
  template: '<app-parent></app-parent>',
})
export class SignalInputComponent {}
