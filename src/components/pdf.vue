<template>
  <div>
    <!-- Sección superior -->
    <table>
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
           fecha : {{ bitacoras.fecha }}
          </th>
          <th colspan="3">
           nombre : {{ bitacoras.data[0].IdAprendis.IdFicha.nombre}}
          </th>
        </tr>
      </thead>
    </table>

    <!-- Tabla de datos -->
    <table>
      <thead>
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
import { ref, onBeforeMount, watch } from 'vue';
import { useBitacoraStore } from '../stores/bitacoras.js'; 
import { useFichaStore } from '../stores/fichas.js';

const useFicha = useFichaStore();
 const props = defineProps(['fecha']);
 const fecha = ref(props.fecha);
  
  const useBitacoras = useBitacoraStore();
  const bitacoras = useBitacoras.bitacoras; 



  
  
</script>

  <style scoped>
  table {
    border-collapse: collapse;
    width: 100%;
  }
  
  th, td {
    border: 1px solid black;
    padding: 8px;
    text-align: left;
  }
  
  th {
    background-color: #f2f2f2;
  }
  </style>
  