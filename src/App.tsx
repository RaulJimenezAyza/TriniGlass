import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

// Estos son componentes "falsos" temporales para que veas que la navegación funciona.
// Más adelante crearás archivos separados para cada pantalla.
const Inicio = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-800 mb-4">Bienvenido a TriniGlass</h1>
    <p className="text-gray-600">Selecciona una opción en el menú lateral.</p>
  </div>
);

const Escaner = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-800 mb-4">Escáner QR</h1>
    <p className="text-gray-600">Aquí irá la integración con html5-qrcode.</p>
  </div>
);

const Configuracion = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-800 mb-4">Configuración</h1>
    <p className="text-gray-600">Ajustes de la aplicación.</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* La ruta padre es el Layout. Todas las rutas hijas se renderizarán dentro de su <Outlet /> */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Inicio />} />
          <Route path="scanner" element={<Escaner />} />
          <Route path="settings" element={<Configuracion />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;