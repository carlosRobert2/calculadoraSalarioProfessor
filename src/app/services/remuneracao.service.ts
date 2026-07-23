import { Injectable } from '@angular/core';
import { ProfessorData } from '../models/professor.model';
import { CalculoResultado } from '../models/resultado.model';
import {
  DEDUCAO_POR_DEPENDENTE_IR,
  FAIXAS_MAGISTERIO_VPNI,
  JORNADAS,
  LIMITE_TRIENIOS_ATS,
  PERCENTUAL_ATS_POR_TRIENIO,
  PERCENTUAL_FINANPREV,
  PERCENTUAL_GRATIFICACAO_ESCOLARIDADE,
  PERCENTUAL_HORA_ATIVIDADE,
  PERCENTUAL_MAXIMO_ATS,
  PERCENTUAL_PROGRESSAO_HORIZONTAL_POR_NIVEL,
  PERCENTUAL_PROGRESSAO_VERTICAL_POR_CLASSE,
  TABELA_IRRF,
  TITULACOES,
  VALOR_AUXILIO_ALIMENTACAO,
} from '../constants/remuneracao.constants';

@Injectable({ providedIn: 'root' })
export class RemuneracaoService {
  calcular(professor: ProfessorData): CalculoResultado {
    const jornada = JORNADAS.find((j) => professor.cargaHorariaMensal >= j.limiteMinimoHoras)!;

    const classeIndex = Number(professor.classe);
    const nivelIndex = Number(professor.nivel);
    const multiplicadorProgressao =
      1 + classeIndex * PERCENTUAL_PROGRESSAO_VERTICAL_POR_CLASSE + nivelIndex * PERCENTUAL_PROGRESSAO_HORIZONTAL_POR_NIVEL;
    const vencimentoBase = jornada.vencimentoBase * multiplicadorProgressao;

    const horasExtrapolacao = Math.max(0, professor.cargaHorariaMensal - jornada.horasRegenciaBase);
    const horasAtividade = horasExtrapolacao * PERCENTUAL_HORA_ATIVIDADE;
    const horasAulaSuplementar = horasExtrapolacao + horasAtividade;
    const aulasSuplementares = horasExtrapolacao > 0 ? (vencimentoBase / jornada.horasMensais) * horasAulaSuplementar : 0;

    const titulacao = TITULACOES.find((t) => t.value === professor.titulacao)!;
    // Art. 31 da Lei nº 7422/2010: a gratificação de titularidade incide sobre o
    // vencimento base do CARGO (jornada, Classe I/Nível A), não sobre o vencimento
    // já progredido do professor (que varia conforme classe e nível).
    const gratificacaoTitularidade = jornada.vencimentoBase * titulacao.percentual;

    const gratificacaoEscolaridade = vencimentoBase * PERCENTUAL_GRATIFICACAO_ESCOLARIDADE;

    const anosCompletos = this.calcularAnosCompletos(professor.dataAdmissao, new Date());
    const trienios = Math.min(Math.floor(anosCompletos / 3), LIMITE_TRIENIOS_ATS);
    const percentualAdicionalTempoServico = Math.min(trienios * PERCENTUAL_ATS_POR_TRIENIO, PERCENTUAL_MAXIMO_ATS);
    const baseAdicionalTempoServico = vencimentoBase + gratificacaoTitularidade + gratificacaoEscolaridade;
    const adicionalTempoServico = baseAdicionalTempoServico * percentualAdicionalTempoServico;

    const anoAdmissao = professor.dataAdmissao.getFullYear();
    const faixaMagisterio = FAIXAS_MAGISTERIO_VPNI.find((f) => anoAdmissao <= f.anoAdmissaoAte)!;
    const gratificacaoMagisterioVpni = faixaMagisterio.valor;

    const auxilioAlimentacao = VALOR_AUXILIO_ALIMENTACAO;

    const remuneracaoBruta =
      vencimentoBase +
      aulasSuplementares +
      gratificacaoTitularidade +
      gratificacaoEscolaridade +
      adicionalTempoServico +
      gratificacaoMagisterioVpni +
      auxilioAlimentacao;

    const baseFinanprev =
      vencimentoBase + gratificacaoTitularidade + gratificacaoEscolaridade + adicionalTempoServico + gratificacaoMagisterioVpni;
    const finanprev = baseFinanprev * PERCENTUAL_FINANPREV;

    const baseTributavelBruta =
      vencimentoBase +
      aulasSuplementares +
      gratificacaoTitularidade +
      gratificacaoEscolaridade +
      adicionalTempoServico +
      gratificacaoMagisterioVpni;
    const deducaoDependentes = professor.dependentes * DEDUCAO_POR_DEPENDENTE_IR;
    const baseIR = Math.max(0, baseTributavelBruta - finanprev - deducaoDependentes);

    const faixaIR = TABELA_IRRF.find((f) => baseIR <= f.ate)!;
    const irTabelaConfirmada = faixaIR.confirmado;
    const impostoRenda = irTabelaConfirmada ? Math.max(0, baseIR * faixaIR.aliquota! - faixaIR.deducao!) : 0;

    const totalDescontos = finanprev + impostoRenda;
    const remuneracaoLiquida = remuneracaoBruta - totalDescontos;

    return {
      jornadaMensal: jornada.horasMensais,
      vencimentoBase,
      horasExtrapolacao,
      aulasSuplementares,
      gratificacaoTitularidade,
      gratificacaoEscolaridade,
      trienios,
      percentualAdicionalTempoServico,
      adicionalTempoServico,
      gratificacaoMagisterioVpni,
      auxilioAlimentacao,
      remuneracaoBruta,
      baseFinanprev,
      finanprev,
      baseIR,
      impostoRenda,
      irTabelaConfirmada,
      totalDescontos,
      remuneracaoLiquida,
    };
  }

  private calcularAnosCompletos(dataAdmissao: Date, hoje: Date): number {
    let anos = hoje.getFullYear() - dataAdmissao.getFullYear();
    const mesDiferenca = hoje.getMonth() - dataAdmissao.getMonth();
    const diaDiferenca = hoje.getDate() - dataAdmissao.getDate();
    if (mesDiferenca < 0 || (mesDiferenca === 0 && diaDiferenca < 0)) {
      anos--;
    }
    return Math.max(0, anos);
  }
}
