import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { Calc } from "./components/calc/calc";

@Component({
  selector: 'app-root',
  imports: [Calc],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Calculadora de Remuneração - SEDUC-PA');
}
