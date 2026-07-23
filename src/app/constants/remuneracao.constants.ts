// Constantes do cálculo de remuneração de professores da SEDUC-PA.
// Mantidas centralizadas aqui para facilitar atualização quando o PCCR mudar.

export interface OpcaoSelecao {
  label: string;
  value: string;
}

export interface Jornada {
  /** carga horária mensal de regência mínima para se enquadrar nesta jornada */
  limiteMinimoHoras: number;
  /** horas mensais que definem a jornada (100, 150 ou 200) */
  horasMensais: number;
  /** vencimento base de referência (classe I, nível A) para esta jornada */
  vencimentoBase: number;
}

export interface Titulacao {
  value: string;
  label: string;
  descricao: string;
  /** percentual da gratificação de titularidade sobre o vencimento base do CARGO (não o vencimento progredido do professor) */
  percentual: number;
}

export interface FaixaMagisterioVpni {
  /** ano de admissão até o qual esta faixa se aplica */
  anoAdmissaoAte: number;
  valor: number;
}

export interface FaixaIrrf {
  /** limite superior da base de cálculo para esta faixa */
  ate: number;
  aliquota: number | null;
  deducao: number | null;
  /** false = faixa ainda não confirmada no documento de regras fornecido */
  confirmado: boolean;
}

export const LIMITE_CARGA_HORARIA_MENSAL = 220;

// Ordenado da maior para a menor jornada: a primeira faixa cujo limite mínimo
// a carga horária atende é a jornada do professor.
export const JORNADAS: Jornada[] = [
  { limiteMinimoHoras: 150, horasMensais: 200, vencimentoBase: 4881.82 },
  { limiteMinimoHoras: 112.5, horasMensais: 150, vencimentoBase: 3661.37 },
  { limiteMinimoHoras: 0, horasMensais: 100, vencimentoBase: 2440.91 },
];

export const PERCENTUAL_HORA_ATIVIDADE = 0.2;

export const PERCENTUAL_PROGRESSAO_VERTICAL_POR_CLASSE = 0.015;
export const PERCENTUAL_PROGRESSAO_HORIZONTAL_POR_NIVEL = 0.005;

export const CLASSES: OpcaoSelecao[] = [
  { label: 'Classe I', value: '0' },
  { label: 'Classe II', value: '1' },
  { label: 'Classe III', value: '2' },
  { label: 'Classe IV', value: '3' },
];

export const NIVEIS: OpcaoSelecao[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'].map(
  (letra, indice) => ({ label: `Nível ${letra}`, value: String(indice) }),
);

export const TITULACOES: Titulacao[] = [
  { value: 'graduacao', label: 'Licenciatura / Graduação', descricao: 'Sem gratificação de titularidade', percentual: 0 },
  { value: 'especializacao', label: 'Especialização em Educação', descricao: '+10% sobre o vencimento base', percentual: 0.1 },
  { value: 'mestrado', label: 'Mestrado', descricao: '+20% sobre o vencimento base', percentual: 0.2 },
  { value: 'doutorado', label: 'Doutorado', descricao: '+30% sobre o vencimento base', percentual: 0.3 },
];

export const PERCENTUAL_GRATIFICACAO_ESCOLARIDADE = 0.8;

export const PERCENTUAL_ATS_POR_TRIENIO = 0.05;
export const LIMITE_TRIENIOS_ATS = 12;
export const PERCENTUAL_MAXIMO_ATS = 0.6;

// Faixas provisórias da gratificação de magistério / VPNI, conforme informado
// no documento de regras. Devem ser confirmadas/atualizadas quando houver
// fonte oficial definitiva.
export const FAIXAS_MAGISTERIO_VPNI: FaixaMagisterioVpni[] = [
  { anoAdmissaoAte: 2011, valor: 328.29 },
  { anoAdmissaoAte: 2019, valor: 280.0 },
  { anoAdmissaoAte: 2021, valor: 244.15 },
  { anoAdmissaoAte: Infinity, valor: 0 },
];

export const VALOR_AUXILIO_ALIMENTACAO = 1500.0;

export const PERCENTUAL_FINANPREV = 0.14;

export const DEDUCAO_POR_DEPENDENTE_IR = 189.59;

// Tabela do IRRF: apenas a faixa acima de R$ 4.664,68 foi confirmada no
// documento de regras (alíquota 27,5%, parcela a deduzir R$ 908,73). As
// faixas abaixo (isento, 7,5%, 15%, 22,5%) NÃO foram informadas no documento
// e precisam ser confirmadas antes de uso oficial — ver RemuneracaoService.
export const TABELA_IRRF: FaixaIrrf[] = [
  { ate: 4664.68, aliquota: null, deducao: null, confirmado: false },
  { ate: Infinity, aliquota: 0.275, deducao: 908.73, confirmado: true },
];
