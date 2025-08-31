// Array de cabañas disponibles con ID, nombre y color HSL
export const cabanasDisponibles = [
  {
    id: 1,
    nombre: "Antía",
    color: "#a44ecc" // Azul hex
  },
  {
    id: 2,
    nombre: "Lilliam",
    color: "#fed852" // Púrpura hex
  },
  {
    id: 3,
    nombre: "Luna",
    color: "#5ac1f6" // Dorado hex
  },
  {
    id: 4,
    nombre: "Roble Escondido",
    color: "#e54f2c" // Verde bosque hex
  },
  {
    id: 5,
    nombre: "Glamping",
    color: "#f7fac1" // Naranja hex
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
