import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Save, Download, MessageSquare, AlertTriangle, CheckCircle, FileText, Scale, ExternalLink, Send } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { api } from '../utils/api.js'

const ProposalEditor = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState('ementa')
  const [showAssistant, setShowAssistant] = useState(true)
  const [assistantMessage, setAssistantMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef(null)

  const [proposal, setProposal] = useState({
    ementa: 'Dispõe sobre a criação do Programa Municipal de Coleta Seletiva de Resíduos Recicláveis.',
    preambulo: 'O Prefeito Municipal, faz saber que a Câmara aprovou a seguinte Lei:',
    artigos: [],
    vigencia: 'Entra em vigor na data de sua publicação.',
    revogacao: 'Revogam-se as disposições em contrário.',
  })

  const [validations] = useState([
    { type: 'success', message: 'Competência municipal verificada — Art. 145, VI da LOM' },
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
      text: 'LOM, Art. 145, VI: "Compete ao Município proteger o meio ambiente e combater a poluição em qualquer de suas formas."',
      action: 'Ver citação',
    },
    {
      type: 'improvement',
      text: 'Sugestão: Incluir artigo definindo prazo para implementação gradual do programa.',
      action: 'Aplicar sugestão',
    },
    {
      type: 'alert',
      text: 'Programas com impacto orçamentário requerem anexo com estimativa de custos conforme LRF.',
      action: 'Ver detalhes',
    },
  ]

  useEffect(() => {
    api.get('/proposals/' + id)
      .then(data => {
        if (data.content && data.content !== '{}') {
          setProposal(JSON.parse(data.content))
        }
      })
      .catch(() => toast.error('Erro ao carregar proposição'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory])

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put('/proposals/' + id, { content: JSON.stringify(proposal) })
      toast.success('Proposição salva com sucesso!')
    } catch (e) {
      toast.error('Erro ao salvar: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleAskAssistant = async () => {
    const msg = assistantMessage.trim()
    if (!msg || chatLoading) return
    setAssistantMessage('')
    setChatHistory(prev => [...prev, { role: 'user', text: msg }])
    setChatLoading(true)
    try {
      const res = await api.post('/ai/chat', {
        proposalId: id,
        message: msg,
        promptContext: JSON.stringify(proposal),
      })
      setChatHistory(prev => [...prev, { role: 'assistant', text: res.text }])
    } catch (e) {
      setChatHistory(prev => [...prev, { role: 'error', text: 'Erro: ' + e.message }])
    } finally {
      setChatLoading(false)
    }
  }

  const updateArticle = (artId, newText) => {
    setProposal(prev => ({
      ...prev,
      artigos: prev.artigos.map(art => art.id === artId ? { ...art, texto: newText } : art),
    }))
  }

  const addArticle = () => {
    const newId = proposal.artigos.length + 1
    setProposal(prev => ({
      ...prev,
      artigos: [...prev.artigos, { id: newId, numero: `Art. ${newId}º`, texto: '', citacoes: [] }],
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-50">
        <p className="text-primary-600">Carregando editor...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-50 print:bg-white">
      {/* Top Bar */}
      <div className="bg-white border-b border-primary-200 px-6 py-4 sticky top-0 z-10 shadow-sm print:hidden">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-display font-bold text-primary-800">Editor de Minuta Legislativa</h1>
            <p className="text-sm text-primary-600">Projeto de Lei — Nova Proposição</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 text-primary-700 hover:bg-primary-50 rounded-lg transition-all disabled:opacity-50"
            >
              <Save size={18} />
              <span className="hidden md:inline">{saving ? 'Salvando...' : 'Salvar'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-md"
            >
              <Download size={18} />
              <span className="hidden md:inline">Exportar para PDF</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex print:block">
        {/* Main Editor */}
        <div className={`flex-1 p-6 transition-all duration-300 ${showAssistant ? 'mr-96' : ''} print:hidden`}>
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
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'text-primary-600 hover:bg-primary-100'
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
                className={`p-4 rounded-lg border-l-4 flex items-start gap-3
                  ${validation.type === 'success' ? 'bg-green-50 border-green-500' :
                    validation.type === 'warning' ? 'bg-oro-50 border-oro-500' : 'bg-red-50 border-red-500'}
                `}
              >
                {validation.type === 'success'
                  ? <CheckCircle className="text-green-600 mt-0.5" size={20} />
                  : <AlertTriangle className={validation.type === 'warning' ? 'text-oro-600' : 'text-red-600'} size={20} />
                }
                <p className={`text-sm ${validation.type === 'success' ? 'text-green-800' :
                  validation.type === 'warning' ? 'text-oro-800' : 'text-red-800'}`}>
                  {validation.message}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Editor Content */}
          <div className="card p-8">
            {activeSection === 'ementa' && (
              <div>
                <h2 className="text-xl font-display font-bold text-primary-800 mb-4">Ementa</h2>
                <textarea
                  value={proposal.ementa}
                  onChange={(e) => setProposal(prev => ({ ...prev, ementa: e.target.value }))}
                  className="input-field min-h-[100px] font-serif"
                  placeholder="Resumo do objeto da lei..."
                />
                <p className="text-xs text-primary-500 mt-2">
                  A ementa deve resumir de forma clara e objetiva o conteúdo da proposição
                </p>
              </div>
            )}

            {activeSection === 'preambulo' && (
              <div>
                <h2 className="text-xl font-display font-bold text-primary-800 mb-4">Preâmbulo</h2>
                <textarea
                  value={proposal.preambulo}
                  onChange={(e) => setProposal(prev => ({ ...prev, preambulo: e.target.value }))}
                  className="input-field min-h-[100px] font-serif"
                  placeholder="Texto introdutório..."
                />
                <p className="text-xs text-primary-500 mt-2">Fórmula legislativa padrão conforme LOM</p>
              </div>
            )}

            {activeSection === 'artigos' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-display font-bold text-primary-800">Artigos</h2>
                  <button
                    onClick={addArticle}
                    className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-all"
                  >
                    + Adicionar Artigo
                  </button>
                </div>

                <div className="space-y-6">
                  {proposal.artigos.length === 0 && (
                    <p className="text-primary-500 text-center py-8">Nenhum artigo adicionado. Clique em "+ Adicionar Artigo".</p>
                  )}
                  {proposal.artigos.map((artigo) => (
                    <div key={artigo.id} className="border border-primary-200 rounded-lg p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 font-bold rounded">
                            {artigo.numero}
                          </span>
                        </div>
                        <div className="flex-1">
                          <textarea
                            value={artigo.texto}
                            onChange={(e) => updateArticle(artigo.id, e.target.value)}
                            className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:border-primary-500 focus:outline-none font-serif min-h-[100px]"
                            placeholder="Texto do artigo..."
                          />
                          {artigo.citacoes?.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {artigo.citacoes.map((citacao, idx) => (
                                <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-oro-100 text-oro-800 text-xs rounded-full">
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
                <h2 className="text-xl font-display font-bold text-primary-800 mb-4">Vigência</h2>
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
                <h2 className="text-xl font-display font-bold text-primary-800 mb-4">Revogação</h2>
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
            className="fixed right-0 top-0 w-96 h-screen bg-white border-l border-primary-200 shadow-2xl flex flex-col print:hidden"
          >
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Scale size={20} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold">Assistente Jurídico</h3>
                    <p className="text-xs text-primary-100">Com citações normativas</p>
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

            {/* Suggestions */}
            <div className="p-4 space-y-3 border-b border-primary-100 flex-shrink-0">
              {assistantSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-l-4 text-sm
                    ${suggestion.type === 'citation' ? 'bg-primary-50 border-primary-500' :
                      suggestion.type === 'improvement' ? 'bg-oro-50 border-oro-500' : 'bg-rosso-50 border-rosso-500'}
                  `}
                >
                  <p className="text-primary-800 mb-2">{suggestion.text}</p>
                  <button className="flex items-center gap-1 text-xs font-medium text-primary-700 hover:text-primary-900">
                    <ExternalLink size={12} />
                    {suggestion.action}
                  </button>
                </div>
              ))}
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatHistory.length === 0 && (
                <p className="text-xs text-primary-400 text-center mt-4">
                  Faça uma pergunta sobre a proposição...
                </p>
              )}
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`rounded-lg p-3 text-sm ${
                    msg.role === 'user'
                      ? 'bg-primary-600 text-white ml-4'
                      : msg.role === 'error'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-primary-50 text-primary-800 mr-4'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <p className="text-xs font-semibold text-primary-500 mb-1">Assistente</p>
                  )}
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                </div>
              ))}
              {chatLoading && (
                <div className="bg-primary-50 text-primary-600 rounded-lg p-3 text-sm mr-4 animate-pulse">
                  Analisando...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-primary-200 flex-shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={assistantMessage}
                  onChange={(e) => setAssistantMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleAskAssistant()}
                  className="flex-1 px-3 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 focus:outline-none text-sm"
                  placeholder="Ex: Esta lei precisa de maioria absoluta?"
                  disabled={chatLoading}
                />
                <button
                  onClick={handleAskAssistant}
                  disabled={chatLoading || !assistantMessage.trim()}
                  className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {!showAssistant && (
          <motion.button
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            onClick={() => setShowAssistant(true)}
            className="fixed right-6 bottom-6 w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 hover:shadow-xl transition-all flex items-center justify-center print:hidden"
          >
            <MessageSquare size={24} />
          </motion.button>
        )}
      </div>

      {/* Printable Content */}
      <div className="hidden print:block font-serif text-black bg-white p-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold uppercase">Estado de Santa Catarina</h1>
          <h2 className="text-xl font-bold uppercase">Câmara Municipal de Nova Veneza</h2>
        </div>
        <div className="text-right mb-12 w-1/2 ml-auto">
          <p className="italic font-bold">{proposal.ementa}</p>
        </div>
        <div className="mb-8 text-justify leading-relaxed">
          <p>{proposal.preambulo}</p>
        </div>
        <div className="space-y-6 mb-8 text-justify leading-relaxed">
          {proposal.artigos.map(artigo => (
            <div key={artigo.id}>
              <span className="font-bold mr-2">{artigo.numero}</span>
              <span>{artigo.texto}</span>
            </div>
          ))}
        </div>
        <div className="mb-8 text-justify leading-relaxed"><p>{proposal.vigencia}</p></div>
        <div className="mb-12 text-justify leading-relaxed"><p>{proposal.revogacao}</p></div>
        <div className="mt-24 text-center">
          <p>Nova Veneza/SC, {new Date().toLocaleDateString('pt-BR')}</p>
          <div className="mt-12 border-t border-black w-64 mx-auto pt-2">
            <p className="font-bold">Assinatura</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProposalEditor
