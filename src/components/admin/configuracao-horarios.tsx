import React, { useState, useEffect } from 'react';
import { DiaSemana, Periodo, HorarioDisponivel } from '../../types/agenda';
import Card from '../ui/card';
import Button from '../ui/button';
import { horariosService } from '../../services/horarios-service';

const DIAS_SEMANA = [
  { valor: 0, label: 'Domingo' },
  { valor: 1, label: 'Segunda-feira' },
  { valor: 2, label: 'Terça-feira' },
  { valor: 3, label: 'Quarta-feira' },
  { valor: 4, label: 'Quinta-feira' },
  { valor: 5, label: 'Sexta-feira' },
  { valor: 6, label: 'Sábado' }
];

const PERIODOS: { valor: Periodo; label: string }[] = [
  { valor: 'manha', label: 'Manhã' },
  { valor: 'tarde', label: 'Tarde' }
];

/**
 * Componente para configuração de horários de atendimento
 */
function ConfiguracaoHorarios(): JSX.Element {
  const [horarios, setHorarios] = useState<HorarioDisponivel[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);
  const [editando, setEditando] = useState<HorarioDisponivel | null>(null);
  const [novoHorario, setNovoHorario] = useState<boolean>(false);
  
  // Estado para o formulário
  const [formDiaSemana, setFormDiaSemana] = useState<DiaSemana>(1);
  const [formPeriodo, setFormPeriodo] = useState<Periodo>('manha');
  const [formHoraInicio, setFormHoraInicio] = useState<string>('08:00');
  const [formHoraFim, setFormHoraFim] = useState<string>('12:00');
  const [formIntervalo, setFormIntervalo] = useState<number>(30);
  
  // Efeito para carregar os horários do Supabase
  useEffect(() => {
    const carregarHorarios = async (): Promise<void> => {
      try {
        setCarregando(true);
        const dados = await horariosService.buscarTodos();
        setHorarios(dados);
        setErro(null);
      } catch (error) {
        console.error('Erro ao carregar horários:', error);
        setErro('Não foi possível carregar os horários. Tente novamente.');
      } finally {
        setCarregando(false);
      }
    };

    carregarHorarios();
  }, []);

  // Manipulador para editar um horário
  const handleEditar = (horario: HorarioDisponivel): void => {
    setEditando(horario);
    setFormDiaSemana(horario.diaSemana);
    setFormPeriodo(horario.periodo);
    setFormHoraInicio(horario.horaInicio);
    setFormHoraFim(horario.horaFim);
    setFormIntervalo(horario.intervaloMinutos);
    setNovoHorario(false);
  };
  
  // Manipulador para adicionar um novo horário
  const handleNovo = (): void => {
    setEditando(null);
    setFormDiaSemana(1);
    setFormPeriodo('manha');
    setFormHoraInicio('08:00');
    setFormHoraFim('12:00');
    setFormIntervalo(30);
    setNovoHorario(true);
  };
  
  // Manipulador para salvar um horário
  const handleSalvar = async (): Promise<void> => {
    try {
      if (editando) {
        // Atualizar horário existente
        const horarioAtualizado = await horariosService.atualizar(editando.id, {
          diaSemana: formDiaSemana,
          periodo: formPeriodo,
          horaInicio: formHoraInicio,
          horaFim: formHoraFim,
          intervaloMinutos: formIntervalo,
          ativo: true
        });
        
        setHorarios(horarios.map(h => h.id === editando.id ? horarioAtualizado : h));
      } else {
        // Adicionar novo horário
        const novoHorario = await horariosService.criar({
          diaSemana: formDiaSemana,
          periodo: formPeriodo,
          horaInicio: formHoraInicio,
          horaFim: formHoraFim,
          intervaloMinutos: formIntervalo,
          ativo: true
        });
        
        setHorarios([...horarios, novoHorario]);
      }
      
      setErro(null);
      setEditando(null);
      setNovoHorario(false);
    } catch (error) {
      console.error('Erro ao salvar horário:', error);
      setErro('Não foi possível salvar o horário. Tente novamente.');
    }
  };
  
  // Manipulador para excluir um horário
  const handleExcluir = async (id: string): Promise<void> => {
    try {
      await horariosService.excluir(id);
      setHorarios(horarios.filter(h => h.id !== id));
      
      if (editando && editando.id === id) {
        setEditando(null);
        setNovoHorario(false);
      }
      
      setErro(null);
    } catch (error) {
      console.error('Erro ao excluir horário:', error);
      setErro('Não foi possível excluir o horário. Tente novamente.');
    }
  };
  
  // Manipulador para cancelar edição
  const handleCancelar = (): void => {
    setEditando(null);
    setNovoHorario(false);
  };
  
  // Obter o nome do dia da semana
  const getNomeDiaSemana = (dia: DiaSemana): string => {
    return DIAS_SEMANA.find(d => d.valor === dia)?.label || '';
  };
  
  // Obter o nome do período
  const getNomePeriodo = (periodo: Periodo): string => {
    return PERIODOS.find(p => p.valor === periodo)?.label || '';
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Configuração de Horários</h1>
        <Button 
          variant="secondary" 
          onClick={handleNovo}
          disabled={novoHorario || editando !== null}
        >
          Novo
        </Button>
      </div>
      
      {/* Formulário de edição/adição */}
      {(editando || novoHorario) && (
        <Card className="mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            {editando ? 'Editar Horário' : 'Novo Horário'}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dia da Semana
              </label>
              <select
                value={formDiaSemana}
                onChange={(e) => setFormDiaSemana(Number(e.target.value) as DiaSemana)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {DIAS_SEMANA.map((dia) => (
                  <option key={dia.valor} value={dia.valor}>
                    {dia.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Período
              </label>
              <div className="flex space-x-2">
                {PERIODOS.map((periodo) => (
                  <button
                    key={periodo.valor}
                    type="button"
                    onClick={() => setFormPeriodo(periodo.valor)}
                    className={`
                      flex-1 py-2 px-4 rounded-md font-medium transition-colors
                      ${formPeriodo === periodo.valor 
                        ? 'bg-[#39d2c0] text-white' 
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}
                    `}
                  >
                    {periodo.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora Início
                </label>
                <input
                  type="time"
                  value={formHoraInicio}
                  onChange={(e) => setFormHoraInicio(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora Fim
                </label>
                <input
                  type="time"
                  value={formHoraFim}
                  onChange={(e) => setFormHoraFim(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Intervalo (minutos)
              </label>
              <select
                value={formIntervalo}
                onChange={(e) => setFormIntervalo(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value={15}>15 minutos</option>
                <option value={30}>30 minutos</option>
                <option value={45}>45 minutos</option>
                <option value={60}>60 minutos</option>
              </select>
            </div>
            
            <div className="flex space-x-2 pt-2">
              <Button 
                variant="secondary" 
                onClick={handleSalvar}
                className="flex-1"
              >
                Salvar
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleCancelar}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      {/* Mensagem de erro */}
      {erro && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{erro}</p>
        </div>
      )}
      
      {/* Estado de carregamento */}
      {carregando ? (
        <div className="text-center p-8 text-gray-500 bg-white rounded-lg border border-gray-200">
          Carregando horários...
        </div>
      ) : (
        /* Lista de horários configurados */
        <div className="space-y-4">
          {horarios.length === 0 ? (
            <div className="text-center p-8 text-gray-500 bg-white rounded-lg border border-gray-200">
              Nenhum horário configurado
            </div>
          ) : (
            horarios.map((horario) => (
              <Card key={horario.id} className="relative">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {getNomeDiaSemana(horario.diaSemana)}
                    </h3>
                    <p className="text-gray-600">
                      {getNomePeriodo(horario.periodo)}: {horario.horaInicio} às {horario.horaFim}
                    </p>
                    <p className="text-sm text-gray-500">
                      Intervalo: {horario.intervaloMinutos} minutos
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditar(horario)}
                      className="text-gray-600 hover:text-[#39d2c0]"
                      disabled={editando !== null || novoHorario}
                    >
                      Editar
                    </button>
                    
                    <button
                      onClick={() => handleExcluir(horario.id)}
                      className="text-gray-600 hover:text-red-500"
                      disabled={editando !== null || novoHorario}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default ConfiguracaoHorarios;
