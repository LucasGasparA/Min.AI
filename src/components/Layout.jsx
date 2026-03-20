import { Outlet, Link, useLocation } from 'react-router-dom'
import { FileText, Home, PlusCircle, Settings, LogOut, MapPin, Scale } from 'lucide-react'

const Layout = ({ selectedMunicipality }) => {
  const location = useLocation()

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/create-proposal', icon: PlusCircle, label: 'Nova Proposição' },
    { path: '/select-municipality', icon: MapPin, label: 'Município' },
  ]

  return (
    <div className="min-h-screen flex bg-veneza-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-veneza-200 flex flex-col shadow-lg">
        {/* Logo/Brand */}
        <div className="p-6 border-b border-veneza-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-veneza-600 to-veneza-800 rounded-lg flex items-center justify-center">
              <Scale className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-veneza-800">
                LegislaApp
              </h1>
              <p className="text-xs text-veneza-500">Assistente Legislativo</p>
            </div>
          </div>
        </div>

        {/* Municipality Info */}
        {selectedMunicipality && (
          <div className="p-4 mx-4 mt-4 bg-veneza-50 rounded-lg border border-veneza-200">
            <p className="text-xs text-veneza-600 font-medium mb-1">Município</p>
            <p className="text-sm font-semibold text-veneza-800">{selectedMunicipality.name}</p>
            <p className="text-xs text-veneza-500">{selectedMunicipality.state}</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-veneza-600 text-white shadow-md' 
                    : 'text-veneza-600 hover:bg-veneza-100'
                  }
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-veneza-100 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-veneza-600 hover:bg-veneza-100 rounded-lg transition-all duration-200">
            <Settings size={20} />
            <span className="font-medium">Configurações</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200">
            <LogOut size={20} />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
