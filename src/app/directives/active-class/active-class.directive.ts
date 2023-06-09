import { Directive, ElementRef, HostListener, Inject, Input, Renderer2 } from '@angular/core';
import { WINDOW } from 'src/app/common/tokens';

/**
 * 在宿主元素被Active时（tap）添加一个CSS类名，并且在指定时间后移除
 */
@Directive({
  selector: '[appActiveClass]'
})
export class ActiveClassDirective {
  /** active的时候添加的CSS类名 */
  @Input() appActiveClass: string;
  /** 多少毫秒后移除CSS类名 */
  @Input() appActiveClassDuration: number;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    @Inject(WINDOW) private window: Window
  ) { }

  @HostListener('tap')
  onTap() {
    const { nativeElement } = this.elementRef;
    const className = this.appActiveClass || 'active';
    this.renderer.addClass(nativeElement, className);

    this.window.setTimeout(() => {
      this.renderer.removeClass(nativeElement, className);
    }, this.appActiveClassDuration || 300);
  }

}
