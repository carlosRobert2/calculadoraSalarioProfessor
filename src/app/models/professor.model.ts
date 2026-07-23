export interface ProfessorData {
  dataAdmissao: Date;
  cargaHorariaMensal: number;
  /** índice da classe: '0' a '3' (Classe I a IV) */
  classe: string;
  /** índice do nível: '0' a '13' (Nível A a N) */
  nivel: string;
  titulacao: string;
  dependentes: number;
}
