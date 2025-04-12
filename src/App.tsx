import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TelaAgendamento from './components/agenda/tela-agendamento';
import PainelAdmin from './components/admin/painel-admin';
import Layout from './components/layout/layout';
import Home from './components/home/home';
import DebugSupabase from './components/debug/debug-supabase';

function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        {/* Redirecionar a rota raiz para /agendamento */}
        <Route path="/" element={<Navigate to="/agendamento" replace />} />
        
        {/* Antiga página inicial, agora acessível via /home */}
        <Route path="/home" element={
          <Layout>
            <Home />
          </Layout>
        } />
        
        <Route path="/agendamento" element={
          <Layout>
            <TelaAgendamento />
          </Layout>
        } />
        
        <Route path="/configuraragenda" element={
          <Layout>
            <PainelAdmin />
          </Layout>
        } />
        
        {/* Rota de depuração */}
        <Route path="/debug" element={
          <Layout>
            <DebugSupabase />
          </Layout>
        } />
        
        {/* Redirecionar rotas não encontradas para /agendamento */}
        <Route path="*" element={<Navigate to="/agendamento" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
