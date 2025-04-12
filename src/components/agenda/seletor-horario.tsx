import React from 'react';
import type { SlotHorario } from '../../types/agenda';
import Card from '../ui/card';
import EmptyState from '../ui/empty-state';
import { Calendar, Clock } from 'lucide-react';

interface SeletorHorarioProps {
  horarios: SlotHorario[];
  horarioSelecionado: string | null;
  onSelecionarHorario: (id: string) => void;
  periodo: 'manha' | 'tarde';
}

/**
 * Componente para seleção de horário
 */
function SeletorHorario({
  horarios,
  horarioSelecionado,
  onSelecionarHorario,
  periodo
}: SeletorHorarioProps): JSX.Element {
  // Função para analisar a string de data/hora e criar um objeto Date
  const parseDataHora = (dataHoraString: string): Date => {
    // Se a string já estiver no formato ISO com 'Z' ou fuso horário, precisamos ajustar para o fuso local (UTC-3)
    if (dataHoraString.endsWith('Z') || dataHoraString.includes('+')) {
      const dataUTC = new Date(dataHoraString);
      
      // Ajustar para o fuso horário do Brasil (UTC-3)
      // Criamos uma nova data com os valores locais para evitar conversões automáticas
      const dataLocal = new Date();
      dataLocal.setFullYear(dataUTC.getUTCFullYear());
      dataLocal.setMonth(dataUTC.getUTCMonth());
      dataLocal.setDate(dataUTC.getUTCDate());
      dataLocal.setHours(dataUTC.getUTCHours());
      dataLocal.setMinutes(dataUTC.getUTCMinutes());
      dataLocal.setSeconds(0);
      dataLocal.setMilliseconds(0);
      
      console.log(`Convertendo ${dataHoraString} para hora local: ${dataLocal.toLocaleTimeString()}`);
      return dataLocal;
    }
    
    // Caso contrário, assumir que é uma data local sem fuso horário
    // e criar um objeto Date sem conversão de fuso
    const [dataParte, horaParte] = dataHoraString.split('T');
    const [ano, mes, dia] = dataParte.split('-').map(Number);
    const [hora, minuto] = horaParte.split(':').map(Number);
    
    // Criar data com valores locais (sem ajuste de fuso)
    return new Date(ano, mes - 1, dia, hora, minuto);
  };
  
  // Filtrar horários pelo período
  const horariosFiltrados = horarios.filter(horario => {
    const data = parseDataHora(horario.dataHora);
    const hora = data.getHours();
    return periodo === 'manha' ? hora < 12 : hora >= 12;
  });

  // Ordenar horários
  const horariosOrdenados = [...horariosFiltrados].sort((a, b) => {
    return parseDataHora(a.dataHora).getTime() - parseDataHora(b.dataHora).getTime();
  });

  // Formatar horário para exibição
  const formatarHorario = (dataHora: string): string => {
    const data = parseDataHora(dataHora);
    return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full">
      {horariosOrdenados.length === 0 ? (
        <EmptyState
          title="Nenhum horário disponível"
          message="Não há horários disponíveis para este período. Tente selecionar outro período ou dia da semana."
          icon={<Clock size={48} />}
        />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {horariosOrdenados.map(horario => (
            <button
              key={horario.id}
              onClick={() => horario.disponivel && onSelecionarHorario(horario.id)}
              disabled={!horario.disponivel}
              className={`
                rounded-lg p-3 text-center transition-colors
                ${!horario.disponivel 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : horarioSelecionado === horario.id
                    ? 'bg-[#39d2c0] text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}
              `}
              aria-label={`Selecionar horário ${formatarHorario(horario.dataHora)}`}
            >
              <span className="font-medium">{formatarHorario(horario.dataHora)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SeletorHorario;
