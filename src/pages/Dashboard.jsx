import { Link } from 'react-router-dom'
import { FileText, PlusCircle, Clock, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

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
      color: 'bg-veneza-600',
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      em_andamento: { label: 'Em Andamento', color: 'bg-blue-100 text-blue-800' },
      pendente_revisao: { label: 'Pendente Revisão', color: 'bg-amber-100 text-amber-800' },
      concluido: { label: 'Concluído', color: 'bg-green-100 text-green-800' },
    }
    
    return statusConfig[status] || statusConfig.em_andamento
  }

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-display font-bold text-veneza-800 mb-2">
          Dashboard
        </h1>
        <p className="text-veneza-600">
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
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className="card p-6 hover:scale-105 transition-transform duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
              <p className="text-3xl font-display font-bold text-veneza-800 mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-veneza-600 mb-2">
                {stat.label}
              </p>
              <p className="text-xs text-veneza-500">
                {stat.trend}
              </p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Proposals */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold text-veneza-800">
                Proposições Recentes
              </h2>
              <Link 
                to="/create-proposal"
                className="flex items-center gap-2 text-veneza-600 hover:text-veneza-800 font-medium"
              >
                <PlusCircle size={20} />
                <span>Nova</span>
              </Link>
            </div>

            <div className="space-y-4">
              {recentProposals.map((proposal) => {
                const statusBadge = getStatusBadge(proposal.status)
                
                return (
                  <div 
                    key={proposal.id}
                    className="border border-veneza-200 rounded-lg p-4 hover:border-veneza-400 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-veneza-800 mb-1">
                          {proposal.title}
                        </h3>
                        <p className="text-sm text-veneza-600">
                          {proposal.type}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                        {statusBadge.label}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-2">
                      <div className="flex items-center justify-between text-xs text-veneza-600 mb-1">
                        <span>Progresso</span>
                        <span>{proposal.progress}%</span>
                      </div>
                      <div className="w-full bg-veneza-100 rounded-full h-2">
                        <div 
                          className="bg-veneza-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${proposal.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <p className="text-xs text-veneza-500">
                      Atualizado {proposal.lastUpdate}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="card p-6">
            <h2 className="text-xl font-display font-bold text-veneza-800 mb-4">
              Ações Rápidas
            </h2>
            
            <div className="space-y-3">
              <Link 
                to="/create-proposal"
                className="block p-4 border-2 border-veneza-200 rounded-lg hover:border-veneza-500 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-veneza-100 rounded-lg flex items-center justify-center">
                    <FileText className="text-veneza-600" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-veneza-800">Novo Projeto de Lei</p>
                    <p className="text-xs text-veneza-600">Iniciar nova proposição</p>
                  </div>
                </div>
              </Link>

              <button className="w-full p-4 border-2 border-veneza-200 rounded-lg hover:border-veneza-500 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-oro-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="text-oro-600" size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-veneza-800">Revisar Pendências</p>
                    <p className="text-xs text-veneza-600">3 proposições aguardam</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Tips */}
          <div className="card p-6 bg-gradient-to-br from-veneza-50 to-oro-50">
            <h3 className="font-display font-bold text-veneza-800 mb-3">
              💡 Dica do Sistema
            </h3>
            <p className="text-sm text-veneza-700 leading-relaxed">
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
