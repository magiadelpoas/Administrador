// Array de cabañas disponibles con ID, nombre y color HSL
export const cabanasDisponibles = [
  {
    id: 1,
    nombre: "Antía",
    color: "#E03045" // Azul hex
  },
  {
    id: 2,
    nombre: "Lilliam",
    color: "#E0BD30" // Púrpura hex
  },
  {
    id: 3,
    nombre: "Luna",
    color: "#3DC2EC" // Dorado hex
  },
  {
    id: 4,
    nombre: "Roble Escondido",
    color: "#2ECC71" // Verde bosque hex
  },
  {
    id: 5,
    nombre: "Glamping",
    color: "#2471a3" // Naranja hex
  },
  {
    id: 6,
    nombre: "Colima",
    color: "#9546bd" // Naranja hex
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
