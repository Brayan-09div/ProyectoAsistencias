<template>
  <div class="table-container">
    <!-- Sección superior -->
    <div class="header-section">
      <table class="header-table">
        <thead>
          <tr>
            <th class="logo-cell">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWoms2HEy0ELPrZGRr001PN2sh5sq9dU_BWQ&s" alt="Logo" class="logo"/>
            </th>
            <th style="font-weight: bold;" colspan="10" class="header-text">
              REGISTRO DE ASISTENCIA Y APROBACIÓN DEL ACTA No-
            </th>
          </tr>
          <tr>
            <th style="font-weight: bold;"  colspan="5">fecha : {{ bitacoras.fecha }}</th>
            <th style="font-weight: bold;"  colspan="7">nombre : {{ bitacoras.data[0].IdAprendis.IdFicha.nombre }}</th>
          </tr>
        </thead>
      </table>
    </div>

    <!-- Tabla de datos -->
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th style="text-align: center;">No.</th>
            <th style="text-align: center;">NOMBRES Y APELLIDOS</th>
            <th style="text-align: center;">No. DOCUMENTO</th>
            <th style="text-align: center;">PLANTA</th>
            <th style="text-align: center;">CONTRATISTA/EMPRESA</th>
            <th style="text-align: center;">OTRO</th>
            <th style="text-align: center;">DEPENDENCIA</th>
            <th style="text-align: center;">CORREO ELECTRÓNICO</th>
            <th style="text-align: center;">TELEFONO/EXT.SENA</th>
            <th style="text-align: center;">AUTORIZA GRABACIÓN</th>
            <th style="text-align: center;">FIRMA O PARTICIPACIÓN VIRTUAL</th>
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
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useBitacoraStore } from '../stores/bitacoras.js'; 
import { useFichaStore } from '../stores/fichas.js';

const useFicha = useFichaStore();
const props = defineProps(['fecha']);
const fecha = ref(props.fecha);

const useBitacoras = useBitacoraStore();
const bitacoras = useBitacoras.bitacoras; 
</script>

<style scoped>
.table-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  background-color: #fff;
}

.header-section {
  margin-bottom: 20px;
}

.header-table {
  width: 100%;
  border-collapse: collapse;
}

.header-table th {
  background-color: #e0f2f1;
  padding: 10px;
  text-align: left;
  font-weight: normal;
  vertical-align: middle;
}

.logo-cell {
  width: 10%;
  text-align: left;
  padding: 5px;
}

.logo {
  max-width: 100px; /* Ajusta el tamaño del logo según sea necesario */
  height: auto;
}

.header-text {
  text-align: center;
  font-size: 14px;
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
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.data-table th {
  background-color: #2F7D32;
  color: #fff;
  font-weight: bold;
}

.data-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.data-table tr:hover {
  background-color: #f1f1f1;
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

  .header-table th {
    font-size: 12px;
    padding: 5px;
  }
}

@media (max-width: 480px) {
  .data-table th, .data-table td {
    font-size: 10px;
    padding: 4px;
  }

  .header-table th {
    font-size: 10px;
    padding: 4px;
  }

  .table-container {
    padding: 10px;
  }
}
</style>

