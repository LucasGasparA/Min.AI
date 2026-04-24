import { Link } from 'react-router-dom'
import { PlusCircle, FileText, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

const STATUS_CONFIG = {
  em_andamento:    { label: 'Em Andamento',    color: 'bg-blue-100 text-blue-700',   bar: 'bg-blue-500' },
  pendente_revisao: { label: 'Pendente Revisão', color: 'bg-amber-100 text-amber-700', bar: 'bg-amber-500' },
  concluido:       { label: 'Concluído',        color: 'bg-green-100 text-green-700', bar: 'bg-green-500' },
}

const ProposalList = ({ proposals }) => {
  const getStatus = (status) => STATUS_CONFIG[status] ?? STATUS_CONFIG.em_andamento

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="lg:col-span-2"
    >
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-primary-800">Proposições Recentes</h2>
          <Link
            to="/create-proposal"
            className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-800 font-medium transition-colors"
          >
            <PlusCircle size={16} />
            <span>Nova</span>
          </Link>
        </div>

        {proposals.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-primary-400" size={24} />
            </div>
            <p className="text-primary-700 font-medium mb-1">Nenhuma proposição ainda</p>
            <p className="text-sm text-primary-400 mb-4">Crie sua primeira proposição legislativa</p>
            <Link
              to="/create-proposal"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              <PlusCircle size={16} />
              Criar agora
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {proposals.map((proposal) => {
              const status = getStatus(proposal.status)
              return (
                <Link
                  key={proposal.id}
                  to={`/proposal/${proposal.id}/edit`}
                  className="block border border-primary-100 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0 pr-3">
                      <h3 className="font-semibold text-primary-800 mb-0.5 truncate group-hover:text-primary-600 transition-colors">
                        {proposal.title}
                      </h3>
                      <p className="text-xs text-primary-400">{proposal.type}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                      <ArrowRight size={14} className="text-primary-300 group-hover:text-primary-500 transition-colors" />
                    </div>
                  </div>

                  <div className="mb-1.5">
                    <div className="w-full bg-primary-100 rounded-full h-1.5">
                      <div
                        className={`${status.bar} h-1.5 rounded-full transition-all duration-500`}
                        style={{ width: `${proposal.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-primary-400">Atualizado {proposal.lastUpdate}</p>
                    <p className="text-xs text-primary-400">{proposal.progress}%</p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default ProposalList
