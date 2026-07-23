import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { CLASSES, LIMITE_CARGA_HORARIA_MENSAL, NIVEIS, TITULACOES } from '../../constants/remuneracao.constants';
import { ProfessorData } from '../../models/professor.model';
import { CalculoResultado } from '../../models/resultado.model';
import { RemuneracaoService } from '../../services/remuneracao.service';

function cargaHorariaValidator(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  if (valor === null || valor === undefined || valor === '') {
    return { obrigatoria: true };
  }
  if (valor <= 0) {
    return { invalida: true };
  }
  if (valor > LIMITE_CARGA_HORARIA_MENSAL) {
    return { acimaLimite: true };
  }
  return null;
}

function dataAdmissaoValidator(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  if (!valor) {
    return { obrigatoria: true };
  }

  const data = new Date(valor);
  const hoje = new Date();
  hoje.setHours(23, 59, 59, 999);
  if (data > hoje) {
    return { dataFutura: true };
  }

  return null;
}

@Component({
  selector: 'app-calc',
  imports: [
    ReactiveFormsModule,
    CurrencyPipe,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './calc.html',
  styleUrl: './calc.css',
})
export class Calc {
  private readonly fb = inject(FormBuilder);
  private readonly remuneracaoService = inject(RemuneracaoService);

  readonly classes = CLASSES;
  readonly niveis = NIVEIS;
  readonly titulacoes = TITULACOES;
  readonly hoje = new Date();

  readonly resultado = signal<CalculoResultado | null>(null);

  readonly form = this.fb.group({
    dataAdmissao: [null as Date | null, [dataAdmissaoValidator]],
    cargaHoraria: [null as number | null, [cargaHorariaValidator]],
    classe: [null as string | null, Validators.required],
    nivel: [null as string | null, Validators.required],
    titulacao: [null as string | null, Validators.required],
    dependentes: [0 as number | null],
  });

  selecionarTitulacao(value: string): void {
    this.form.get('titulacao')?.setValue(value);
  }

  calcular(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    const professor: ProfessorData = {
      dataAdmissao: v.dataAdmissao!,
      cargaHorariaMensal: v.cargaHoraria!,
      classe: v.classe!,
      nivel: v.nivel!,
      titulacao: v.titulacao!,
      dependentes: v.dependentes ?? 0,
    };

    this.resultado.set(this.remuneracaoService.calcular(professor));
  }
}
