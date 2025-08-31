// Array de cabañas disponibles con ID, nombre y color HSL
export const cabanasDisponibles = [
  {
    id: 1,
    nombre: "Antía",
    color: "hsl(210, 70%, 50%)" // Azul
  },
  {
    id: 2,
    nombre: "Lilliam",
    color: "hsl(280, 60%, 60%)" // Púrpura
  },
  {
    id: 3,
    nombre: "Luna",
    color: "hsl(45, 80%, 60%)" // Dorado
  },
  {
    id: 4,
    nombre: "Roble Escondido",
    color: "hsl(120, 50%, 45%)" // Verde bosque
  },
  {
    id: 5,
    nombre: "Glamping",
    color: "hsl(15, 75%, 55%)" // Naranja
  }
];

// Función para obtener una cabaña por ID
export const getCabañaById = (id) => {
  return cabanasDisponibles.find(cabaña => cabaña.id === id);
};

// Función para obtener una cabaña por nombre
export const getCabañaByNombre = (nombre) => {
  return cabanasDisponibles.find(cabaña => cabaña.nombre === nombre);
};

// Función para obtener todos los colores de las cabañas
export const getCabañasColores = () => {
  return cabanasDisponibles.map(cabaña => ({
    id: cabaña.id,
    nombre: cabaña.nombre,
    color: cabaña.color
  }));
};

// Función para obtener solo los nombres de las cabañas
export const getCabañasNombres = () => {
  return cabanasDisponibles.map(cabaña => cabaña.nombre);
};

// Función para obtener solo los IDs de las cabañas
export const getCabañasIds = () => {
  return cabanasDisponibles.map(cabaña => cabaña.id);
};
