import { Link } from 'react-router-dom'
import { FileText, Clock, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import StatCard from '../components/StatCard'
import ProposalList from '../components/ProposalList'

const Dashboard = () => {
  const stats = [
    { 
      label: 'Proposições em Andamento', 
      value: '8', 
      icon: Clock,
      color: 'bg-blue-500',
      trend: '+2 esta semana'
    },
    { 
      label: 'Concluídas', 
      value: '23', 
      icon: CheckCircle,
      color: 'bg-green-500',
      trend: '+5 este mês'
    },
    { 
      label: 'Pendentes de Revisão', 
      value: '3', 
      icon: AlertTriangle,
      color: 'bg-amber-500',
      trend: 'Requer atenção'
    },
    { 
      label: 'Taxa de Aprovação', 
      value: '87%', 
      icon: TrendingUp,
      color: 'bg-primary-600',
      trend: '+12% vs mês anterior'
    },
  ]

  const recentProposals = [
    {
      id: 1,
      title: 'Projeto de Lei Ordinária - Criação de Programa de Coleta Seletiva',
      type: 'Projeto de Lei Ordinária',
      status: 'em_andamento',
      lastUpdate: '2 dias atrás',
      progress: 65
    },
    {
      id: 2,
      title: 'Decreto Municipal - Regulamentação do Horário Comercial',
      type: 'Decreto',
      status: 'pendente_revisao',
      lastUpdate: '5 dias atrás',
      progress: 90
    },
    {
      id: 3,
      title: 'Indicação - Melhoria na Iluminação Pública do Bairro Centro',
      type: 'Indicação',
      status: 'concluido',
      lastUpdate: '1 semana atrás',
      progress: 100
    },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-display font-bold text-primary-800 mb-2">
          Dashboard
        </h1>
        <p className="text-primary-600">
          Visão geral das suas proposições legislativas
        </p>
      </motion.div>

      {/* Stats Grid */}
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Proposals */}
        <ProposalList proposals={recentProposals} />

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="card p-6">
            <h2 className="text-xl font-display font-bold text-primary-800 mb-4">
              Ações Rápidas
            </h2>
            
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
                    <p className="text-xs text-primary-600">3 proposições aguardam</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Tips */}
          <div className="card p-6 bg-gradient-to-br from-primary-50 to-oro-50">
            <h3 className="font-display font-bold text-primary-800 mb-3">
              💡 Dica do Sistema
            </h3>
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
