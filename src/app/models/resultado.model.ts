export interface CalculoResultado {
  jornadaMensal: number;
  vencimentoBase: number;
  horasExtrapolacao: number;
  aulasSuplementares: number;
  gratificacaoTitularidade: number;
  gratificacaoEscolaridade: number;
  trienios: number;
  percentualAdicionalTempoServico: number;
  adicionalTempoServico: number;
  gratificacaoMagisterioVpni: number;
  auxilioAlimentacao: number;
  remuneracaoBruta: number;
  baseFinanprev: number;
  finanprev: number;
  baseIR: number;
  impostoRenda: number;
  /** false = a base caiu em uma faixa da tabela do IRRF ainda não confirmada */
  irTabelaConfirmada: boolean;
  totalDescontos: number;
  remuneracaoLiquida: number;
}
