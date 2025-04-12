export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      horarios_disponiveis: {
        Row: {
          id: string;
          created_at: string;
          dia_semana: number;
          periodo: string;
          hora_inicio: string;
          hora_fim: string;
          intervalo_minutos: number;
          ativo: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          dia_semana: number;
          periodo: string;
          hora_inicio: string;
          hora_fim: string;
          intervalo_minutos: number;
          ativo?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          dia_semana?: number;
          periodo?: string;
          hora_inicio?: string;
          hora_fim?: string;
          intervalo_minutos?: number;
          ativo?: boolean;
        };
      };
      slots_horarios: {
        Row: {
          id: string;
          created_at: string;
          data_hora: string;
          disponivel: boolean;
          config_id: string | null;
          reserva_id: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          data_hora: string;
          disponivel?: boolean;
          config_id?: string | null;
          reserva_id?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          data_hora?: string;
          disponivel?: boolean;
          config_id?: string | null;
          reserva_id?: string | null;
        };
      };
      reservarData: {
        Row: {
          id: string;
          created_at: string;
          datareserva: string | null;
          userId: string | null;
          status: string | null;
          nomeUser: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          datareserva?: string | null;
          userId?: string | null;
          status?: string | null;
          nomeUser?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          datareserva?: string | null;
          userId?: string | null;
          status?: string | null;
          nomeUser?: string | null;
        };
      };
    };
  };
}
