<template>
  <div class="table-container">
    <!-- Sección superior -->
    <table class="info-table">
      <thead>
        <tr>
          <th colspan="8"></th>
          <th colspan="3">
            REGISTRO DE ASISTENCIA Y APROBACIÓN DEL ACTA No-
          </th>
        </tr>
        <tr>
          <th colspan="8"></th>
          <th colspan="3">
           Fecha: {{ bitacoras.fecha }}
          </th>
          <th colspan="3">
           Nombre: {{ bitacoras.data[0].IdAprendis.IdFicha.nombre }}
          </th>
        </tr>
      </thead>
    </table>

    <!-- Tabla de datos -->
    <table class="data-table">
      <thead>
        <tr>
          <th>No.</th>
          <th>Nombres y Apellidos</th>
          <th>No. Documento</th>
          <th>Planta</th>
          <th>Contratista/Empresa</th>
          <th>Otro</th>
          <th>Dependencia</th>
          <th>Correo Electrónico</th>
          <th>Teléfono/Ext. SENA</th>
          <th>Autoriza Grabación</th>
          <th>Firma o Participación Virtual</th>
        </tr>
      </thead>
      <tbody>
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
          <td>{{ bitacora.firmaParticipacionVirtual }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
  
<script setup>
import { ref, onBeforeMount } from 'vue';
import { useBitacoraStore } from '../stores/bitacoras.js'; 
import { useFichaStore } from '../stores/fichas.js';

const useFicha = useFichaStore();
const props = defineProps(['fecha']);
const fecha = ref(props.fecha);
  
const useBitacoras = useBitacoraStore();
const bitacoras = useBitacoras.bitacoras;
</script>

<style scoped>
/* Estilos generales */
.table-container {
  margin: 20px;
  font-family: Arial, sans-serif;
}

table {
  border-collapse: collapse;
  width: 100%;
  margin-top: 20px;
}

/* Estilos para la tabla de información */
.info-table th {
  text-align: left;
  font-size: 16px;
  padding: 10px 15px;
  background-color: #f4f4f4;
}

/* Estilos para la tabla de datos */
.data-table th, .data-table td {
  border: 1px solid #dddddd;
  padding: 10px 15px;
  text-align: left;
}

.data-table th {
  background-color: #f2f2f2;
  font-weight: bold;
  color: #333;
}

.data-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.data-table tr:hover {
  background-color: #f1f1f1;
}

.data-table td {
  vertical-align: middle;
}

th {
  text-align: center;
}

/* Estilos para las celdas */
th, td {
  padding: 12px;
  border: 1px solid #dddddd;
}

th {
  background-color: #f4f4f4;
  font-weight: bold;
  color: #333;
}
</style>
