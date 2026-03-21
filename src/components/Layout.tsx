import { Outlet, Link } from 'react-router-dom';
import { Home, Settings, Menu, QrCode } from 'lucide-react';

export default function Layout() {
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      
      {/* Sidebar Izquierdo (Oculto en móviles, visible en pantallas medianas/grandes) */}
      <aside className="w-64 bg-slate-900 text-white flex-col hidden md:flex">
        <div className="h-16 flex items-center justify-center border-b border-slate-700 font-bold text-xl">
          TriniGlass
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors">
            <Home size={20} />
            Inicio
          </Link>
          <Link to="/scanner" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors">
            <QrCode size={20} />
            Escáner QR
          </Link>
          <Link to="/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors">
            <Settings size={20} />
            Configuración
          </Link>
        </nav>
      </aside>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header Superior */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <button className="md:hidden text-gray-500 hover:text-gray-700">
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-4 ml-auto">
            <span className="text-sm font-medium text-gray-700">Usuario</span>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              U
            </div>
          </div>
        </header>

        {/* Área dinámica: Aquí React Router inyectará las diferentes pantallas */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}