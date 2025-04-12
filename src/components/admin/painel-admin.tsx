import React, { useState } from 'react';
import ConfiguracaoHorarios from './configuracao-horarios';
import GeradorSlots from './gerador-slots';
import Card from '../ui/card';
import Button from '../ui/button';

/**
 * Painel administrativo para o médico
 */
function PainelAdmin(): JSX.Element {
  const [aba, setAba] = useState<'horarios' | 'slots'>('horarios');

  return (
    <div className="max-w-md mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Painel Administrativo</h1>
        <p className="text-gray-600">Gerencie os horários e agendamentos do consultório</p>
      </header>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => setAba('horarios')}
          className={`py-3 px-4 rounded-lg font-medium text-center transition-colors ${
            aba === 'horarios'
              ? 'bg-[#39d2c0] text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Configurar Horários
        </button>
        <button
          onClick={() => setAba('slots')}
          className={`py-3 px-4 rounded-lg font-medium text-center transition-colors ${
            aba === 'slots'
              ? 'bg-[#39d2c0] text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Gerar Slots
        </button>
      </div>

      {aba === 'horarios' && <ConfiguracaoHorarios />}
      
      {aba === 'slots' && <GeradorSlots />}
      

    </div>
  );
}

export default PainelAdmin;
