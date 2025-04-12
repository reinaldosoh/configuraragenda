import React from 'react';
import type { Periodo } from '../../types/agenda';

interface SeletorPeriodoProps {
  periodoSelecionado: Periodo;
  onSelecionarPeriodo: (periodo: Periodo) => void;
  periodosDisponiveis: Periodo[];
}

/**
 * Componente para selecionar o período (manhã/tarde)
 */
function SeletorPeriodo({
  periodoSelecionado,
  onSelecionarPeriodo,
  periodosDisponiveis
}: SeletorPeriodoProps): JSX.Element {
  return (
    <div className="flex space-x-2 mb-4">
      {periodosDisponiveis.includes('manha') && (
        <button
          onClick={() => onSelecionarPeriodo('manha')}
          className={`
            flex-1 py-2 px-4 rounded-md font-medium transition-colors
            ${periodoSelecionado === 'manha' 
              ? 'bg-[#39d2c0] text-white' 
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}
          `}
          aria-label="Selecionar período da manhã"
        >
          Manhã
        </button>
      )}
      
      {periodosDisponiveis.includes('tarde') && (
        <button
          onClick={() => onSelecionarPeriodo('tarde')}
          className={`
            flex-1 py-2 px-4 rounded-md font-medium transition-colors
            ${periodoSelecionado === 'tarde' 
              ? 'bg-[#39d2c0] text-white' 
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}
          `}
          aria-label="Selecionar período da tarde"
        >
          Tarde
        </button>
      )}
    </div>
  );
}

export default SeletorPeriodo;
