import { useState } from 'react'
import { Search, MapPin, Check, FileText, Calendar, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const SelectMunicipality = ({ onSelect, current }) => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  const municipalities = [
    {
      id: 1,
      name: 'Nova Veneza',
      state: 'SC',
      population: '14.004',
      lomVersion: '2.1',
      lastUpdate: '2024-01-15',
      proposals: 156
    },
    {
      id: 2,
      name: 'Criciúma',
      state: 'SC',
      population: '215.186',
      lomVersion: '3.0',
      lastUpdate: '2023-12-10',
      proposals: 892
    },
    {
      id: 3,
      name: 'Forquilhinha',
      state: 'SC',
      population: '27.863',
      lomVersion: '1.5',
      lastUpdate: '2024-02-01',
      proposals: 234
    },
  ]

  const filtered = municipalities.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.state.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelect = (municipality) => {
    onSelect(municipality)
    navigate('/dashboard')
  }

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-display font-bold text-primary-800 mb-2">
          Selecionar Município
        </h1>
        <p className="text-primary-600">
          Escolha o município para carregar o perfil normativo local
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-6 mb-6"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-12"
            placeholder="Buscar por município ou estado..."
          />
        </div>
      </motion.div>

      {/* Current Municipality */}
      {current && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="card p-6 mb-6 border-2 border-primary-500 bg-gradient-to-br from-primary-50 to-white"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <Check className="text-white" size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-primary-600">Município Atual</p>
              <h3 className="text-xl font-display font-bold text-primary-900">
                {current.name}, {current.state}
              </h3>
            </div>
          </div>
        </motion.div>
      )}

      {/* Municipalities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((municipality, index) => {
          const isSelected = current?.id === municipality.id

          return (
            <motion.div
              key={municipality.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              onClick={() => !isSelected && handleSelect(municipality)}
              className={`
                card p-6 cursor-pointer transition-all duration-300
                ${isSelected
                  ? 'border-2 border-primary-500 shadow-lg'
                  : 'hover:border-primary-300 hover:shadow-xl hover:scale-105'
                }
              `}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isSelected ? 'bg-primary-600' : 'bg-primary-100'
                    }`}>
                    <MapPin className={isSelected ? 'text-white' : 'text-primary-600'} size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-bold text-primary-900">
                      {municipality.name}
                    </h3>
                    <p className="text-sm text-primary-600">{municipality.state}</p>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <Check className="text-white" size={16} />
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Users size={16} className="text-primary-500" />
                  <span className="text-primary-700">
                    População: <strong>{municipality.population}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText size={16} className="text-primary-500" />
                  <span className="text-primary-700">
                    LOM v{municipality.lomVersion}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-primary-500" />
                  <span className="text-primary-700">
                    Atualizado: {new Date(municipality.lastUpdate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>

              {/* Proposals Count */}
              <div className="mt-4 pt-4 border-t border-primary-100">
                <p className="text-xs text-primary-600">
                  {municipality.proposals} proposições no sistema
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <MapPin size={48} className="text-primary-300 mx-auto mb-4" />
          <p className="text-primary-600 text-lg">
            Nenhum município encontrado
          </p>
          <p className="text-primary-500 text-sm mt-2">
            Tente outro termo de busca
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default SelectMunicipality
