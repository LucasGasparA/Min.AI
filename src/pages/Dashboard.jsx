import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Clock, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import StatCard from '../components/StatCard'
import ProposalList from '../components/ProposalList'
import { api } from '../utils/api.js'

const TYPE_LABELS = {
  pl_ordinaria: 'Projeto de Lei Ordinária',
  pl_complementar: 'Projeto de Lei Complementar',
  decreto: 'Decreto Municipal',
  indicacao: 'Indicação',
}

const STATUS_MAP = {
  DRAFT: 'em_andamento',
  REVIEW: 'pendente_revisao',
  APPROVED: 'concluido',
}

function buildStats(proposals) {
  const total = proposals.length
  const inProgress = proposals.filter(p => p.status === 'DRAFT').length
  const completed = proposals.filter(p => p.status === 'APPROVED').length
  const pending = proposals.filter(p => p.status === 'REVIEW').length
  const approvalRate = total > 0 ? Math.round((completed / total) * 100) : 0

  return [
    { label: 'Em Andamento', value: String(inProgress), icon: Clock, color: 'bg-blue-500', trend: `${total} total` },
    { label: 'Concluídas', value: String(completed), icon: CheckCircle, color: 'bg-green-500', trend: 'aprovadas' },
    { label: 'Pendentes de Revisão', value: String(pending), icon: AlertTriangle, color: 'bg-amber-500', trend: pending > 0 ? 'Requer atenção' : 'Nenhuma pendente' },
    { label: 'Taxa de Aprovação', value: `${approvalRate}%`, icon: TrendingUp, color: 'bg-primary-600', trend: `${total} proposições` },
  ]
}

function toListItem(p) {
  return {
    id: p.id,
    title: p.title,
    type: TYPE_LABELS[p.type] || p.type,
    status: STATUS_MAP[p.status] || 'em_andamento',
    lastUpdate: new Date(p.updatedAt).toLocaleDateString('pt-BR'),
    progress: p.status === 'APPROVED' ? 100 : p.status === 'REVIEW' ? 80 : 30,
  }
}

const Dashboard = () => {
  const [stats, setStats] = useState(buildStats([]))
  const [recentProposals, setRecentProposals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/proposals?limit=50')
      .then(({ proposals }) => {
        setStats(buildStats(proposals))
        setRecentProposals(proposals.slice(0, 5).map(toListItem))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-display font-bold text-primary-800 mb-2">Dashboard</h1>
        <p className="text-primary-600">Visão geral das suas proposições legislativas</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {stats.map((stat, index) => (
          <StatCard key={stat.label} stat={stat} index={index} />
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="card p-6 text-primary-500 text-center">Carregando proposições...</div>
          ) : (
            <ProposalList proposals={recentProposals} />
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="card p-6">
            <h2 className="text-xl font-display font-bold text-primary-800 mb-4">Ações Rápidas</h2>
            <div className="space-y-3">
              <Link
                to="/create-proposal"
                className="block p-4 border-2 border-primary-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <FileText className="text-primary-600" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-primary-800">Novo Projeto de Lei</p>
                    <p className="text-xs text-primary-600">Iniciar nova proposição</p>
                  </div>
                </div>
              </Link>

              <button className="w-full p-4 border-2 border-primary-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-oro-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="text-oro-600" size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-primary-800">Revisar Pendências</p>
                    <p className="text-xs text-primary-600">
                      {stats[2]?.value !== '0' ? `${stats[2]?.value} proposições aguardam` : 'Nenhuma pendente'}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="card p-6 bg-gradient-to-br from-primary-50 to-oro-50">
            <h3 className="font-display font-bold text-primary-800 mb-3">Dica do Sistema</h3>
            <p className="text-sm text-primary-700 leading-relaxed">
              Sempre consulte a Lei Orgânica do Município antes de iniciar uma nova proposição.
              O assistente jurídico pode ajudar a identificar competências e requisitos formais.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
