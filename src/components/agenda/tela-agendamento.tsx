import React, { useState, useEffect, useCallback } from 'react';
import { DiaSemana, Periodo, SlotHorario, DiaSelecionado } from '../../types/agenda';
import Card from '../ui/card';
import Button from '../ui/button';
import SeletorDiaSemana from './seletor-dia-semana';
import SeletorPeriodo from './seletor-periodo';
import SeletorHorario from './seletor-horario';
import EmptyState from '../ui/empty-state';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { slotsService } from '../../services/slots-service';
import AlertDialog from '../ui/alert-dialog';
import { supabase } from '../../services/supabase';

// Períodos disponíveis
const PERIODOS_DISPONIVEIS: Periodo[] = ['manha', 'tarde'];

/**
 * Tela principal de agendamento
 */
function TelaAgendamento(): JSX.Element {
  const [diasDisponiveis, setDiasDisponiveis] = useState<DiaSemana[]>([]);
  const [diaSelecionado, setDiaSelecionado] = useState<DiaSemana | null>(null);
  const [periodoSelecionado, setPeriodoSelecionado] = useState<Periodo>('manha');
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null);
  const [horarios, setHorarios] = useState<SlotHorario[]>([]);
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);
  
  // Estado para controlar o alerta customizado
  const [alerta, setAlerta] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({ isOpen: false, title: '', message: '', type: 'info' });
  
  // Parâmetros do usuário recebidos via URL
  const [usuarioParams, setUsuarioParams] = useState<{
    userId: string;
    nomeUser: string;
  } | null>(null);
  
  // Função para obter parâmetros da URL
  const obterParametrosURL = useCallback((): void => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get('userId');
      const nomeUser = urlParams.get('nomeUser');
      
      console.log('Parâmetros da URL:', { userId, nomeUser });
      
      if (userId && nomeUser) {
        setUsuarioParams({ userId, nomeUser });
      } else {
        console.warn('Parâmetros de usuário ausentes na URL');
        setErro('Identificação do usuário não encontrada. Verifique se você está acessando pelo aplicativo.');
      }
    } catch (error) {
      console.error('Erro ao obter parâmetros da URL:', error);
    }
  }, []);
  
  // Efeito para carregar parâmetros da URL ao iniciar
  useEffect(() => {
    obterParametrosURL();
  }, [obterParametrosURL]);
  
  // Efeito para carregar dias disponíveis
  useEffect(() => {
    const carregarDiasDisponiveis = async (): Promise<void> => {
      try {
        console.log('Iniciando carregamento de dias disponíveis...');
        setCarregando(true);
        setErro(null);
        
        // Adicionar um pequeno delay para garantir que o console seja limpo
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('Chamando serviço para buscar dias disponíveis...');
        const dias = await slotsService.buscarDiasDisponiveis();
        console.log('Dias disponíveis recebidos:', dias);
        
        // Verificar se dias é um array válido
        if (!dias || !Array.isArray(dias)) {
          console.error('Dados de dias disponíveis inválidos:', dias);
          throw new Error('Formato de dados inválido recebido do servidor');
        }
        
        // Definir dias disponíveis mesmo que seja um array vazio
        setDiasDisponiveis(dias);
        console.log('Estado de diasDisponiveis atualizado:', dias);
        
        // Se não houver dias disponíveis, exibir mensagem
        if (dias.length === 0) {
          console.log('Nenhum dia disponível encontrado');
          setErro('Não há dias disponíveis para agendamento no momento.');
        }
      } catch (error) {
        console.error('Erro ao carregar dias disponíveis:', error);
        setErro('Não foi possível carregar os dias disponíveis. Tente novamente mais tarde.');
        setDiasDisponiveis([]);
      } finally {
        setCarregando(false);
        console.log('Carregamento de dias disponíveis finalizado');
      }
    };
    
    carregarDiasDisponiveis();
  }, []);
  
  // Efeito para carregar horários quando o dia ou período mudar
  useEffect(() => {
    if (diaSelecionado !== null && dataSelecionada) {
      const buscarHorarios = async (): Promise<void> => {
        try {
          setHorarios([]);
          setHorarioSelecionado(null);
          setCarregando(true);
          setErro(null);
          
          // Buscar slots do banco de dados
          const slots = await slotsService.buscarPorData(dataSelecionada);
          setHorarios(slots);
        } catch (error) {
          console.error('Erro ao carregar horários:', error);
          setErro('Não foi possível carregar os horários. Tente novamente mais tarde.');
          setHorarios([]);
        } finally {
          setCarregando(false);
        }
      };
      
      buscarHorarios();
    }
  }, [diaSelecionado, periodoSelecionado, dataSelecionada]);
  
  // Manipulador para selecionar um dia da semana
  const handleSelecionarDia = (dia: DiaSemana) => {
    setDiaSelecionado(dia);
    
    // Encontra a próxima data correspondente ao dia da semana selecionado
    const hoje = new Date();
    const diaAtual = hoje.getDay();
    const diasParaAdicionar = dia >= diaAtual ? dia - diaAtual : 7 - diaAtual + dia;
    
    const proximaData = new Date(hoje);
    proximaData.setDate(hoje.getDate() + diasParaAdicionar);
    proximaData.setHours(0, 0, 0, 0);
    
    setDataSelecionada(proximaData);
  };
  
  // Manipulador para confirmar o agendamento
  const handleConfirmarAgendamento = async (): Promise<void> => {
    if (!horarioSelecionado || !dataSelecionada) return;
    
    // Verificar se temos os parâmetros do usuário
    if (!usuarioParams) {
      setErro('Identificação do usuário não encontrada. Verifique se você está acessando pelo aplicativo.');
      return;
    }
    
    try {
      setCarregando(true);
      setErro(null);
      
      // Buscar informações do horário selecionado
      const horarioAgendado = horarios.find(h => h.id === horarioSelecionado);
      
      if (!horarioAgendado) {
        throw new Error('Horário não encontrado');
      }
      
      console.log('Confirmando agendamento com dados do usuário:', usuarioParams);
      
      // Reservar o slot com os dados do usuário recebidos via URL
      await slotsService.reservarSlot(
        horarioSelecionado,
        usuarioParams.userId,
        usuarioParams.nomeUser
      );
      
      // Função para converter a data/hora UTC para local (similar à do SeletorHorario)
      const converterParaHoraLocal = (dataHoraString: string): Date => {
        if (dataHoraString.endsWith('Z') || dataHoraString.includes('+')) {
          const dataUTC = new Date(dataHoraString);
          
          // Ajustar para o fuso horário do Brasil (UTC-3)
          const dataLocal = new Date();
          dataLocal.setFullYear(dataUTC.getUTCFullYear());
          dataLocal.setMonth(dataUTC.getUTCMonth());
          dataLocal.setDate(dataUTC.getUTCDate());
          dataLocal.setHours(dataUTC.getUTCHours());
          dataLocal.setMinutes(dataUTC.getUTCMinutes());
          dataLocal.setSeconds(0);
          dataLocal.setMilliseconds(0);
          
          return dataLocal;
        }
        
        // Se não tiver informação de fuso, tratar como hora local
        return new Date(dataHoraString);
      };
      
      // Converter a data/hora para exibição correta
      const dataHoraLocal = converterParaHoraLocal(horarioAgendado.dataHora);
      
      // Formatar data e hora para o email e WhatsApp
      const dataFormatada = dataHoraLocal.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      
      const horaFormatada = dataHoraLocal.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      }) + 'hrs';
      
      // 1. Buscar dados do usuário na tabela users
      console.log('Buscando usuário com ID:', usuarioParams.userId);
      const { data: dadosUsuario, error: errorUsuario } = await supabase
        .from('users')
        .select('*')
        .eq('id', usuarioParams.userId)
        .single();
      
      if (errorUsuario) {
        console.error('Erro ao buscar usuário:', errorUsuario.message);
      } else {
        console.log('Dados do usuário encontrados:', dadosUsuario);
      }
      
      // Nome do usuário (do banco ou da URL)
      const nomeUsuario = dadosUsuario?.nome || usuarioParams.nomeUser;
      const emailUsuario = dadosUsuario?.email;
      
      // 2. Enviar notificação via webhook n8n
      try {
        console.log('Enviando notificação para webhook n8n');
        
        const webhookResponse = await fetch('https://n8nwebhook.jusprod.online/webhook/fc42eabe-c5ea-4191-bf49-ededb2c0df22', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nome: nomeUsuario,
            dia: dataFormatada,
            hora: horaFormatada,
            email: emailUsuario || ''
          })
        });
        
        if (webhookResponse.ok) {
          console.log('Notificação enviada com sucesso para o webhook');
        } else {
          console.error('Erro ao enviar notificação para webhook:', await webhookResponse.text());
        }
      } catch (webhookError) {
        console.error('Erro ao enviar notificação para webhook:', webhookError);
      }
      
      // Exibir alerta customizado de sucesso
      setAlerta({
        isOpen: true,
        title: 'Agendamento Confirmado',
        message: `Sua consulta foi agendada para ${dataFormatada} às ${horaFormatada}.`,
        type: 'success'
      });
      
      // Resetar seleção após confirmação
      setHorarioSelecionado(null);
      
      // Recarregar horários para atualizar disponibilidade
      if (dataSelecionada) {
        const slots = await slotsService.buscarPorData(dataSelecionada);
        setHorarios(slots);
      }
      
      // 3. Criar mensagem para WhatsApp
      const mensagemWhatsApp = encodeURIComponent(
        `📅 Novo Agendamento Confirmado\n\n` +
        `O App Iprevenir informa que um novo agendamento foi realizado.\n\n` +
        `👤 Paciente: ${nomeUsuario}\n` +
        `📍 Data: ${dataFormatada}\n` +
        `⏰ Horário: ${horaFormatada}\n\n` +
        `Por favor, confira os detalhes no seu painel do app.\n` +
        `Qualquer dúvida, estamos à disposição!`
      );
      
      // Redirecionar para WhatsApp após 1.5 segundos (para dar tempo de ver o alerta)
      console.log('Redirecionando para WhatsApp em 1.5 segundos...');
      setTimeout(() => {
        const whatsappUrl = `https://wa.me/5521996286568?text=${mensagemWhatsApp}`;
        console.log('URL do WhatsApp:', whatsappUrl);
        window.location.href = whatsappUrl;
      }, 1500);
      
    } catch (error) {
      console.error('Erro ao confirmar agendamento:', error);
      setErro('Não foi possível confirmar o agendamento. Tente novamente mais tarde.');
      
      // Exibir alerta customizado de erro
      setAlerta({
        isOpen: true,
        title: 'Erro no Agendamento',
        message: 'Não foi possível confirmar o agendamento. Tente novamente mais tarde.',
        type: 'error'
      });
    } finally {
      setCarregando(false);
    }
  };
  
  // Formatar data para exibição
  const formatarData = (data: Date | null): string => {
    if (!data) return '';
    return data.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Agendar Consulta</h1>
      
      {erro && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-start" role="alert">
          <AlertCircle className="mr-2 flex-shrink-0 h-5 w-5" />
          <p>{erro}</p>
        </div>
      )}
      
      {carregando && !diaSelecionado && (
        <div className="text-center p-8 text-gray-500 bg-white rounded-lg border border-gray-200 mb-6">
          Carregando dias disponíveis...
        </div>
      )}
      
      {!carregando && (
        <Card className="mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Selecione o dia</h2>
          <SeletorDiaSemana 
            diasDisponiveis={diasDisponiveis}
            diaSelecionado={diaSelecionado}
            onSelecionarDia={handleSelecionarDia}
          />
        
          {dataSelecionada && (
            <div className="mt-2 text-sm text-gray-600">
              {formatarData(dataSelecionada)}
            </div>
          )}
        </Card>
      )}
      
      {diaSelecionado !== null && (
        <Card className="mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Selecione o período</h2>
          <SeletorPeriodo 
            periodoSelecionado={periodoSelecionado}
            onSelecionarPeriodo={setPeriodoSelecionado}
            periodosDisponiveis={PERIODOS_DISPONIVEIS}
          />
        </Card>
      )}
      
      {diaSelecionado !== null && !carregando && (
        <Card className="mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Selecione o horário</h2>
          <SeletorHorario 
            horarios={horarios}
            horarioSelecionado={horarioSelecionado}
            onSelecionarHorario={setHorarioSelecionado}
            periodo={periodoSelecionado}
          />
        </Card>
      )}
      
      {diaSelecionado !== null && carregando && (
        <Card className="mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Selecione o horário</h2>
          <div className="text-center p-8 text-gray-500">
            Carregando horários disponíveis...
          </div>
        </Card>
      )}
      
      {horarioSelecionado && (
        <Button 
          variant="secondary" 
          fullWidth 
          onClick={handleConfirmarAgendamento}
          className="mt-4"
          disabled={carregando || !usuarioParams}
        >
          {carregando ? 'Confirmando...' : 'Confirmar Agendamento'}
        </Button>
      )}
      
      {!usuarioParams && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mt-4" role="alert">
          <p className="font-medium">Aviso:</p>
          <p>Você precisa acessar esta página através do aplicativo para poder agendar consultas.</p>
        </div>
      )}
      
      {/* Alerta customizado */}
      <AlertDialog
        isOpen={alerta.isOpen}
        onClose={() => setAlerta({ ...alerta, isOpen: false })}
        title={alerta.title}
        message={alerta.message}
        type={alerta.type}
        autoClose={5000} // Fechar automaticamente após 5 segundos
      />
    </div>
  );
}

export default TelaAgendamento;
