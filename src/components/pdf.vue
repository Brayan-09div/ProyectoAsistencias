<template>
  <div class="table-container">
    <!-- Tabla completa con encabezado -->
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <!-- Primera fila con el título -->
          <tr>
            <th colspan="11" class="header-title">
              REGISTRO DE ASISTENCIA Y APROBACIÓN DEL ACTA No-
            </th>
          </tr>
          <!-- Segunda fila con detalles de la fecha y nombre -->
          <tr>
            <th colspan="5" class="header-details">Fecha: {{ bitacoras.fecha }}</th>
            <th colspan="6" class="header-details">Nombre: {{ bitacoras.data[0]?.IdAprendis?.IdFicha?.nombre || 'Nombre' }}</th>
          </tr>
          <!-- Encabezados de las columnas -->
          <tr>
            <th>No.</th>
            <th>NOMBRES Y APELLIDOS</th>
            <th>No. DOCUMENTO</th>
            <th>PLANTA</th>
            <th>CONTRATISTA/EMPRESA</th>
            <th>OTRO</th>
            <th>DEPENDENCIA</th>
            <th>CORREO ELECTRÓNICO</th>
            <th>TELEFONO/EXT.SENA</th>
            <th>AUTORIZA GRABACIÓN</th>
            <th>FIRMA O PARTICIPACIÓN VIRTUAL</th>
          </tr>
        </thead>
        <tbody>
          <!-- Filas dinámicas según la información disponible -->
          <tr v-for="(bitacora, index) in bitacoras.data" :key="bitacora._id">
            <td>{{ index + 1 }}</td>
            <td>{{ bitacora.IdAprendis.nombre }}</td>
            <td>{{ bitacora.IdAprendis.cc }}</td>
            <td>{{ bitacora.planta }}</td>
            <td>{{ bitacora.empresa }}</td>
            <td>{{ bitacora.otro }}</td>
            <td>{{ bitacora.dependencia }}</td>
            <td>{{ bitacora.IdAprendis.email }}</td>
            <td>{{ bitacora.IdAprendis.telefono }}</td>
            <td>{{ bitacora.autorizaGrabacion }}</td>
            <td class="firma-cell">
              <div v-if="bitacora.IdAprendis.firmaVirtual" class="firma-container">
                <img 
                  :src="bitacora.IdAprendis.firmaVirtual" 
                  alt="Firma Virtual" 
                  class="firma-virtual"
                  @error="handleImageError"
                />
              </div>
              <span v-else class="no-firma">No disponible</span>
            </td>
          </tr>
          <!-- Filas vacías hasta llegar a 27 -->
          <tr v-for="n in (27 - bitacoras.data.length)" :key="`empty-${n}`">
            <td>{{ bitacoras.data.length + n }}</td>
            <td colspan="10"></td> <!-- Columnas vacías -->
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useBitacoraStore } from '../stores/bitacoras.js';
import { useFichaStore } from '../stores/fichas.js';
import { useAprendizStore } from '../stores/aprendiz.js';

const useFicha = useFichaStore();
const useBitacoras = useBitacoraStore();
const useAprendiz = useAprendizStore();

const props = defineProps(['fecha']);
const fecha = ref(props.fecha);

const bitacoras = ref(useBitacoras.bitacoras);

onMounted(async () => {
  // Actualizar las firmas virtuales
  for (const bitacora of bitacoras.value.data) {
    try {
      const response = await useAprendiz.updatecoul(bitacora.IdAprendis._id);
      if (response.data && response.data.firmaVirtual) {
        bitacora.IdAprendis.firmaVirtual = response.data.firmaVirtual;
      }
    } catch (error) {
      console.error('Error al obtener la firma virtual:', error);
    }
  }
});

const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/100x50?text=Sin+Firma'; // URL de imagen por defecto
};
</script>

<style scoped>
.table-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  background-color: #fff;
}

.table-wrapper {
  width: 100%;
}

.data-table {
  border-collapse: collapse;
  width: 100%;
  font-family: Arial, sans-serif;
}

.data-table th, .data-table td {
  border: 1px solid #000000;
  padding: 8px;
  text-align: center; /* Centrar el texto */
}

.header-title {
  background-color: #e0f2f1;
  padding: 10px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}

.header-details {
  font-weight: bold;
  font-size: 14px;
  text-align: left;
}

.data-table th {
  background-color: #ffffff;
  color: #000000;
  font-weight: bold;
}

.data-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.data-table tr:hover {
  background-color: #f1f1f1;
}

.firma-cell {
  width: 120px; /* Establece un ancho fijo para la columna de firma */
}

.firma-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px; /* Altura fija para la firma */
}

.firma-virtual {
  max-width: 100px; /* Ancho máximo para las firmas */
  max-height: 50px; /* Altura máxima para las firmas */
  object-fit: contain; /* Mantener la proporción de la imagen */
  border: 1px solid #ccc; /* Borde opcional para mejor visualización */
  border-radius: 4px; /* Bordes redondeados */
}

.no-firma {
  font-size: 12px;
  color: #777;
}

@media (max-width: 1200px) {
  .data-table th, .data-table td {
    font-size: 14px;
    padding: 6px;
  }
}

@media (max-width: 768px) {
  .data-table {
    font-size: 12px;
  }

  .data-table th, .data-table td {
    padding: 5px;
  }

  .header-details {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .data-table th, .data-table td {
    font-size: 10px;
    padding: 4px;
  }

  .header-details {
    font-size: 10px;
  }

  .table-container {
    padding: 10px;
  }
  
  .firma-cell {
    width: 80px; /* Ajustar el ancho en pantallas pequeñas */
  }

  .firma-virtual {
    max-width: 60px; /* Reducir el tamaño de la firma en pantallas pequeñas */
    max-height: 30px;
  }
}
</style>
