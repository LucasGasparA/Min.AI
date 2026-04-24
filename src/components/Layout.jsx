import { Outlet, Link, useLocation } from 'react-router-dom'
import { Home, PlusCircle, Settings, LogOut, MapPin, Scale } from 'lucide-react'

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
}

const Layout = ({ selectedMunicipality, onLogout, user }) => {
  const location = useLocation()

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/create-proposal', icon: PlusCircle, label: 'Nova Proposição' },
    { path: '/select-municipality', icon: MapPin, label: 'Município' },
  ]

  return (
    <div className="min-h-screen flex bg-primary-50 print:block print:bg-white">
      <aside className="w-64 bg-white border-r border-primary-200 flex flex-col shadow-lg print:hidden">
        {/* Logo */}
        <div className="p-6 border-b border-primary-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
              <Scale className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-primary-800">LegislaApp</h1>
              <p className="text-xs text-primary-500">Assistente Legislativo</p>
            </div>
          </div>
        </div>

        {/* Município */}
        {selectedMunicipality && (
          <div className="px-4 pt-4">
            <div className="p-3 bg-primary-50 rounded-lg border border-primary-200">
              <p className="text-xs text-primary-500 font-medium mb-0.5">Município ativo</p>
              <p className="text-sm font-semibold text-primary-800 leading-tight">{selectedMunicipality.name}</p>
              <p className="text-xs text-primary-400">{selectedMunicipality.state}</p>
            </div>
          </div>
        )}

        {/* Navegação */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm
                  ${isActive
                    ? 'bg-primary-600 text-white shadow-sm font-semibold'
                    : 'text-primary-600 hover:bg-primary-50 hover:text-primary-800 font-medium'
                  }
                `}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Rodapé: usuário + ações */}
        <div className="p-4 border-t border-primary-100 space-y-1">
          {/* Info do usuário */}
          {user && (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-2">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">{getInitials(user.name)}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-primary-800 truncate">{user.name}</p>
                <p className="text-xs text-primary-400 truncate">{user.email}</p>
              </div>
            </div>
          )}

          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 font-medium">
            <Settings size={18} />
            <span>Configurações</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium"
          >
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto print:overflow-visible">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
