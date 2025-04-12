import React, { useState } from 'react';
import Card from '../ui/card';
import Button from '../ui/button';
import { slotsService } from '../../services/slots-service';
import { AlertCircle, CheckCircle, Calendar } from 'lucide-react';

/**
 * Componente para gerar slots de horários a partir das configurações
 */
function GeradorSlots(): JSX.Element {
  const [carregando, setCarregando] = useState<boolean>(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [diasGerados, setDiasGerados] = useState<number>(0);
  const [slotsGerados, setSlotsGerados] = useState<number>(0);
  
  // Função para gerar slots para os próximos dias
  const gerarSlots = async (diasFuturos: number): Promise<void> => {
    try {
      setCarregando(true);
      setErro(null);
      setSucesso(null);
      setDiasGerados(0);
      setSlotsGerados(0);
      
      console.log(`Gerando slots para os próximos ${diasFuturos} dias...`);
      
      // Obter a data atual
      const hoje = new Date();
      let totalSlots = 0;
      let diasComSlots = 0;
      
      // Gerar slots para cada dia no período especificado
      for (let i = 0; i < diasFuturos; i++) {
        const data = new Date(hoje);
        data.setDate(hoje.getDate() + i);
        
        // Resetar horas para início do dia
        data.setHours(0, 0, 0, 0);
        
        console.log(`Gerando slots para ${data.toLocaleDateString()}...`);
        
        try {
          const slots = await slotsService.gerarSlotsParaData(data);
          
          if (slots.length > 0) {
            totalSlots += slots.length;
            diasComSlots++;
            console.log(`Gerados ${slots.length} slots para ${data.toLocaleDateString()}`);
          } else {
            console.log(`Nenhum slot gerado para ${data.toLocaleDateString()}`);
          }
        } catch (error) {
          console.error(`Erro ao gerar slots para ${data.toLocaleDateString()}:`, error);
          // Continuar com o próximo dia mesmo se houver erro
        }
      }
      
      setDiasGerados(diasComSlots);
      setSlotsGerados(totalSlots);
      
      if (totalSlots > 0) {
        setSucesso(`Gerados ${totalSlots} slots para ${diasComSlots} dias com sucesso!`);
      } else {
        setErro('Nenhum slot foi gerado. Verifique se existem configurações de horários ativos.');
      }
      
    } catch (error) {
      console.error('Erro ao gerar slots:', error);
      setErro(`Erro ao gerar slots: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setCarregando(false);
    }
  };
  
  return (
    <Card className="mb-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Gerar Slots de Horários</h2>
      
      <p className="text-gray-600 mb-4">
        Gere slots de horários para as próximas semanas com base nas configurações de dias e horários disponíveis.
      </p>
      
      {erro && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-start" role="alert">
          <AlertCircle className="mr-2 flex-shrink-0 h-5 w-5" />
          <p>{erro}</p>
        </div>
      )}
      
      {sucesso && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-start" role="alert">
          <CheckCircle className="mr-2 flex-shrink-0 h-5 w-5" />
          <p>{sucesso}</p>
        </div>
      )}
      
      <div className="space-y-4">
        <div className="flex space-x-2">
          <Button 
            variant="secondary" 
            onClick={() => gerarSlots(7)}
            disabled={carregando}
            className="flex-1"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Próxima Semana
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => gerarSlots(14)}
            disabled={carregando}
            className="flex-1"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Próximas 2 Semanas
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => gerarSlots(30)}
          disabled={carregando}
          className="w-full"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Próximo Mês
        </Button>
      </div>
      
      {carregando && (
        <div className="text-center p-4 mt-4 text-gray-500">
          Gerando slots de horários... Por favor, aguarde.
        </div>
      )}
      
      {(diasGerados > 0 || slotsGerados > 0) && !carregando && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h3 className="font-medium text-gray-700 mb-2">Resumo da Geração</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>Dias com slots gerados: <span className="font-medium">{diasGerados}</span></li>
            <li>Total de slots gerados: <span className="font-medium">{slotsGerados}</span></li>
          </ul>
        </div>
      )}
    </Card>
  );
}

export default GeradorSlots;
