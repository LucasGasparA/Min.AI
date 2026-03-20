import { useState } from 'react'
import { FileText, ArrowRight, ArrowLeft, Check, Scale, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const CreateProposal = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    type: '',
    theme: '',
    objective: '',
    competence: '',
    hasFinancialImpact: null,
    estimatedImpact: '',
    justification: '',
  })

  const proposalTypes = [
    {
      value: 'pl_ordinaria',
      label: 'Projeto de Lei Ordinária',
      description: 'Lei municipal que trata de matérias de competência do município (maioria simples)',
      icon: '📜',
    },
    {
      value: 'pl_complementar',
      label: 'Projeto de Lei Complementar',
      description: 'Lei que complementa a LOM em matérias específicas (maioria absoluta)',
      icon: '📋',
    },
    {
      value: 'decreto',
      label: 'Decreto Municipal',
      description: 'Ato administrativo do Executivo para regulamentar leis',
      icon: '📄',
    },
    {
      value: 'indicacao',
      label: 'Indicação',
      description: 'Sugestão ao Executivo para realização de melhorias ou serviços',
      icon: '💡',
    },
  ]

  const steps = [
    { id: 0, title: 'Tipo de Proposição', description: 'Escolha o tipo de documento legislativo' },
    { id: 1, title: 'Tema e Objetivo', description: 'Defina o assunto e objetivo' },
    { id: 2, title: 'Competência', description: 'Verifique competência municipal' },
    { id: 3, title: 'Impacto Orçamentário', description: 'Avalie impactos financeiros' },
    { id: 4, title: 'Justificativa', description: 'Fundamente a proposição' },
  ]

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.type !== ''
      case 1:
        return formData.theme && formData.objective
      case 2:
        return formData.competence !== ''
      case 3:
        return formData.hasFinancialImpact !== null
      case 4:
        return formData.justification.length > 50
      default:
        return false
    }
  }

  const handleFinish = () => {
    // Simulate creating proposal and navigating to editor
    const proposalId = 'temp-' + Date.now()
    navigate(`/proposal/${proposalId}/edit`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-veneza-50 via-white to-oro-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-display font-bold text-veneza-800 mb-2 flex items-center gap-3">
            <FileText className="text-veneza-600" size={40} />
            Nova Proposição Legislativa
          </h1>
          <p className="text-veneza-600">
            Wizard guiado com assistência jurídica inteligente
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="card p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300
                      ${index < currentStep
                        ? 'bg-veneza-600 text-white'
                        : index === currentStep
                          ? 'bg-veneza-500 text-white ring-4 ring-veneza-200'
                          : 'bg-veneza-100 text-veneza-400'
                      }
                    `}
                  >
                    {index < currentStep ? <Check size={20} /> : index + 1}
                  </div>
                  <div className="mt-2 text-center hidden lg:block">
                    <p className={`text-xs font-medium ${index <= currentStep ? 'text-veneza-700' : 'text-veneza-400'
                      }`}>
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`
                      h-1 flex-1 mx-2 transition-all duration-300
                      ${index < currentStep ? 'bg-veneza-600' : 'bg-veneza-200'}
                    `}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="card p-8 mb-6"
          >
            <h2 className="text-2xl font-display font-bold text-veneza-800 mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-veneza-600 mb-6">{steps[currentStep].description}</p>

            {/* Step 0: Type Selection */}
            {currentStep === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {proposalTypes.map((type) => (
                  <div
                    key={type.value}
                    onClick={() => updateFormData('type', type.value)}
                    className={`
                      p-6 border-2 rounded-lg cursor-pointer transition-all duration-200
                      ${formData.type === type.value
                        ? 'border-veneza-500 bg-veneza-50 shadow-lg'
                        : 'border-veneza-200 hover:border-veneza-400 hover:shadow-md'
                      }
                    `}
                  >
                    <div className="text-4xl mb-3">{type.icon}</div>
                    <h3 className="font-display font-bold text-veneza-800 mb-2">
                      {type.label}
                    </h3>
                    <p className="text-sm text-veneza-600">{type.description}</p>
                    {formData.type === type.value && (
                      <div className="mt-3 flex items-center gap-2 text-veneza-600">
                        <Check size={16} />
                        <span className="text-sm font-medium">Selecionado</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Step 1: Theme and Objective */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-veneza-700 mb-2">
                    Tema da Proposição
                  </label>
                  <input
                    type="text"
                    value={formData.theme}
                    onChange={(e) => updateFormData('theme', e.target.value)}
                    className="input-field"
                    placeholder="Ex: Coleta Seletiva de Lixo Reciclável"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-veneza-700 mb-2">
                    Objetivo Principal
                  </label>
                  <textarea
                    value={formData.objective}
                    onChange={(e) => updateFormData('objective', e.target.value)}
                    className="input-field min-h-[120px]"
                    placeholder="Descreva o objetivo principal desta proposição..."
                  />
                </div>

                <div className="bg-veneza-50 border border-veneza-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Scale className="text-veneza-600 mt-1" size={20} />
                    <div>
                      <p className="text-sm font-medium text-veneza-800 mb-1">
                        Dica do Assistente Jurídico
                      </p>
                      <p className="text-sm text-veneza-700">
                        Seja específico sobre o que deseja alcançar. Objetivos claros facilitam
                        a análise de competência e a redação da minuta.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Competence */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-veneza-700 mb-2">
                    A matéria é de competência municipal?
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['Sim, exclusiva', 'Sim, concorrente', 'Não tenho certeza'].map((option) => (
                      <div
                        key={option}
                        onClick={() => updateFormData('competence', option)}
                        className={`
                          p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                          ${formData.competence === option
                            ? 'border-veneza-500 bg-veneza-50'
                            : 'border-veneza-200 hover:border-veneza-400'
                          }
                        `}
                      >
                        <p className="font-medium text-veneza-800">{option}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {formData.competence === 'Não tenho certeza' && (
                  <div className="bg-oro-50 border-2 border-oro-300 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="text-oro-600 mt-1" size={20} />
                      <div>
                        <p className="text-sm font-medium text-oro-800 mb-1">
                          Verificação Necessária
                        </p>
                        <p className="text-sm text-oro-700">
                          O assistente jurídico irá consultar a Lei Orgânica do Município
                          para verificar a competência. Você receberá orientações específicas
                          baseadas nas normas locais.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Financial Impact */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-veneza-700 mb-2">
                    Esta proposição tem impacto orçamentário?
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      onClick={() => updateFormData('hasFinancialImpact', true)}
                      className={`
                        p-6 border-2 rounded-lg cursor-pointer transition-all duration-200
                        ${formData.hasFinancialImpact === true
                          ? 'border-veneza-500 bg-veneza-50'
                          : 'border-veneza-200 hover:border-veneza-400'
                        }
                      `}
                    >
                      <h3 className="font-display font-bold text-veneza-800 mb-2">Sim</h3>
                      <p className="text-sm text-veneza-600">
                        Gera despesas ou afeta receitas municipais
                      </p>
                    </div>
                    <div
                      onClick={() => updateFormData('hasFinancialImpact', false)}
                      className={`
                        p-6 border-2 rounded-lg cursor-pointer transition-all duration-200
                        ${formData.hasFinancialImpact === false
                          ? 'border-veneza-500 bg-veneza-50'
                          : 'border-veneza-200 hover:border-veneza-400'
                        }
                      `}
                    >
                      <h3 className="font-display font-bold text-veneza-800 mb-2">Não</h3>
                      <p className="text-sm text-veneza-600">
                        Não gera impacto financeiro direto
                      </p>
                    </div>
                  </div>
                </div>

                {formData.hasFinancialImpact && (
                  <div>
                    <label className="block text-sm font-medium text-veneza-700 mb-2">
                      Estimativa de Impacto (R$)
                    </label>
                    <input
                      type="text"
                      value={formData.estimatedImpact}
                      onChange={(e) => updateFormData('estimatedImpact', e.target.value)}
                      className="input-field"
                      placeholder="Ex: 150.000,00"
                    />
                    <p className="text-xs text-veneza-500 mt-2">
                      Será necessário anexar estimativa de impacto orçamentário-financeiro
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Justification */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-veneza-700 mb-2">
                    Justificativa da Proposição
                  </label>
                  <textarea
                    value={formData.justification}
                    onChange={(e) => updateFormData('justification', e.target.value)}
                    className="input-field min-h-[200px]"
                    placeholder="Fundamente a necessidade e relevância desta proposição..."
                  />
                  <p className="text-xs text-veneza-500 mt-2">
                    Mínimo 50 caracteres • {formData.justification.length}/50
                  </p>
                </div>

                <div className="bg-veneza-50 border border-veneza-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Scale className="text-veneza-600 mt-1" size={20} />
                    <div>
                      <p className="text-sm font-medium text-veneza-800 mb-1">
                        O assistente irá enriquecer sua justificativa
                      </p>
                      <p className="text-sm text-veneza-700">
                        Com base nas normas locais e boas práticas legislativas, o sistema
                        sugerirá melhorias e citações relevantes para fortalecer sua argumentação.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200
              ${currentStep === 0
                ? 'bg-veneza-100 text-veneza-400 cursor-not-allowed'
                : 'bg-white border-2 border-veneza-300 text-veneza-700 hover:border-veneza-500 hover:shadow-md'
              }
            `}
          >
            <ArrowLeft size={20} />
            <span>Anterior</span>
          </button>

          <div className="text-sm text-veneza-600">
            Passo {currentStep + 1} de {steps.length}
          </div>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200
                ${canProceed()
                  ? 'bg-veneza-600 text-white hover:bg-veneza-700 shadow-md hover:shadow-lg'
                  : 'bg-veneza-200 text-veneza-400 cursor-not-allowed'
                }
              `}
            >
              <span>Próximo</span>
              <ArrowRight size={20} />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={!canProceed()}
              className={`
                flex items-center gap-2 px-8 py-3 rounded-lg font-bold transition-all duration-200
                ${canProceed()
                  ? 'bg-gradient-to-r from-veneza-600 to-veneza-700 text-white hover:from-veneza-700 hover:to-veneza-800 shadow-lg hover:shadow-xl'
                  : 'bg-veneza-200 text-veneza-400 cursor-not-allowed'
                }
              `}
            >
              <Check size={20} />
              <span>Gerar Minuta</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreateProposal
