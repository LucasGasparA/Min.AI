import { useState } from 'react'
import { Save, Download, MessageSquare, AlertTriangle, CheckCircle, FileText, Scale, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'

const ProposalEditor = () => {
  const [activeSection, setActiveSection] = useState('ementa')
  const [showAssistant, setShowAssistant] = useState(true)
  const [assistantMessage, setAssistantMessage] = useState('')

  const [proposal, setProposal] = useState({
    ementa: 'Dispõe sobre a criação do Programa Municipal de Coleta Seletiva de Resíduos Recicláveis e dá outras providências.',
    preambulo: 'O Prefeito Municipal de Nova Veneza, Estado de Santa Catarina, no uso de suas atribuições legais, faz saber que a Câmara Municipal aprovou e ele sanciona a seguinte Lei:',
    artigos: [
      {
        id: 1,
        numero: 'Art. 1º',
        texto: 'Fica instituído o Programa Municipal de Coleta Seletiva de Resíduos Recicláveis no Município de Nova Veneza.',
        citacoes: ['LOM Art. 145, inciso VI']
      },
      {
        id: 2,
        numero: 'Art. 2º',
        texto: 'O Programa tem por objetivos:\nI - reduzir a quantidade de resíduos destinados aos aterros sanitários;\nII - promover a conscientização ambiental da população;\nIII - gerar renda para cooperativas de catadores.',
        citacoes: []
      }
    ],
    vigencia: 'Art. 3º - Esta Lei entra em vigor na data de sua publicação.',
    revogacao: 'Art. 4º - Revogam-se as disposições em contrário.'
  })

  const [validations, setValidations] = useState([
    { type: 'success', message: 'Competência municipal verificada - Art. 145, VI da LOM' },
    { type: 'success', message: 'Estrutura conforme técnica legislativa' },
    { type: 'warning', message: 'Recomenda-se anexar estimativa de impacto orçamentário' },
  ])

  const sections = [
    { id: 'ementa', label: 'Ementa', icon: FileText },
    { id: 'preambulo', label: 'Preâmbulo', icon: FileText },
    { id: 'artigos', label: 'Artigos', icon: FileText },
    { id: 'vigencia', label: 'Vigência', icon: FileText },
    { id: 'revogacao', label: 'Revogação', icon: FileText },
  ]

  const assistantSuggestions = [
    {
      type: 'citation',
      text: 'Fundamentação encontrada na LOM, Art. 145, VI: "Compete ao Município proteger o meio ambiente e combater a poluição em qualquer de suas formas."',
      action: 'Adicionar citação'
    },
    {
      type: 'improvement',
      text: 'Sugestão: Incluir artigo definindo prazo para implementação gradual do programa.',
      action: 'Aplicar sugestão'
    },
    {
      type: 'alert',
      text: 'Atenção: Programas com impacto orçamentário requerem anexo com estimativa de custos conforme Lei de Responsabilidade Fiscal.',
      action: 'Ver detalhes'
    }
  ]

  const updateArticle = (id, newText) => {
    setProposal(prev => ({
      ...prev,
      artigos: prev.artigos.map(art =>
        art.id === id ? { ...art, texto: newText } : art
      )
    }))
  }

  const addArticle = () => {
    const newId = proposal.artigos.length + 1
    setProposal(prev => ({
      ...prev,
      artigos: [...prev.artigos, {
        id: newId,
        numero: `Art. ${newId}º`,
        texto: '',
        citacoes: []
      }]
    }))
  }

  return (
    <div className="min-h-screen bg-veneza-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-veneza-200 px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-display font-bold text-veneza-800">
              Editor de Minuta Legislativa
            </h1>
            <p className="text-sm text-veneza-600">Projeto de Lei Ordinária - Coleta Seletiva</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-veneza-700 hover:bg-veneza-50 rounded-lg transition-all">
              <Save size={18} />
              <span className="hidden md:inline">Salvar</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-veneza-600 text-white rounded-lg hover:bg-veneza-700 transition-all shadow-md">
              <Download size={18} />
              <span className="hidden md:inline">Exportar</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Editor */}
        <div className={`flex-1 p-6 transition-all duration-300 ${showAssistant ? 'mr-96' : ''}`}>
          {/* Section Navigation */}
          <div className="card p-4 mb-6">
            <div className="flex items-center gap-2 overflow-x-auto">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all
                      ${activeSection === section.id
                        ? 'bg-veneza-600 text-white shadow-md'
                        : 'text-veneza-600 hover:bg-veneza-100'
                      }
                    `}
                  >
                    <Icon size={16} />
                    <span>{section.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Validation Alerts */}
          <div className="space-y-3 mb-6">
            {validations.map((validation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  p-4 rounded-lg border-l-4 flex items-start gap-3
                  ${validation.type === 'success'
                    ? 'bg-green-50 border-green-500'
                    : validation.type === 'warning'
                      ? 'bg-oro-50 border-oro-500'
                      : 'bg-red-50 border-red-500'
                  }
                `}
              >
                {validation.type === 'success' ? (
                  <CheckCircle className="text-green-600 mt-0.5" size={20} />
                ) : (
                  <AlertTriangle className={validation.type === 'warning' ? 'text-oro-600' : 'text-red-600'} size={20} />
                )}
                <p className={`text-sm ${validation.type === 'success'
                  ? 'text-green-800'
                  : validation.type === 'warning'
                    ? 'text-oro-800'
                    : 'text-red-800'
                  }`}>
                  {validation.message}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Editor Content */}
          <div className="card p-8">
            {activeSection === 'ementa' && (
              <div>
                <h2 className="text-xl font-display font-bold text-veneza-800 mb-4">Ementa</h2>
                <textarea
                  value={proposal.ementa}
                  onChange={(e) => setProposal(prev => ({ ...prev, ementa: e.target.value }))}
                  className="input-field min-h-[100px] font-serif"
                  placeholder="Resumo do objeto da lei..."
                />
                <p className="text-xs text-veneza-500 mt-2">
                  A ementa deve resumir de forma clara e objetiva o conteúdo da proposição
                </p>
              </div>
            )}

            {activeSection === 'preambulo' && (
              <div>
                <h2 className="text-xl font-display font-bold text-veneza-800 mb-4">Preâmbulo</h2>
                <textarea
                  value={proposal.preambulo}
                  onChange={(e) => setProposal(prev => ({ ...prev, preambulo: e.target.value }))}
                  className="input-field min-h-[100px] font-serif"
                  placeholder="Texto introdutório..."
                />
                <p className="text-xs text-veneza-500 mt-2">
                  Fórmula legislativa padrão conforme LOM
                </p>
              </div>
            )}

            {activeSection === 'artigos' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-display font-bold text-veneza-800">Artigos</h2>
                  <button
                    onClick={addArticle}
                    className="px-4 py-2 bg-veneza-100 text-veneza-700 rounded-lg hover:bg-veneza-200 transition-all"
                  >
                    + Adicionar Artigo
                  </button>
                </div>

                <div className="space-y-6">
                  {proposal.artigos.map((artigo) => (
                    <div key={artigo.id} className="border border-veneza-200 rounded-lg p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <span className="inline-block px-3 py-1 bg-veneza-100 text-veneza-700 font-bold rounded">
                            {artigo.numero}
                          </span>
                        </div>
                        <div className="flex-1">
                          <textarea
                            value={artigo.texto}
                            onChange={(e) => updateArticle(artigo.id, e.target.value)}
                            className="w-full px-4 py-3 border-2 border-veneza-200 rounded-lg focus:border-veneza-500 focus:outline-none font-serif min-h-[100px]"
                            placeholder="Texto do artigo..."
                          />
                          {artigo.citacoes.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {artigo.citacoes.map((citacao, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-oro-100 text-oro-800 text-xs rounded-full"
                                >
                                  <Scale size={12} />
                                  {citacao}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'vigencia' && (
              <div>
                <h2 className="text-xl font-display font-bold text-veneza-800 mb-4">Vigência</h2>
                <textarea
                  value={proposal.vigencia}
                  onChange={(e) => setProposal(prev => ({ ...prev, vigencia: e.target.value }))}
                  className="input-field min-h-[80px] font-serif"
                  placeholder="Cláusula de vigência..."
                />
              </div>
            )}

            {activeSection === 'revogacao' && (
              <div>
                <h2 className="text-xl font-display font-bold text-veneza-800 mb-4">Revogação</h2>
                <textarea
                  value={proposal.revogacao}
                  onChange={(e) => setProposal(prev => ({ ...prev, revogacao: e.target.value }))}
                  className="input-field min-h-[80px] font-serif"
                  placeholder="Cláusula revogatória..."
                />
              </div>
            )}
          </div>
        </div>

        {/* AI Assistant Sidebar */}
        {showAssistant && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="fixed right-0 top-0 w-96 h-screen bg-white border-l border-veneza-200 shadow-2xl overflow-y-auto"
          >
            <div className="sticky top-0 bg-gradient-to-r from-veneza-600 to-veneza-700 p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Scale size={20} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold">Assistente Jurídico</h3>
                    <p className="text-xs text-veneza-100">Com RAG e citações normativas</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAssistant(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-all"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Suggestions */}
              {assistantSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`
                    p-4 rounded-lg border-l-4
                    ${suggestion.type === 'citation'
                      ? 'bg-veneza-50 border-veneza-500'
                      : suggestion.type === 'improvement'
                        ? 'bg-oro-50 border-oro-500'
                        : 'bg-rosso-50 border-rosso-500'
                    }
                  `}
                >
                  <p className="text-sm text-veneza-800 mb-3">{suggestion.text}</p>
                  <button className="flex items-center gap-2 text-sm font-medium text-veneza-700 hover:text-veneza-900">
                    <ExternalLink size={14} />
                    {suggestion.action}
                  </button>
                </div>
              ))}

              {/* Chat Interface */}
              <div className="border-t border-veneza-200 pt-4">
                <h4 className="font-semibold text-veneza-800 mb-3 flex items-center gap-2">
                  <MessageSquare size={18} />
                  Perguntar ao Assistente
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={assistantMessage}
                    onChange={(e) => setAssistantMessage(e.target.value)}
                    className="flex-1 px-3 py-2 border-2 border-veneza-200 rounded-lg focus:border-veneza-500 focus:outline-none text-sm"
                    placeholder="Ex: Esta lei precisa de maioria absoluta?"
                  />
                  <button className="px-4 py-2 bg-veneza-600 text-white rounded-lg hover:bg-veneza-700 transition-all">
                    →
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Toggle Assistant Button (when hidden) */}
        {!showAssistant && (
          <motion.button
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            onClick={() => setShowAssistant(true)}
            className="fixed right-6 bottom-6 w-14 h-14 bg-veneza-600 text-white rounded-full shadow-lg hover:bg-veneza-700 hover:shadow-xl transition-all flex items-center justify-center"
          >
            <Scale size={24} />
          </motion.button>
        )}
      </div>
    </div>
  )
}

export default ProposalEditor
