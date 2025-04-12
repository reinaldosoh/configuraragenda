import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import Card from '../ui/card';
import Button from '../ui/button';

/**
 * Componente para depuração da conexão com o Supabase
 */
function DebugSupabase(): JSX.Element {
  const [resultado, setResultado] = useState<string>('');
  const [carregando, setCarregando] = useState<boolean>(false);
  const [erro, setErro] = useState<string | null>(null);

  const testarConexao = async (): Promise<void> => {
    try {
      setCarregando(true);
      setErro(null);
      setResultado('');

      console.log('Testando conexão com o Supabase...');
      
      // Verificar URL e chave anônima
      const url = supabase.supabaseUrl;
      const key = supabase.supabaseKey;
      
      console.log('URL do Supabase:', url);
      console.log('Chave anônima (primeiros 10 caracteres):', key.substring(0, 10) + '...');
      
      // Testar uma consulta simples
      const { data, error } = await supabase
        .from('horarios_disponiveis')
        .select('*')
        .limit(5);
      
      if (error) {
        console.error('Erro na consulta:', error);
        throw new Error(`Erro na consulta: ${error.message}`);
      }
      
      console.log('Dados recebidos:', data);
      
      // Exibir resultado formatado
      setResultado(JSON.stringify(data, null, 2));
      
    } catch (error) {
      console.error('Erro ao testar conexão:', error);
      setErro(`Erro: ${error instanceof Error ? error.message : String(error)}`);
      setResultado('');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Debug Supabase</h1>
      
      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Teste de Conexão</h2>
          <Button 
            variant="secondary" 
            onClick={testarConexao}
            disabled={carregando}
            size="sm"
          >
            {carregando ? 'Testando...' : 'Testar Conexão'}
          </Button>
        </div>
        
        {erro && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <p>{erro}</p>
          </div>
        )}
        
        {resultado && (
          <div className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            <pre className="text-xs">{resultado}</pre>
          </div>
        )}
      </Card>
    </div>
  );
}

export default DebugSupabase;
