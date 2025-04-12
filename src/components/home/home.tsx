import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/card';
import Button from '../ui/button';

/**
 * Página inicial da aplicação
 */
function Home(): JSX.Element {
  return (
    <div className="max-w-md mx-auto p-4 bg-red-200">
      <Card className="text-center p-6 border-2 border-blue-500">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Bem-vindo ao Consultório Médico</h1>
        
        <p className="text-gray-600 mb-8">
          Selecione uma opção para continuar:
        </p>
        
        <div className="space-y-4">
          <Link to="/agendamento" className="block">
            <Button variant="secondary" fullWidth>
              Agendar Consulta
            </Button>
          </Link>
          
          <Link to="/configuraragenda" className="block">
            <Button variant="outline" fullWidth>
              Área do Médico
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default Home;
