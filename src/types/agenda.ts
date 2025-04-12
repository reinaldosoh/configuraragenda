export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Domingo, 6 = Sábado

export type Periodo = 'manha' | 'tarde';

export interface HorarioDisponivel {
  id: string;
  diaSemana: DiaSemana;
  periodo: Periodo;
  horaInicio: string; // formato HH:MM
  horaFim: string; // formato HH:MM
  intervaloMinutos: number;
  ativo: boolean;
}

export interface SlotHorario {
  id: string;
  dataHora: string; // ISO string
  disponivel: boolean;
  configId: string;
  reservaId?: string;
}

export interface Reserva {
  id: string;
  createdAt: string;
  dataReserva: string; // ISO string
  userId?: string;
  status: 'confirmado' | 'cancelado' | 'pendente';
  nomeUser?: string;
}

export interface DiaSelecionado {
  data: Date;
  horarios: SlotHorario[];
}
