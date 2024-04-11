import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlphabetDirective } from './alphabet.directive';
import { NospacefirstDirective } from './nospacefirst.directive';



@NgModule({
  declarations: [
    AlphabetDirective,
    NospacefirstDirective
  ],
  imports: [
    CommonModule,

  ],

  exports: [
    AlphabetDirective,
    NospacefirstDirective
  ]
})
export class SharedModule { }
