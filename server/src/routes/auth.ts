import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/db.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-mvp';

console.log('🔐 Módulo de autenticação carregado');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    console.log('📝 Tentando registrar usuário:', email);

    // Verificar se já existe
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      console.log('❌ Email já cadastrado:', email);
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Criar usuário
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || 'Usuário'
      }
    });

    // Gerar token
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    console.log('✅ Usuário registrado com sucesso:', email);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error: any) {
    console.error('❌ Erro ao registrar:', error);
    res.status(500).json({ error: 'Erro no servidor: ' + error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Tentando fazer login:', email);

    // Buscar usuário
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log('❌ Usuário não encontrado:', email);
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verificar senha
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      console.log('❌ Senha incorreta para:', email);
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gerar token
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    console.log('✅ Login bem-sucedido:', email);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error: any) {
    console.error('❌ Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro no servidor: ' + error.message });
  }
});

export default router;