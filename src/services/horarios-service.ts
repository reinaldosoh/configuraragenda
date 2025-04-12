import { supabase } from './supabase';
import type { HorarioDisponivel, DiaSemana, Periodo } from '../types/agenda';

/**
 * Serviço para gerenciar horários disponíveis
 */
export const horariosService = {
  /**
   * Busca todos os horários disponíveis
   */
  async buscarTodos(): Promise<HorarioDisponivel[]> {
    console.log('Buscando todos os horários disponíveis...');
    
    const { data, error } = await supabase
      .from('horarios_disponiveis')
      .select('*')
      .order('dia_semana', { ascending: true });
    
    if (error) {
      console.error('Erro na consulta Supabase:', error);
      throw new Error(`Erro ao buscar horários: ${error.message}`);
    }
    
    console.log('Dados recebidos do Supabase:', data);
    
    if (!data || data.length === 0) {
      console.log('Nenhum horário disponível encontrado');
      return [];
    }
    
    return data.map(item => {
      // Converter string de hora para formato HH:MM se necessário
      const formatarHora = (hora: string | Date): string => {
        if (hora instanceof Date) {
          return hora.toTimeString().substring(0, 5);
        }
        
        if (typeof hora === 'string') {
          // Se já estiver no formato HH:MM, retornar como está
          if (/^\d{2}:\d{2}(:\d{2})?$/.test(hora)) {
            return hora.substring(0, 5);
          }
          
          // Tentar converter de formato ISO ou outro formato de data
          try {
            const data = new Date(hora);
            if (!isNaN(data.getTime())) {
              return data.toTimeString().substring(0, 5);
            }
          } catch (e) {
            console.warn('Erro ao converter hora:', e);
          }
        }
        
        return hora as string;
      };
      
      return {
        id: item.id,
        diaSemana: item.dia_semana as DiaSemana,
        periodo: item.periodo as Periodo,
        horaInicio: formatarHora(item.hora_inicio),
        horaFim: formatarHora(item.hora_fim),
        intervaloMinutos: item.intervalo_minutos,
        ativo: item.ativo
      };
    });
  },
  
  /**
   * Busca horários disponíveis por dia da semana
   */
  async buscarPorDiaSemana(diaSemana: DiaSemana): Promise<HorarioDisponivel[]> {
    console.log(`Buscando horários para o dia da semana: ${diaSemana}`);
    
    const { data, error } = await supabase
      .from('horarios_disponiveis')
      .select('*')
      .eq('dia_semana', diaSemana)
      .eq('ativo', true)
      .order('periodo', { ascending: true });
    
    if (error) {
      console.error('Erro na consulta Supabase:', error);
      throw new Error(`Erro ao buscar horários por dia: ${error.message}`);
    }
    
    console.log(`Dados recebidos para o dia ${diaSemana}:`, data);
    
    if (!data || data.length === 0) {
      console.log(`Nenhum horário disponível para o dia ${diaSemana}`);
      return [];
    }
    
    // Converter string de hora para formato HH:MM se necessário
    const formatarHora = (hora: string | Date): string => {
      if (hora instanceof Date) {
        return hora.toTimeString().substring(0, 5);
      }
      
      if (typeof hora === 'string') {
        // Se já estiver no formato HH:MM, retornar como está
        if (/^\d{2}:\d{2}(:\d{2})?$/.test(hora)) {
          return hora.substring(0, 5);
        }
        
        // Tentar converter de formato ISO ou outro formato de data
        try {
          const data = new Date(hora);
          if (!isNaN(data.getTime())) {
            return data.toTimeString().substring(0, 5);
          }
        } catch (e) {
          console.warn('Erro ao converter hora:', e);
        }
      }
      
      return hora as string;
    };
    
    return data.map(item => ({
      id: item.id,
      diaSemana: item.dia_semana as DiaSemana,
      periodo: item.periodo as Periodo,
      horaInicio: formatarHora(item.hora_inicio),
      horaFim: formatarHora(item.hora_fim),
      intervaloMinutos: item.intervalo_minutos,
      ativo: item.ativo
    }));
  },
  
  /**
   * Cria um novo horário disponível
   */
  async criar(horario: Omit<HorarioDisponivel, 'id'>): Promise<HorarioDisponivel> {
    const { data, error } = await supabase
      .from('horarios_disponiveis')
      .insert({
        dia_semana: horario.diaSemana,
        periodo: horario.periodo,
        hora_inicio: horario.horaInicio,
        hora_fim: horario.horaFim,
        intervalo_minutos: horario.intervaloMinutos,
        ativo: horario.ativo
      })
      .select()
      .single();
    
    if (error) {
      throw new Error(`Erro ao criar horário: ${error.message}`);
    }
    
    return {
      id: data.id,
      diaSemana: data.dia_semana as DiaSemana,
      periodo: data.periodo as Periodo,
      horaInicio: data.hora_inicio,
      horaFim: data.hora_fim,
      intervaloMinutos: data.intervalo_minutos,
      ativo: data.ativo
    };
  },
  
  /**
   * Atualiza um horário existente
   */
  async atualizar(id: string, horario: Partial<Omit<HorarioDisponivel, 'id'>>): Promise<HorarioDisponivel> {
    const { data, error } = await supabase
      .from('horarios_disponiveis')
      .update({
        dia_semana: horario.diaSemana,
        periodo: horario.periodo,
        hora_inicio: horario.horaInicio,
        hora_fim: horario.horaFim,
        intervalo_minutos: horario.intervaloMinutos,
        ativo: horario.ativo
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Erro ao atualizar horário: ${error.message}`);
    }
    
    return {
      id: data.id,
      diaSemana: data.dia_semana as DiaSemana,
      periodo: data.periodo as Periodo,
      horaInicio: data.hora_inicio,
      horaFim: data.hora_fim,
      intervaloMinutos: data.intervalo_minutos,
      ativo: data.ativo
    };
  },
  
  /**
   * Exclui um horário
   */
  async excluir(id: string): Promise<void> {
    const { error } = await supabase
      .from('horarios_disponiveis')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new Error(`Erro ao excluir horário: ${error.message}`);
    }
  },
  
  /**
   * Busca os dias da semana disponíveis
   */
  async buscarDiasDisponiveis(): Promise<DiaSemana[]> {
    const { data, error } = await supabase
      .from('horarios_disponiveis')
      .select('dia_semana')
      .eq('ativo', true)
      .order('dia_semana', { ascending: true });
    
    if (error) {
      throw new Error(`Erro ao buscar dias disponíveis: ${error.message}`);
    }
    
    // Remove duplicatas
    const diasUnicos = [...new Set(data.map(item => item.dia_semana))];
    return diasUnicos as DiaSemana[];
  }
};
