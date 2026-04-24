import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Save, Download, MessageSquare, AlertTriangle, CheckCircle,
  FileText, Scale, ExternalLink, Send, ArrowLeft,
  BookOpen, List, Calendar, Minus, AlignLeft,
} from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { api } from '../utils/api.js'
import { exportToPDF } from '../utils/exportPdf.js'

const SECTIONS = [
  { id: 'ementa',    label: 'Ementa',    icon: AlignLeft,  hint: 'A ementa resume de forma clara e objetiva o conteúdo da proposição.' },
  { id: 'preambulo', label: 'Preâmbulo', icon: BookOpen,   hint: 'Fórmula legislativa padrão conforme LOM.' },
  { id: 'artigos',   label: 'Artigos',   icon: List,       hint: null },
  { id: 'vigencia',  label: 'Vigência',  icon: Calendar,   hint: null },
  { id: 'revogacao', label: 'Revogação', icon: Minus,      hint: null },
]

const ASSISTANT_SUGGESTIONS = [
  { type: 'citation',    text: 'LOM, Art. 145, VI: "Compete ao Município proteger o meio ambiente e combater a poluição em qualquer de suas formas."', action: 'Ver citação' },
  { type: 'improvement', text: 'Sugestão: Incluir artigo definindo prazo para implementação gradual do programa.', action: 'Aplicar sugestão' },
  { type: 'alert',       text: 'Programas com impacto orçamentário requerem anexo com estimativa de custos conforme LRF.', action: 'Ver detalhes' },
]

const ProposalEditor = () => {
  const { id } = useParams()
  const [loading, setLoading]             = useState(true)
  const [saving, setSaving]               = useState(false)
  const [proposalTitle, setProposalTitle] = useState('Proposição')
  const [activeSection, setActiveSection] = useState('ementa')
  const [showAssistant, setShowAssistant] = useState(true)
  const [assistantMessage, setAssistantMessage] = useState('')
  const [chatHistory, setChatHistory]     = useState([])
  const [chatLoading, setChatLoading]     = useState(false)
  const chatEndRef = useRef(null)

  const [doc, setDoc] = useState({
    ementa:    'Dispõe sobre a criação do Programa Municipal de Coleta Seletiva de Resíduos Recicláveis.',
    preambulo: 'O Prefeito Municipal, faz saber que a Câmara aprovou a seguinte Lei:',
    artigos:   [],
    vigencia:  'Entra em vigor na data de sua publicação.',
    revogacao: 'Revogam-se as disposições em contrário.',
  })

  const [validations] = useState([
    { type: 'success', message: 'Competência municipal verificada — Art. 145, VI da LOM' },
    { type: 'success', message: 'Estrutura conforme técnica legislativa' },
    { type: 'warning', message: 'Recomenda-se anexar estimativa de impacto orçamentário' },
  ])

  useEffect(() => {
    api.get('/proposals/' + id)
      .then(data => {
        if (data.title) setProposalTitle(data.title)
        if (data.content && data.content !== '{}') {
          try { setDoc(JSON.parse(data.content)) } catch { /* mantém padrão */ }
        }
      })
      .catch(() => toast.error('Erro ao carregar proposição'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory])

  // Ctrl+S para salvar
  const docRef = useRef(doc)
  useEffect(() => { docRef.current = doc }, [doc])

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      await api.put('/proposals/' + id, { content: JSON.stringify(docRef.current) })
      toast.success('Salvo!')
    } catch (e) {
      toast.error('Erro ao salvar: ' + e.message)
    } finally {
      setSaving(false)
    }
  }, [id])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleSave])

  const handleAskAssistant = async () => {
    const msg = assistantMessage.trim()
    if (!msg || chatLoading) return
    setAssistantMessage('')
    setChatHistory(prev => [...prev, { role: 'user', text: msg }])
    setChatLoading(true)
    try {
      const res = await api.post('/ai/chat', { proposalId: id, message: msg, promptContext: JSON.stringify(docRef.current) })
      setChatHistory(prev => [...prev, { role: 'assistant', text: res.text }])
    } catch (e) {
      setChatHistory(prev => [...prev, { role: 'error', text: 'Erro: ' + e.message }])
    } finally {
      setChatLoading(false)
    }
  }

  const addArticle = () => {
    const n = doc.artigos.length + 1
    setDoc(prev => ({ ...prev, artigos: [...prev.artigos, { id: n, numero: `Art. ${n}º`, texto: '', citacoes: [] }] }))
  }

  const updateArticle = (artId, newText) => {
    setDoc(prev => ({ ...prev, artigos: prev.artigos.map(a => a.id === artId ? { ...a, texto: newText } : a) }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-50">
        <div className="flex items-center gap-3 text-primary-500">
          <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          Carregando editor...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-50 print:bg-white">
      {/* Top Bar */}
      <div className="bg-white border-b border-primary-200 px-6 py-3 sticky top-0 z-10 shadow-sm print:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/dashboard" className="text-primary-400 hover:text-primary-600 transition-colors flex-shrink-0">
              <ArrowLeft size={20} />
            </Link>
            <div className="min-w-0">
              <h1 className="text-base font-display font-bold text-primary-800 truncate">{proposalTitle}</h1>
              <p className="text-xs text-primary-400">Editor de Minuta Legislativa</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-primary-400 hidden md:block">Ctrl+S para salvar</span>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-primary-600 hover:bg-primary-50 border border-primary-200 rounded-lg transition-all disabled:opacity-50"
            >
              <Save size={15} />
              <span>{saving ? 'Salvando...' : 'Salvar'}</span>
            </button>
            <button
              onClick={() => {
                toast.promise(
                  exportToPDF(proposalTitle, docRef.current),
                  { loading: 'Gerando PDF...', success: 'PDF exportado!', error: 'Erro ao gerar PDF' }
                )
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-sm"
            >
              <Download size={15} />
              <span className="hidden md:inline">Exportar PDF</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex print:block">
        {/* Main Editor */}
        <div className={`flex-1 p-6 transition-all duration-300 ${showAssistant ? 'mr-96' : ''} print:hidden`}>
          {/* Seção Nav */}
          <div className="card p-3 mb-5">
            <div className="flex items-center gap-1 overflow-x-auto">
              {SECTIONS.map(({ id: sId, label, icon: Icon }) => (
                <button
                  key={sId}
                  onClick={() => setActiveSection(sId)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                    ${activeSection === sId ? 'bg-primary-600 text-white shadow-sm' : 'text-primary-500 hover:bg-primary-50 hover:text-primary-700'}`}
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Validações */}
          <div className="space-y-2 mb-5">
            {validations.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`p-3 rounded-lg border-l-4 flex items-center gap-2.5
                  ${v.type === 'success' ? 'bg-green-50 border-green-500' : v.type === 'warning' ? 'bg-amber-50 border-amber-400' : 'bg-red-50 border-red-500'}`}
              >
                {v.type === 'success'
                  ? <CheckCircle className="text-green-600 flex-shrink-0" size={16} />
                  : <AlertTriangle className={v.type === 'warning' ? 'text-amber-500 flex-shrink-0' : 'text-red-600 flex-shrink-0'} size={16} />
                }
                <p className={`text-xs ${v.type === 'success' ? 'text-green-800' : v.type === 'warning' ? 'text-amber-800' : 'text-red-800'}`}>{v.message}</p>
              </motion.div>
            ))}
          </div>

          {/* Conteúdo */}
          <div className="card p-8">
            {(() => {
              const section = SECTIONS.find(s => s.id === activeSection)
              const Icon = section?.icon ?? FileText
              return (
                <div className="flex items-center gap-2 mb-5">
                  <Icon size={20} className="text-primary-400" />
                  <h2 className="text-xl font-display font-bold text-primary-800">{section?.label}</h2>
                </div>
              )
            })()}

            {activeSection === 'ementa' && (
              <div>
                <textarea value={doc.ementa} onChange={e => setDoc(p => ({ ...p, ementa: e.target.value }))}
                  className="input-field min-h-[90px] font-serif resize-none" placeholder="Resumo do objeto da lei..." />
                <p className="text-xs text-primary-400 mt-2">A ementa resume de forma clara e objetiva o conteúdo da proposição.</p>
              </div>
            )}

            {activeSection === 'preambulo' && (
              <div>
                <textarea value={doc.preambulo} onChange={e => setDoc(p => ({ ...p, preambulo: e.target.value }))}
                  className="input-field min-h-[90px] font-serif resize-none" placeholder="Texto introdutório..." />
                <p className="text-xs text-primary-400 mt-2">Fórmula legislativa padrão conforme LOM.</p>
              </div>
            )}

            {activeSection === 'artigos' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-primary-500">{doc.artigos.length} artigo(s)</p>
                  <button onClick={addArticle}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-all">
                    + Adicionar Artigo
                  </button>
                </div>
                {doc.artigos.length === 0 ? (
                  <div className="text-center py-10 text-primary-400">
                    <List size={32} className="mx-auto mb-3 opacity-40" />
                    <p className="text-sm">Nenhum artigo ainda. Clique em "+ Adicionar Artigo".</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {doc.artigos.map(artigo => (
                      <div key={artigo.id} className="border border-primary-100 rounded-xl p-5">
                        <div className="flex items-start gap-4">
                          <span className="px-2.5 py-1 bg-primary-100 text-primary-700 font-bold text-sm rounded flex-shrink-0 mt-1">
                            {artigo.numero}
                          </span>
                          <div className="flex-1">
                            <textarea value={artigo.texto} onChange={e => updateArticle(artigo.id, e.target.value)}
                              className="w-full px-3 py-2.5 border-2 border-primary-100 rounded-lg focus:border-primary-400 focus:outline-none font-serif text-sm min-h-[80px] resize-none transition-colors"
                              placeholder="Texto do artigo..." />
                            {artigo.citacoes?.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {artigo.citacoes.map((c, i) => (
                                  <span key={i} className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-oro-100 text-oro-800 text-xs rounded-full">
                                    <Scale size={10} />{c}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === 'vigencia' && (
              <textarea value={doc.vigencia} onChange={e => setDoc(p => ({ ...p, vigencia: e.target.value }))}
                className="input-field min-h-[80px] font-serif resize-none" placeholder="Cláusula de vigência..." />
            )}

            {activeSection === 'revogacao' && (
              <textarea value={doc.revogacao} onChange={e => setDoc(p => ({ ...p, revogacao: e.target.value }))}
                className="input-field min-h-[80px] font-serif resize-none" placeholder="Cláusula revogatória..." />
            )}
          </div>
        </div>

        {/* Sidebar Assistente */}
        {showAssistant && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="fixed right-0 top-0 w-96 h-screen bg-white border-l border-primary-200 shadow-2xl flex flex-col print:hidden"
          >
            <div className="bg-gradient-to-r from-primary-700 to-primary-600 px-5 py-4 text-white flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                    <Scale size={18} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm">Assistente Jurídico</h3>
                    <p className="text-xs text-primary-200">Citações normativas em tempo real</p>
                  </div>
                </div>
                <button onClick={() => setShowAssistant(false)} className="text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-all text-lg leading-none">
                  ✕
                </button>
              </div>
            </div>

            {/* Sugestões */}
            <div className="p-4 space-y-2 border-b border-primary-100 flex-shrink-0">
              {ASSISTANT_SUGGESTIONS.map((s, i) => (
                <div key={i} className={`p-3 rounded-lg border-l-4 text-xs
                  ${s.type === 'citation' ? 'bg-primary-50 border-primary-400' : s.type === 'improvement' ? 'bg-amber-50 border-amber-400' : 'bg-red-50 border-red-400'}`}>
                  <p className="text-primary-700 mb-2 leading-relaxed">{s.text}</p>
                  <button className="flex items-center gap-1 text-primary-500 hover:text-primary-700 font-medium transition-colors">
                    <ExternalLink size={11} />{s.action}
                  </button>
                </div>
              ))}
            </div>

            {/* Chat */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatHistory.length === 0 && (
                <p className="text-xs text-primary-300 text-center mt-6 leading-relaxed">
                  Pergunte sobre competências,<br />constitucionalidade, citações legais...
                </p>
              )}
              {chatHistory.map((msg, i) => (
                <div key={i} className={`rounded-xl p-3 text-xs leading-relaxed
                  ${msg.role === 'user' ? 'bg-primary-600 text-white ml-6' : msg.role === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-primary-50 text-primary-800 mr-6'}`}>
                  {msg.role === 'assistant' && <p className="text-primary-400 font-semibold mb-1 text-[10px] uppercase tracking-wide">Assistente</p>}
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              ))}
              {chatLoading && (
                <div className="bg-primary-50 rounded-xl p-3 mr-6">
                  <div className="flex items-center gap-2 text-primary-400">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                    <span className="text-xs">Analisando...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-primary-100 flex-shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={assistantMessage}
                  onChange={e => setAssistantMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleAskAssistant()}
                  className="flex-1 px-3 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-400 focus:outline-none text-sm transition-colors"
                  placeholder="Faça uma pergunta jurídica..."
                  disabled={chatLoading}
                />
                <button
                  onClick={handleAskAssistant}
                  disabled={chatLoading || !assistantMessage.trim()}
                  className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all disabled:opacity-40"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {!showAssistant && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => setShowAssistant(true)}
            className="fixed right-6 bottom-6 w-13 h-13 w-12 h-12 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 hover:shadow-xl transition-all flex items-center justify-center print:hidden"
          >
            <MessageSquare size={22} />
          </motion.button>
        )}
      </div>

      {/* Versão para impressão */}
      <div className="hidden print:block font-serif text-black bg-white p-10 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold uppercase tracking-wide">Estado de Santa Catarina</h1>
          <h2 className="text-xl font-bold uppercase tracking-wide">Câmara Municipal de Nova Veneza</h2>
          <div className="mt-4 border-t border-black pt-4 text-right w-1/2 ml-auto">
            <p className="italic font-bold">{doc.ementa}</p>
          </div>
        </div>
        <div className="mb-8 text-justify leading-relaxed"><p>{doc.preambulo}</p></div>
        <div className="space-y-6 mb-8 text-justify leading-relaxed">
          {doc.artigos.map(a => (
            <div key={a.id}><span className="font-bold mr-2">{a.numero}</span><span>{a.texto}</span></div>
          ))}
        </div>
        <div className="mb-6 text-justify leading-relaxed"><p>{doc.vigencia}</p></div>
        <div className="mb-12 text-justify leading-relaxed"><p>{doc.revogacao}</p></div>
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
