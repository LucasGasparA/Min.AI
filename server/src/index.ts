import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// IMPORTANTE: Importar com .js no final para ES modules
import proposalRoutes from './routes/proposals.js';
import aiRoutes from './routes/ai.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000; // Backend na porta 4000!

// CORS - permite requisições do frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:4173'],
  credentials: true
}));

app.use(express.json());

// Log de todas requisições (para debug)
app.use((req, res, next) => {
  console.log(`📍 ${req.method} ${req.path}`);
  next();
});

// ===== ROTAS =====
console.log('🔧 Registrando rotas...');

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Rotas de autenticação
app.use('/api/auth', authRoutes);
console.log('✅ Rotas de autenticação registradas em /api/auth');

// Rotas de proposições
app.use('/api/proposals', proposalRoutes);
console.log('✅ Rotas de proposições registradas em /api/proposals');

// Rotas de AI
app.use('/api/ai', aiRoutes);
console.log('✅ Rotas de AI registradas em /api/ai');

// 404 handler
app.use((req, res) => {
  console.log('❌ Rota não encontrada:', req.method, req.path);
  res.status(404).json({ error: 'Rota não encontrada: ' + req.path });
});

// Error handler global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Erro no servidor:', err);
  res.status(500).json({ error: err.message || 'Erro interno do servidor' });
});

app.listen(port, () => {
  console.log('');
  console.log('🚀 ===================================');
  console.log(`✅ Server rodando em: http://localhost:${port}`);
  console.log(`✅ Health check: http://localhost:${port}/api/health`);
  console.log('🚀 ===================================');
  console.log('');
});