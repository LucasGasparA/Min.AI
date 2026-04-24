import { motion } from 'framer-motion'

const StatCard = ({ stat, index }) => {
  const Icon = stat.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index, type: 'spring', stiffness: 120 }}
      className="card p-6 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-default"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`${stat.color} w-11 h-11 rounded-lg flex items-center justify-center`}>
          <Icon className="text-white" size={22} />
        </div>
      </div>
      <p className="text-3xl font-display font-bold text-primary-800 mb-0.5">{stat.value}</p>
      <p className="text-sm font-medium text-primary-600 mb-1">{stat.label}</p>
      <p className="text-xs text-primary-400">{stat.trend}</p>
    </motion.div>
  )
}

export default StatCard
