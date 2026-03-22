import { Router } from 'express';
import { prisma } from '../utils/db';
import { requireAuth } from '../utils/authMiddleware';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const proposals = await prisma.proposal.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: { municipality: true }
    });
    res.json(proposals);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar proposições' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    const proposal = await prisma.proposal.findUnique({
      where: { id, userId },
      include: { municipality: true }
    });
    if (!proposal) {
      res.status(404).json({ error: 'Proposição não encontrada' });
      return;
    }
    res.json(proposal);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar proposição' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, type, theme, objective, competence, hasFinancialImpact, estimatedImpact, justification, municipalityId } = req.body;
    const userId = (req as any).user.userId;

    let munId = municipalityId;
    if (!munId) {
      const mun = await prisma.municipality.findFirst();
      if (!mun) {
        const newMun = await prisma.municipality.create({ data: { name: 'Nova Veneza', state: 'SC' } });
        munId = newMun.id;
      } else {
        munId = mun.id;
      }
    }

    const proposal = await prisma.proposal.create({
      data: {
        title: title || 'Nova Proposição',
        type,
        theme,
        objective,
        competence,
        hasFinancialImpact,
        estimatedImpact: estimatedImpact ? String(estimatedImpact) : null,
        justification,
        userId,
        municipalityId: munId,
      }
    });
    res.json(proposal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar proposição' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    const { title, type, theme, objective, competence, hasFinancialImpact, estimatedImpact, justification, content, status } = req.body;

    const existing = await prisma.proposal.findUnique({ where: { id, userId } });
    if (!existing) {
      res.status(404).json({ error: 'Não encontrada' });
      return;
    }

    const proposal = await prisma.proposal.update({
      where: { id },
      data: { title, type, theme, objective, competence, hasFinancialImpact, estimatedImpact, justification, content, status }
    });

    await prisma.proposalVersion.create({
      data: {
        proposalId: proposal.id,
        content: proposal.content || '{}',
        versionNumber: (await prisma.proposalVersion.count({ where: { proposalId: proposal.id } })) + 1
      }
    });

    res.json(proposal);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar proposição' });
  }
});

export default router;