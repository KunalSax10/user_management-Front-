import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appAlphabet]'
})
export class AlphabetDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInput(event: Event): void {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    const inputValue = inputElement.value;
    const regex = /^[a-zA-Z\s]*$/;
    if (!regex.test(inputValue)) {
      event.preventDefault();
      inputElement.value = inputValue.replace(/[^a-zA-Z\s]/g, '');
    }
  }
}