import { Link } from 'react-router-dom'
import { PlusCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const ProposalList = ({ proposals }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      em_andamento: { label: 'Em Andamento', color: 'bg-blue-100 text-blue-800' },
      pendente_revisao: { label: 'Pendente Revisão', color: 'bg-amber-100 text-amber-800' },
      concluido: { label: 'Concluído', color: 'bg-green-100 text-green-800' },
    }
    
    return statusConfig[status] || statusConfig.em_andamento
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="lg:col-span-2"
    >
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-primary-800">
            Proposições Recentes
          </h2>
          <Link 
            to="/create-proposal"
            className="flex items-center gap-2 text-primary-600 hover:text-primary-800 font-medium"
          >
            <PlusCircle size={20} />
            <span>Nova</span>
          </Link>
        </div>

        <div className="space-y-4">
          {proposals.map((proposal) => {
            const statusBadge = getStatusBadge(proposal.status)
            
            return (
              <div 
                key={proposal.id}
                className="border border-primary-200 rounded-lg p-4 hover:border-primary-400 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-primary-800 mb-1">
                      {proposal.title}
                    </h3>
                    <p className="text-sm text-primary-600">
                      {proposal.type}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                    {statusBadge.label}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="flex items-center justify-between text-xs text-primary-600 mb-1">
                    <span>Progresso</span>
                    <span>{proposal.progress}%</span>
                  </div>
                  <div className="w-full bg-primary-100 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${proposal.progress}%` }}
                    ></div>
                  </div>
                </div>

                <p className="text-xs text-primary-500">
                  Atualizado {proposal.lastUpdate}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

export default ProposalList
