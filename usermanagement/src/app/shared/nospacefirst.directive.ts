import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNospacefirst]'
})
export class NospacefirstDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInput(event: any): void {
    const originalValue = this.el.nativeElement.value;
    this.trimSpaces();
    if (originalValue !== this.el.nativeElement.value) {
      this.el.nativeElement.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  @HostListener('change') onChange(): void {
    const originalValue = this.el.nativeElement.value;
    this.trimSpaces();

    if (originalValue !== this.el.nativeElement.value) {
      this.el.nativeElement.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  private trimSpaces(): void {
    const inputElement: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement = this.el.nativeElement;
    const isTextArea = inputElement.tagName.toLowerCase() === 'textarea';

    if (isTextArea || inputElement.tagName.toLowerCase() === 'input') {
      inputElement.value = inputElement.value.replace(/^\s+/g, '');
    } else if (inputElement.tagName.toLowerCase() === 'select') {
      const selectElement: HTMLSelectElement = inputElement as HTMLSelectElement;
      const selectedOption = selectElement.options[selectElement.selectedIndex];
      if (selectedOption) {
        selectedOption.text = selectedOption.text.trim();
      }
    }
  }
}
