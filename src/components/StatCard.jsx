import { motion } from 'framer-motion'

const StatCard = ({ stat, index }) => {
  const Icon = stat.icon
  return (
    <motion.div
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
      <p className="text-3xl font-display font-bold text-primary-800 mb-1">
        {stat.value}
      </p>
      <p className="text-sm text-primary-600 mb-2">
        {stat.label}
      </p>
      <p className="text-xs text-primary-500">
        {stat.trend}
      </p>
    </motion.div>
  )
}

export default StatCard
