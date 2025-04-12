import { supabase } from './supabase';
import type { SlotHorario, DiaSemana } from '../types/agenda';

/**
 * Serviço para gerenciar slots de horários
 */
export const slotsService = {
  /**
   * Busca slots de horários disponíveis para uma data específica
   */
  async buscarPorData(data: Date): Promise<SlotHorario[]> {
    // Formatar a data para o início do dia
    const dataInicio = new Date(data);
    dataInicio.setHours(0, 0, 0, 0);
    
    // Formatar a data para o fim do dia
    const dataFim = new Date(data);
    dataFim.setHours(23, 59, 59, 999);
    
    const { data: slots, error } = await supabase
      .from('slots_horarios')
      .select('*')
      .gte('data_hora', dataInicio.toISOString())
      .lte('data_hora', dataFim.toISOString())
      .order('data_hora', { ascending: true });
    
    if (error) {
      throw new Error(`Erro ao buscar slots de horários: ${error.message}`);
    }
    
    // Mapear os resultados do banco (snake_case) para o formato do frontend (camelCase)
    const slotsFormatados = slots.map(slot => ({
      id: slot.id,
      dataHora: slot.data_hora,
      disponivel: slot.disponivel,
      configId: slot.config_id || '',
      reservaId: slot.reserva_id || undefined
    }));
    
    console.log(`Encontrados ${slotsFormatados.length} slots para a data selecionada`);
    return slotsFormatados;
  },
  
  /**
   * Busca dias da semana com horários disponíveis
   */
  async buscarDiasDisponiveis(): Promise<DiaSemana[]> {
    console.log('Buscando dias da semana disponíveis...');
    
    try {
      const { data, error } = await supabase
        .from('horarios_disponiveis')
        .select('dia_semana')
        .eq('ativo', true)
        .order('dia_semana', { ascending: true });
      
      if (error) {
        console.error('Erro na consulta Supabase:', error);
        throw new Error(`Erro ao buscar dias disponíveis: ${error.message}`);
      }
      
      console.log('Dados de dias disponíveis recebidos:', data);
      
      if (!data || data.length === 0) {
        console.log('Nenhum dia disponível encontrado');
        return [];
      }
      
      // Remove duplicatas
      const diasUnicos = [...new Set(data.map(item => item.dia_semana))];
      console.log('Dias únicos disponíveis:', diasUnicos);
      return diasUnicos as DiaSemana[];
    } catch (error) {
      console.error('Erro ao buscar dias disponíveis:', error);
      throw error;
    }
  },
  
  /**
   * Gera slots de horários para uma data específica com base nas configurações
   * Esta função seria chamada por um processo automatizado ou trigger
   */
  async gerarSlotsParaData(data: Date): Promise<SlotHorario[]> {
    // Obter o dia da semana (0 = Domingo, 6 = Sábado)
    const diaSemana = data.getDay() as DiaSemana;
    
    // Buscar configurações para este dia da semana
    const { data: configs, error } = await supabase
      .from('horarios_disponiveis')
      .select('*')
      .eq('dia_semana', diaSemana)
      .eq('ativo', true);
    
    if (error) {
      throw new Error(`Erro ao buscar configurações: ${error.message}`);
    }
    
    if (configs.length === 0) {
      return []; // Não há configurações para este dia
    }
    
    const slots: SlotHorario[] = [];
    
    // Para cada configuração, gerar slots de horário
    for (const config of configs) {
      const [horaInicio, minutoInicio] = config.hora_inicio.split(':').map(Number);
      const [horaFim, minutoFim] = config.hora_fim.split(':').map(Number);
      // Criar data para o slot (ajustando para o fuso horário local)
      const dataInicio = new Date(data);
      
      // Ajustar para o fuso horário local (Brasil UTC-3)
      // Ao definir a hora local, o JavaScript já ajusta para UTC internamente
      dataInicio.setHours(horaInicio);
      dataInicio.setMinutes(minutoInicio);
      dataInicio.setSeconds(0);
      dataInicio.setMilliseconds(0);
      
      console.log(`Gerando slot para ${data.toLocaleDateString()} às ${horaInicio}:${minutoInicio.toString().padStart(2, '0')} (hora local)`);
      console.log(`Data/hora do slot em ISO: ${dataInicio.toISOString()}`);
      
      const dataFim = new Date(data);
      dataFim.setHours(horaFim);
      dataFim.setMinutes(minutoFim);
      dataFim.setSeconds(0);
      dataFim.setMilliseconds(0);
      
      const intervaloMinutos = config.intervalo_minutos;
      
      // Gerar slots a cada intervalo de minutos
      let slotAtual = new Date(dataInicio);
      
      while (slotAtual < dataFim) {
        // Criar slot para inserir no banco (usando snake_case para os nomes das colunas)
        // Ajustando o fuso horário para armazenar a hora local correta
        
        // Criar uma string ISO mas preservando a hora local
        // Formato: YYYY-MM-DDTHH:MM:SS (sem o Z no final para não converter para UTC)
        const dataLocal = new Date(slotAtual);
        const dataFormatada = `${dataLocal.getFullYear()}-${String(dataLocal.getMonth() + 1).padStart(2, '0')}-${String(dataLocal.getDate()).padStart(2, '0')}T${String(dataLocal.getHours()).padStart(2, '0')}:${String(dataLocal.getMinutes()).padStart(2, '0')}:00`;
        
        const slotParaInserir = {
          data_hora: dataFormatada, // Usar formato sem conversão para UTC
          disponivel: true,
          config_id: config.id
          // reserva_id é null por padrão
        };
        
        console.log('Inserindo slot com hora local preservada:', dataFormatada);
        
        console.log('Inserindo slot:', slotParaInserir);
        
        // Inserir slot no banco
        const { data: slotInserido, error: errorInsert } = await supabase
          .from('slots_horarios')
          .insert(slotParaInserir)
          .select()
          .single();
        
        if (errorInsert) {
          console.error(`Erro ao inserir slot: ${errorInsert.message}`);
        } else if (slotInserido) {
          // Mapear o resultado para o formato esperado pelo frontend (camelCase)
          slots.push({
            id: slotInserido.id,
            dataHora: slotInserido.data_hora,
            disponivel: slotInserido.disponivel,
            configId: slotInserido.config_id || '',
            reservaId: slotInserido.reserva_id || undefined
          });
          console.log('Slot inserido com sucesso:', slotInserido.id);
        }
        
        // Avançar para o próximo slot
        slotAtual = new Date(slotAtual.getTime() + intervaloMinutos * 60000);
      }
    }
    
    return slots;
  },
  
  /**
   * Reserva um slot de horário
   */
  async reservarSlot(slotId: string, userId: string, nomeUser: string): Promise<void> {
    // Iniciar uma transação
    const { data: slot, error: errorSlot } = await supabase
      .from('slots_horarios')
      .select('*')
      .eq('id', slotId)
      .eq('disponivel', true)
      .single();
    
    if (errorSlot) {
      throw new Error(`Erro ao buscar slot: ${errorSlot.message}`);
    }
    
    if (!slot) {
      throw new Error('Slot não encontrado ou não disponível');
    }
    
    // Criar reserva
    const { data: reserva, error: errorReserva } = await supabase
      .from('reservarData')
      .insert({
        datareserva: slot.data_hora,
        "userId": userId, // Usando aspas para corresponder exatamente ao nome da coluna no banco
        status: 'Reservado', // Status sempre será "Reservado"
        "nomeUser": nomeUser // Usando aspas para corresponder exatamente ao nome da coluna no banco
      })
      .select()
      .single();
    
    console.log('Reserva criada:', {
      datareserva: slot.data_hora,
      userId,
      status: 'Reservado',
      nomeUser
    });
    
    if (errorReserva) {
      throw new Error(`Erro ao criar reserva: ${errorReserva.message}`);
    }
    
    // Atualizar slot (usando snake_case para os nomes das colunas)
    const { error: errorUpdate } = await supabase
      .from('slots_horarios')
      .update({
        disponivel: false,
        reserva_id: reserva.id
      })
      .eq('id', slotId);
    
    console.log('Slot atualizado:', slotId, 'com reserva:', reserva.id);
    
    if (errorUpdate) {
      throw new Error(`Erro ao atualizar slot: ${errorUpdate.message}`);
    }
  }
};
