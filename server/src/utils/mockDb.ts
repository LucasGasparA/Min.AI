import { randomUUID } from 'crypto';

// ── Tipos simples ──────────────────────────────────────────────
type User         = Record<string, any>;
type Municipality = Record<string, any>;
type Proposal     = Record<string, any>;
type PVersion     = Record<string, any>;

// ── Armazenamento em memória ────────────────────────────────────
const users:     User[]         = [];
const munis:     Municipality[] = [];
const proposals: Proposal[]     = [];
const versions:  PVersion[]     = [];

// Seed: município padrão
munis.push({ id: 'mun-nova-veneza', name: 'Nova Veneza', state: 'SC', createdAt: new Date(), updatedAt: new Date() });

// ── Helpers ─────────────────────────────────────────────────────
function matchWhere(item: any, where: Record<string, any>) {
  return Object.entries(where).every(([k, v]) => item[k] === v);
}

function filterList<T>(list: T[], where: Record<string, any> = {}): T[] {
  return list.filter(item => matchWhere(item, where));
}

// ── Mock Prisma ──────────────────────────────────────────────────
export const mockPrisma = {
  user: {
    findUnique: async ({ where }: any): Promise<User | null> => {
      return users.find(u => matchWhere(u, where)) ?? null;
    },
    findFirst: async ({ where }: any): Promise<User | null> => {
      return users.find(u => matchWhere(u, where)) ?? null;
    },
    create: async ({ data }: any): Promise<User> => {
      const user = { id: randomUUID(), role: 'USER', createdAt: new Date(), updatedAt: new Date(), ...data };
      users.push(user);
      return user;
    },
  },

  municipality: {
    findFirst: async (): Promise<Municipality | null> => munis[0] ?? null,
    create: async ({ data }: any): Promise<Municipality> => {
      const mun = { id: randomUUID(), createdAt: new Date(), updatedAt: new Date(), ...data };
      munis.push(mun);
      return mun;
    },
  },

  proposal: {
    findMany: async ({ where = {}, orderBy, include, skip = 0, take = 20 }: any): Promise<Proposal[]> => {
      let list = filterList(proposals, where);
      if (orderBy?.updatedAt === 'desc') list.sort((a, b) => b.updatedAt - a.updatedAt);
      list = list.slice(skip, skip + take);
      if (include?.municipality) {
        list = list.map(p => ({ ...p, municipality: munis.find(m => m.id === p.municipalityId) ?? null }));
      }
      return list;
    },

    count: async ({ where = {} }: any): Promise<number> => filterList(proposals, where).length,

    create: async ({ data }: any): Promise<Proposal> => {
      const p = { id: randomUUID(), status: 'DRAFT', content: '{}', createdAt: new Date(), updatedAt: new Date(), ...data };
      proposals.push(p);
      return p;
    },

    findFirst: async ({ where = {}, include }: any): Promise<Proposal | null> => {
      const p = proposals.find(item => matchWhere(item, where)) ?? null;
      if (p && include?.municipality) {
        return { ...p, municipality: munis.find(m => m.id === p.municipalityId) ?? null };
      }
      return p;
    },

    update: async ({ where, data }: any): Promise<Proposal> => {
      const idx = proposals.findIndex(p => p.id === where.id);
      if (idx === -1) throw new Error('Proposição não encontrada');
      proposals[idx] = { ...proposals[idx], ...data, updatedAt: new Date() };
      return proposals[idx];
    },
  },

  proposalVersion: {
    count: async ({ where = {} }: any): Promise<number> => filterList(versions, where).length,
    create: async ({ data }: any): Promise<PVersion> => {
      const v = { id: randomUUID(), createdAt: new Date(), ...data };
      versions.push(v);
      return v;
    },
  },
};
