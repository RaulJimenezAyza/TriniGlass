import { useMemo, useState, useEffect } from "react";
import { Search, Filter, ArrowUpDown, MoreVertical, Plus, MapPin, Eye, X, Edit, Trash2 } from "lucide-react";

// 1. Definimos la interfaz basada en los datos de tu diseño
interface Palet {
  id: string;
  type: string;
  dimensions: string;
  client: string;
  date: string;
  location: string;
  status: string;
}

export default function Stock() {
  // --- ESTADOS DE DATOS (Para conectar al BaaS) ---
  const [inventory, setInventory] = useState<Palet[]>([]);
  const [loading, setLoading] = useState(true);

  // --- ESTADOS DE BÚSQUEDA Y FILTROS ---
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    client: "", type: "", widthMin: "", widthMax: "", heightMin: "", heightMax: "",
    thickness: "", status: "", dateFrom: "", dateTo: "", zone: "",
  });

  // --- ESTADOS DEL PANEL LATERAL ---
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedPalet, setSelectedPalet] = useState<Palet | null>(null);

  // 2. SIMULACIÓN DE CONSULTA AL BaaS (Reemplazar con tu fetch real)
  useEffect(() => {
    const fetchStock = async () => {
      setLoading(true);
      try {
        // TODO: Tu consulta real a Supabase/Firebase aquí
        setTimeout(() => {
          const MOCK_INVENTORY = Array.from({ length: 25 }).map((_, i) => ({
            id: `PAL-${8000 + i}`,
            type: i % 3 === 0 ? "Vidrio Templado 8mm" : i % 2 === 0 ? "Vidrio Laminado 6+6" : "Doble Acristalamiento",
            dimensions: i % 2 === 0 ? "2000x1500x8" : "1800x1200x6",
            client: i % 4 === 0 ? "Construcciones S.A." : "Reformas Integrales",
            date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleDateString(),
            location: `Zona ${["A", "B", "C"][i % 3]} - Bloque B${100 + i}`,
            status: i % 6 === 0 ? "Reservado" : i % 5 === 0 ? "Pendiente" : i % 4 === 0 ? "Listo para carga" : "Almacenado",
          }));
          setInventory(MOCK_INVENTORY);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error cargando inventario:", error);
        setLoading(false);
      }
    };
    fetchStock();
  }, []);

  // --- LÓGICA DE FILTROS (Del diseño de Figma) ---
  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      client: "", type: "", widthMin: "", widthMax: "", heightMin: "", heightMax: "",
      thickness: "", status: "", dateFrom: "", dateTo: "", zone: "",
    });
    setSearchTerm("");
  };

  const parseDimensions = (dimensions: string) => {
    const [width, height, thickness] = dimensions.split("x").map(Number);
    return { width: width || 0, height: height || 0, thickness: thickness || 0 };
  };

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const search = searchTerm.toLowerCase().trim();
      const matchesSearch = item.id.toLowerCase().includes(search) || item.client.toLowerCase().includes(search) || item.type.toLowerCase().includes(search);
      const matchesClient = item.client.toLowerCase().includes(filters.client.toLowerCase());
      const matchesType = item.type.toLowerCase().includes(filters.type.toLowerCase());
      const matchesStatus = filters.status === "" || item.status === filters.status;
      const matchesZone = item.location.toLowerCase().includes(filters.zone.toLowerCase());
      
      const { width, height, thickness } = parseDimensions(item.dimensions);
      const matchesWidthMin = filters.widthMin === "" || width >= Number(filters.widthMin);
      const matchesWidthMax = filters.widthMax === "" || width <= Number(filters.widthMax);
      const matchesHeightMin = filters.heightMin === "" || height >= Number(filters.heightMin);
      const matchesHeightMax = filters.heightMax === "" || height <= Number(filters.heightMax);
      const matchesThickness = filters.thickness === "" || thickness === Number(filters.thickness);

      return matchesSearch && matchesClient && matchesType && matchesStatus && matchesZone && matchesWidthMin && matchesWidthMax && matchesHeightMin && matchesHeightMax && matchesThickness;
    });
  }, [searchTerm, filters, inventory]);

  // --- LÓGICA DEL PANEL LATERAL ---
  const handleOpenPanel = (palet: Palet) => {
    setSelectedPalet(palet);
    setIsPanelOpen(true);
  };

  return (
    <div className="relative h-full flex flex-col space-y-6 animate-in fade-in duration-300">
      {/* --- HEADER (De Figma) --- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Inventario de Vidrio</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Gestión de palets y bloques almacenados.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
          <Plus size={18} /> Nuevo Palet
        </button>
      </div>

      {/* --- CONTENEDOR PRINCIPAL --- */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex-1 flex flex-col">
        
        {/* BARRA DE BÚSQUEDA */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por ID, cliente o tipo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 placeholder-slate-400"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 rounded-lg font-medium transition-colors"
          >
            <Filter size={18} /> {showFilters ? "Ocultar filtros" : "Filtros"}
          </button>
        </div>

        {/* PANEL DE FILTROS AVANZADOS (Simplificado visualmente para no saturar el código aquí, pero funcional) */}
        {showFilters && (
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/30">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {/* Inputs de filtros (Resumidos por espacio, pero es tu código de Figma) */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Cliente</label>
                <input type="text" value={filters.client} onChange={(e) => updateFilter("client", e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Estado</label>
                <select value={filters.status} onChange={(e) => updateFilter("status", e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg">
                  <option value="">Todos</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Almacenado">Almacenado</option>
                  <option value="Reservado">Reservado</option>
                  <option value="Listo para carga">Listo para carga</option>
                </select>
              </div>
               <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Zona</label>
                <input type="text" placeholder="Ej. Zona A" value={filters.zone} onChange={(e) => updateFilter("zone", e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={clearFilters} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg">Limpiar filtros</button>
            </div>
          </div>
        )}

        {/* TABLA PRINCIPAL */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 font-medium text-slate-500"><div className="flex items-center gap-1">ID Palet <ArrowUpDown size={14} /></div></th>
                <th className="p-4 font-medium text-slate-500">Tipo / Dimensiones</th>
                <th className="p-4 font-medium text-slate-500">Cliente</th>
                <th className="p-4 font-medium text-slate-500">Ubicación</th>
                <th className="p-4 font-medium text-slate-500">Estado</th>
                <th className="p-4 font-medium text-slate-500 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-sm">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">Cargando datos del BaaS...</td></tr>
              ) : filteredInventory.length > 0 ? (
                filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="p-4 font-medium text-slate-900 dark:text-white">{item.id}</td>
                    <td className="p-4">
                      <div className="text-slate-900 dark:text-slate-200">{item.type}</div>
                      <div className="text-xs text-slate-500">{item.dimensions} mm</div>
                    </td>
                    <td className="p-4 text-slate-700">{item.client}</td>
                    <td className="p-4 text-slate-700">{item.location}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === "Almacenado" ? "bg-emerald-100 text-emerald-700" :
                        item.status === "Pendiente" ? "bg-amber-100 text-amber-700" :
                        item.status === "Reservado" ? "bg-violet-100 text-violet-700" : "bg-blue-100 text-blue-700"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                         {/* Botón para abrir el panel lateral */}
                        <button 
                          onClick={() => handleOpenPanel(item)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Eliminar">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <Filter size={28} className="text-slate-300" />
                      <p className="font-medium">No se han encontrado resultados</p>
                      <button onClick={clearFilters} className="mt-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg">Limpiar filtros</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER TABLA */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
          <span>Mostrando {filteredInventory.length} resultados</span>
        </div>
      </div>

      {/* --- PANEL LATERAL (DRAWER) --- */}
      {isPanelOpen && <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setIsPanelOpen(false)} />}
      
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isPanelOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h2 className="text-xl font-bold text-slate-800">Editar {selectedPalet?.id}</h2>
            <button onClick={() => setIsPanelOpen(false)} className="p-2 text-slate-500 hover:bg-slate-200 rounded-full">
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6 flex-1 overflow-y-auto">
            {selectedPalet && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cliente</label>
                  <input type="text" defaultValue={selectedPalet.client} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Vidrio</label>
                  <input type="text" defaultValue={selectedPalet.type} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Dimensiones</label>
                  <input type="text" defaultValue={selectedPalet.dimensions} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ubicación</label>
                  <input type="text" defaultValue={selectedPalet.location} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
                  <select defaultValue={selectedPalet.status} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="Almacenado">Almacenado</option>
                    <option value="Reservado">Reservado</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Listo para carga">Listo para carga</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-slate-200 flex justify-end gap-3 bg-slate-50">
            <button onClick={() => setIsPanelOpen(false)} className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Cancelar</button>
            <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">Guardar Cambios</button>
          </div>
        </div>
      </div>
      
    </div>
  );
}