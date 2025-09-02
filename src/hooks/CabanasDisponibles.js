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

/**
 * ========================================
 * CONFIGURACIÓN DE CAPACIDAD POR CABAÑA
 * ========================================
 * Define la capacidad máxima de personas permitida para cada cabaña
 */
const capacidadPorCabaña = {
  1: 5,  // Antía - máximo 5 personas
  2: 5,  // Lilliam - máximo 5 personas
  3: 2,  // Luna - máximo 2 personas
  4: 2,  // Roble Escondido - máximo 2 personas
  5: 2,  // Glamping - máximo 2 personas
  6: 8   // Colima - máximo 8 personas
};

/**
 * ========================================
 * FUNCIÓN PARA OBTENER CAPACIDAD MÁXIMA
 * ========================================
 * Obtiene la capacidad máxima de personas para una cabaña específica
 * 
 * @param {number} cabañaId - ID de la cabaña
 * @returns {number} Capacidad máxima de personas
 */
export const getCapacidadMaxima = (cabañaId) => {
  return capacidadPorCabaña[cabañaId] || 1; // Por defecto 1 si no se encuentra
};