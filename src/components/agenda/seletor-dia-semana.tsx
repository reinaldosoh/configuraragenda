import React from 'react';
import type { DiaSemana } from '../../types/agenda';
import EmptyState from '../ui/empty-state';
import { Calendar } from 'lucide-react';

interface SeletorDiaSemanaProps {
  diasDisponiveis: DiaSemana[];
  diaSelecionado: DiaSemana | null;
  onSelecionarDia: (dia: DiaSemana) => void;
}

/**
 * Componente para selecionar dias da semana
 */
function SeletorDiaSemana({
  diasDisponiveis,
  diaSelecionado,
  onSelecionarDia
}: SeletorDiaSemanaProps): JSX.Element {
  const diasSemana = [
    { valor: 0, label: 'Dom' },
    { valor: 1, label: 'Seg' },
    { valor: 2, label: 'Ter' },
    { valor: 3, label: 'Qua' },
    { valor: 4, label: 'Qui' },
    { valor: 5, label: 'Sex' },
    { valor: 6, label: 'Sáb' }
  ];

  if (diasDisponiveis.length === 0) {
    return (
      <EmptyState
        title="Sem dias disponíveis"
        message="Não há dias disponíveis para agendamento no momento. Por favor, tente novamente mais tarde."
        icon={<Calendar size={48} />}
      />
    );
  }

  return (
    <div className="flex flex-row justify-between w-full mb-4 overflow-x-auto">
      {diasSemana.map((dia) => {
        const disponivel = diasDisponiveis.includes(dia.valor as DiaSemana);
        const selecionado = diaSelecionado === dia.valor;
        
        return (
          <button
            key={dia.valor}
            onClick={() => disponivel && onSelecionarDia(dia.valor as DiaSemana)}
            disabled={!disponivel}
            className={`
              flex flex-col items-center justify-center w-12 h-12 rounded-full mx-1
              ${!disponivel ? 'opacity-40 cursor-not-allowed bg-gray-200 text-gray-500' : 
                selecionado ? 'bg-[#39d2c0] text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}
              transition-colors
            `}
            aria-label={`Selecionar ${dia.label}`}
          >
            <span className="text-sm font-medium">{dia.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default SeletorDiaSemana;
