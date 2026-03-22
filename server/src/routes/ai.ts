import { Router } from 'express';
import { requireAuth } from '../utils/authMiddleware.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();
const apiKey = process.env.GEMINI_API_KEY || 'mock-key';
const genAI = new GoogleGenerativeAI(apiKey);

router.use(requireAuth);

router.post('/chat', async (req, res) => {
  try {
    const { proposalId, message, promptContext } = req.body;
    
    if (apiKey === 'mock-key') {
      res.json({ 
        type: 'response', 
        text: 'API do Gemini não configurada (GEMINI_API_KEY ausente). Esta é uma resposta simulada para a sua requisição: "' + message + '".' 
      });
      return;
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const systemInstruction = `Você é um Assistente Jurídico especializado em técnica legislativa municipal (cidade de Nova Veneza - SC).
Funcione como um avaliador de minutas legislativas. Seu objetivo é sugerir melhorias estruturais, verificar viabilidade constitucional/legal e sugerir citações.
Sempre justifique sua reposta citando fundamentações (Exemplo: LOM Art. 145, CF Art. 30).
Se achar vícios de competência (ex: câmara propondo gasto do executivo) alerte sobre inconstitucionalidade.

Contexto da proposta atual: 
${promptContext || 'Sem contexto fornecido.'}
`;

    const chatSession = model.startChat({
        systemInstruction,
    });

    const result = await chatSession.sendMessage(message);
    const text = result.response.text();

    res.json({ type: 'response', text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro na integração com IA' });
  }
});

export default router;
