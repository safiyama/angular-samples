import {
  Component,
  Injector,
  Input,
  computed,
  effect,
  input,
} from '@angular/core';

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
  template: `<p>firstName: {{ $firstName() }}</p>
    <p>age: {{ $age() }}</p>
    <p>lastName: {{ $lastName() }}</p>
    <p>country: {{ $country() }}</p>`,
})
export class ChildComponent {
  @Input() name: string | null = null;

  /**
   * 1. optional input & 初期値なし
   * @Input() firstName: string; と同じイメージ
   * Optionalなので初期値なしでも可能。その場合はundefinedが入る
   * @InputSingle型なので、値の書き換えなどは行えない
   */
  $firstName = input<string>();

  /**
   * 2. optional input & 初期値あり
   * @Input() age = 0 と同じイメージ
   * 親コンポーネントから何も渡さなくても初期値が入る
   */
  $age = input(0);

  /**
   * 3. computed (算出Signal)
   * 他のSignalに依存するSignal
   * RxJSは ageMultiplied$ = this.age$.pipe(map((age) => age * 2)); ような感じ？
   * signal<number>型なので $ageMultiplied.set()のような書き換えはできない
   */
  $ageMultiplied = computed(() => this.$age() * 2);

  /**
   * 4. required input & 初期値なし
   * @Input({ required: true }) lastName: string; と同じイメージ
   */
  $lastName = input.required<string>();

  /**
   * 5. alias
   * @Input({ alias: 'homeCountry' }) country: string; と同じイメージ
   * Inputの時に渡すParameter名と実際に格納されるSignalの変数名が異なる場合に使用
   */
  $country = input('us', { alias: 'country' });

  /**
   * 6. transform
   * Inputで渡されれた値を変換して格納する
   * タグにdisabledという属性がある場合に、disabled=trueとして格納したい場合など
   * 別の意味になるものに変換するのは危険なのでNG(公式より)
   */
  disabled = input(false, {
    transform: (value: boolean | string) =>
      typeof value === 'string' ? value === '' : value,
  });

  $enabled = input(false);

  constructor(private injector: Injector) {
    /**
     * 7. Effect
     * Effectに渡された関数の中で、参照しているSignalが変更されたときにeffect()全体が実行される
     * ngDoCheckに似ている気がしないでもない？？
     *
     * [ユースケース]
     * ＊ 表示されているデータと、それが変化したときのログを、解析やデバッグのために記録する。
     * ＊ window.localStorageとデータを同期させる
     */
    effect(() => {
      // firstName が変更とき"のみ"実行される
      console.log(this.$firstName());
    });
  }

  /**
   * 7. Effect (別の書き方)
   * フィールドに直接書くこともできる
   */
  private loggingFirstName = effect(() => {
    console.log(this.$firstName());
  });

  /**
   * 8. Effect (コンストラクター外)
   * Injectorをオプションで渡すことで、コンストラクター外でEffectを実行できる
   */
  initializeLogging(): void {
    effect(
      () => {
        console.log(this.$firstName());
      },
      { injector: this.injector }
    );
  }

  onButton() {
    this.name = 'Taro';
    this.$firstName();

    // 何度呼び出しても、キャッシュされているため初回のみ計算が走る
    this.$ageMultiplied();
    this.$ageMultiplied();
    this.$ageMultiplied();
    this.$ageMultiplied();
    this.$ageMultiplied();

    this.disabled();
  }
}

@Component({
  selector: 'app-parent',
  standalone: true,
  imports: [ChildComponent],
  template: ` <app-child
    [$firstName]="'Taro'"
    [$lastName]="'Yamada'"
    [$age]="20"
    [country]="'jp'"
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

/**
 * 所感
 * ・変数名どうする問題
 * ・現状のプロジェクトだとInputで受け取った値をlocalStoreの中で持たせているので
 *   結局 いつも通りの@Input set firstName() {} で管理するしかないのでは？
 * ・7のやり方でthis.localStoreを呼び出してできなくもないが、本来の役割と違うのでやめたほうがいいきがする
 */
