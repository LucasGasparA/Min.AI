import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { requireAuth, AuthRequest } from '../utils/authMiddleware.js';

const router = Router();
router.use(requireAuth);

const chatSchema = z.object({
  proposalId: z.string().optional(),
  message: z.string().min(1, 'Mensagem não pode ser vazia').max(2000),
  promptContext: z.string().max(20000).optional(),
});

function zodError(error: z.ZodError): string {
  const issues = (error as any).issues ?? (error as any).errors ?? [];
  return issues[0]?.message ?? 'Dados inválidos';
}

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

router.post('/chat', async (req: Request, res: Response) => {
  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: zodError(parsed.error) });
    return;
  }

  const { message, promptContext } = parsed.data;

  if (!genAI) {
    res.json({
      type: 'response',
      text: `[Modo demonstração — configure GEMINI_API_KEY para usar a IA real]\n\nSua pergunta: "${message}"\n\nResposta simulada: Para esta proposição, recomenda-se verificar a conformidade com o Art. 145, VI da Lei Orgânica Municipal e o Art. 30 da Constituição Federal, que trata das competências municipais.`,
    });
    return;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const systemInstruction = `Você é um Assistente Jurídico especializado em técnica legislativa municipal (cidade de Nova Veneza - SC).
Avalie minutas legislativas, sugira melhorias estruturais, verifique viabilidade constitucional e sugira citações.
Sempre justifique citando fundamentações (ex: LOM Art. 145, CF Art. 30).
Se identificar vícios de competência, alerte sobre inconstitucionalidade.
Seja conciso e objetivo.

Contexto da proposta: ${promptContext || 'Sem contexto fornecido.'}`;

    const chat = model.startChat({ systemInstruction });
    const result = await chat.sendMessage(message);

    res.json({ type: 'response', text: result.response.text() });
  } catch (error) {
    console.error('Erro Gemini:', error);
    res.status(500).json({ error: 'Erro na integração com IA' });
  }
});

export default router;
