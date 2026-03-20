import { useState } from 'react'
import { Scale, Mail, Lock, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulate login - in production, call API
    onLogin()
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-veneza-700 via-veneza-600 to-veneza-800 p-12 flex-col justify-between relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-oro-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Scale className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-white">LegislaApp</h1>
              <p className="text-veneza-200">Assistente Legislativo Municipal</p>
            </div>
          </div>

          <div className="space-y-6 text-white">
            <h2 className="text-4xl font-display font-bold leading-tight">
              Democratizando a técnica legislativa
            </h2>
            <p className="text-lg text-veneza-100">
              Sistema inteligente para elaboração de propostas legislativas municipais 
              com conformidade normativa e rastreabilidade completa.
            </p>
          </div>
        </div>

        <div className="relative z-10 space-y-4 text-white/80">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-oro-400 rounded-full mt-2"></div>
            <p>Assistência jurídica com LLM e recuperação de informação (RAG)</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-oro-400 rounded-full mt-2"></div>
            <p>Validação automática de conformidade com LOM e Regimento</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-oro-400 rounded-full mt-2"></div>
            <p>Citações e trilha de auditoria completa</p>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex-1 flex items-center justify-center p-8 bg-veneza-50"
      >
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-veneza-600 to-veneza-800 rounded-xl flex items-center justify-center">
              <Scale className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-veneza-800">LegislaApp</h1>
              <p className="text-sm text-veneza-600">Assistente Legislativo</p>
            </div>
          </div>

          <div className="card p-8">
            <h2 className="text-2xl font-display font-bold text-veneza-800 mb-2">
              Bem-vindo de volta
            </h2>
            <p className="text-veneza-600 mb-8">
              Entre com suas credenciais para acessar o sistema
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-veneza-700 mb-2">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-veneza-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-11"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-veneza-700 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-veneza-400" size={20} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-11"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 text-veneza-600 rounded" />
                  <span className="text-sm text-veneza-600">Lembrar-me</span>
                </label>
                <a href="#" className="text-sm text-veneza-600 hover:text-veneza-800 font-medium">
                  Esqueceu a senha?
                </a>
              </div>

              <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2">
                <span>Entrar</span>
                <ArrowRight size={20} />
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-veneza-600">
                Não tem uma conta?{' '}
                <a href="#" className="font-medium text-veneza-700 hover:text-veneza-800">
                  Solicitar acesso
                </a>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-veneza-500 mt-8">
            Versão 1.0 • Sistema em conformidade com LGPD
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
