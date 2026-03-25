const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// Conexión a Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// --------------------
// Helpers
// --------------------
async function clearCollection(nombre) {
  const snapshot = await db.collection(nombre).get();
  if (snapshot.empty) {
    console.log(`Colección ${nombre} vacía o no existente`);
    return;
  }

  const batch = db.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
  console.log(`Colección ${nombre} limpiada`);
}

// --------------------
// Datos mock
// --------------------
function generarUsuarios() {
  const nombres = [
    "Rubén García",
    "Raúl Jiménez",
    "Mauri López",
    "Albert Pérez",
    "Arnau Torres",
    "Suleiman Haddad",
    "Carlos Ruiz",
    "Ana Martín",
    "Lucía Gómez",
    "David Sánchez",
    "Sergio Navarro",
    "Elena Romero",
    "Javier Ortega",
    "Marta Vidal",
    "Pablo León",
    "Claudia Ferrer",
    "Hugo Molina",
    "Nuria Castro",
    "Iván Gil",
    "Sara Peña",
  ];

  return nombres.map((nombre, i) => ({
    nombre,
    email: `usuario${i + 1}@triniglass.com`,
    rol: i < 4 ? "encargado" : "operario",
    activo: true,
    creadoEn: new Date().toISOString(),
  }));
}

function generarCamiones() {
  return [
    {
      matricula: "1234-ABC",
      capacidadPesoKg: 24000,
      capacidadVolumenM3: 60,
      estado: "disponible",
      rutaAsignada: "Barcelona - Sabadell",
    },
    {
      matricula: "5678-DEF",
      capacidadPesoKg: 22000,
      capacidadVolumenM3: 55,
      estado: "en ruta",
      rutaAsignada: "Granollers - Terrassa",
    },
    {
      matricula: "9012-GHI",
      capacidadPesoKg: 26000,
      capacidadVolumenM3: 65,
      estado: "mantenimiento",
      rutaAsignada: null,
    },
  ];
}

function generarZonasMapa() {
  return [
    {
      codigo: "EXPEDICIONES",
      nombre: "Expediciones",
      tipo: "expedicion",
      capacidadMaxima: 2,
      ocupacionActual: 2,
      posiciones: ["H", "Mamparista"],
      descripcion: "Zona de salida y expedición de material",
    },
    {
      codigo: "ZONA_1",
      nombre: "Zona 1",
      tipo: "almacenamiento",
      capacidadMaxima: 1,
      ocupacionActual: 1,
      posiciones: ["F"],
      descripcion: "Zona de almacenamiento intermedio",
    },
    {
      codigo: "CORTE",
      nombre: "Corte",
      tipo: "produccion",
      capacidadMaxima: 1,
      ocupacionActual: 1,
      posiciones: ["E"],
      descripcion: "Zona próxima al área de corte",
    },
    {
      codigo: "CMS",
      nombre: "CMS",
      tipo: "produccion",
      capacidadMaxima: 1,
      ocupacionActual: 1,
      posiciones: ["D"],
      descripcion: "Zona próxima a centro de mecanizado",
    },
    {
      codigo: "ZONA_2",
      nombre: "Zona 2",
      tipo: "almacenamiento",
      capacidadMaxima: 2,
      ocupacionActual: 2,
      posiciones: ["C", "B"],
      descripcion: "Zona principal de almacenamiento",
    },
    {
      codigo: "ZONA_3",
      nombre: "Zona 3",
      tipo: "almacenamiento",
      capacidadMaxima: 2,
      ocupacionActual: 1,
      posiciones: ["A", "LIBRE_1"],
      descripcion: "Zona lateral de almacenamiento",
    },
  ];
}

// --------------------
// Insertar datos
// --------------------
async function seedCollection(nombre, data, useCustomId = false, idField = "codigo") {
  const batch = db.batch();

  data.forEach((item) => {
    const ref = useCustomId
      ? db.collection(nombre).doc(String(item[idField]))
      : db.collection(nombre).doc();

    batch.set(ref, item);
  });

  await batch.commit();
  console.log(`✔ Insertados ${data.length} registros en ${nombre}`);
}

// --------------------
// Run
// --------------------
async function run() {
  try {
    await clearCollection("usuarios");
    await clearCollection("zonas");
    await clearCollection("camiones");

    await seedCollection("usuarios", generarUsuarios());
    await seedCollection("zonas", generarZonasMapa(), true, "codigo");
    await seedCollection("camiones", generarCamiones(), true, "matricula");

    console.log("🔥 Datos cargados correctamente en Firestore");
    process.exit(0);
  } catch (error) {
    console.error("Error al poblar Firestore:", error);
    process.exit(1);
  }
}

run();