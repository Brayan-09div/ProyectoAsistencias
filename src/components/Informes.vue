<template>
  <div>
    <div id="en">
      <button id="atras" @click="Salir">
        <span class="material-symbols-outlined">arrow_back</span>
      </button>
      <h1 id="programas">Informes</h1>
      <router-link to="/pdf">
        <q-btn color="green" label="Crear PDF" icon="picture_as_pdf" push class="q-my-md" />
      </router-link>
    </div>

    <!-- Contenedor para seleccionar ficha y fecha -->
    <q-card class="q-pa-md q-gutter-md" flat bordered>

      <!-- Input de selección de ficha -->
      <q-field label="Selecciona una ficha" stack-label>
        <q-select rounded outlined v-model="IdFicha" use-input hide-selected fill-input input-debounce="0"
          :options="options" @filter="filterFichas">
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                Sin resultados
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-field>

      <!-- Input de fecha -->
      <q-field label="Selecciona la fecha" stack-label>
        <q-input v-model="fecha" filled type="date" hint="Native date" />
      </q-field>

      <!-- Botón para listar bitácoras -->
      <q-btn color="primary" label="Listar Fecha" @click="listarBitacorasFichaFecha" />
    </q-card>

    <!-- Tabla de bitácoras -->
    <div style="margin: 0px;">
      <div class="tablafichas">
        <q-table :rows="rows" :columns="columns" row-key="_id">
          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <q-select v-model="props.row.estado" :options="['pendiente', 'asistió', 'faltó', 'excusa']"
                @update:model-value="cambiarEstado(props.row._id, props.row.estado)" />
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onBeforeMount, watch } from 'vue';
import { Dark, useQuasar } from 'quasar';
import { useBitacoraStore } from '../stores/bitacoras.js';
import { useFichaStore } from '../stores/fichas.js';

const useBitacora = useBitacoraStore();
const useFicha = useFichaStore();
const router = useRouter();
const $q = useQuasar();

const confirm = ref(false);
const fixed = ref(false);
const isDark = ref(Dark.isActive);

let fecha = ref("");
let IdFicha = ref("");
let fichas = ref([]);
let options = ref(fichas.value);

watch(isDark, val => Dark.set(val));

onBeforeMount(() => {
  traer();
});

function filterFichas(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    options.value = fichas.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
  });
}

const rows = ref([]);

async function traer() {
  const res = await useBitacora.listarBitacoras();
  let ris = await useFicha.listarFichas();
  fichas.value = ris.data.map(item => ({
    label: item.nombre,
    value: item._id
  }));
  rows.value = res.map(bitacora => {
    const fecha = new Date(bitacora.fecha);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const año = fecha.getFullYear();
    bitacora.fecha = `${dia}/${mes}/${año}`;
    return bitacora;
  });
}

async function listarBitacorasFichaFecha() {
  if (IdFicha.value === '') {
    return;
  }
  const res = await useBitacora.listarBitacoraFechaFicha(IdFicha.value.value, fecha.value);
  rows.value = res.map(bitacora => {
    const fecha = new Date(bitacora.fecha);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const año = fecha.getFullYear();
    bitacora.fecha = `${dia}/${mes}/${año}`;
    return bitacora;
  });
}


function cambiarEstado(id, nuevoEstado) {
  useBitacora.actulizarEstado(id, nuevoEstado)
    .then(() => {
      const bitacora = rows.value.find(row => row._id === id);
      if (bitacora) {
        bitacora.estado = nuevoEstado;
      }
    })
    .catch(error => {
      console.error('Error al cambiar estado:', error);
    });
}

const columns = ref([
  { name: 'fecha', label: 'Fecha', field: 'fecha', align: 'center', sortable: true },
  { name: 'IdAprendiz', align: 'center', label: 'Nombre Aprendiz', field: row => row?.IdAprendis?.nombre, sortable: true },
  { name: 'IdAprendiz', align: 'center', label: 'Teléfono Aprendiz', field: row => row?.IdAprendis?.telefono, sortable: true },
  { name: 'IdAprendiz', align: 'center', label: 'Email Aprendiz', field: row => row?.IdAprendis?.email, sortable: true },
  { name: 'IdAprendiz', align: 'center', label: 'Cc', field: row => row?.IdAprendis?.cc, sortable: true },
  { name: 'nombreFicha', align: 'center', label: 'Nombre Ficha', field: row => row?.IdAprendis?.IdFicha?.nombre, sortable: true },
  { name: 'codigoFicha', align: 'center', label: 'Código Ficha', field: row => row?.IdAprendis?.IdFicha?.codigo, sortable: true },
  { name: 'estado', align: 'center', label: 'Estado', field: 'estado', sortable: true },
]);

function Salir() {
  router.push({ name: 'menu' });
}

</script>

<style scoped>
#en {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 40px;
}

#programas {
  font-size: 35px;
  font-weight: bold;
  text-align: center;
  flex-grow: 1;
}

#atras {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(8, 73, 55);
  color: white;
  margin-left: 25px;
  margin-top: 10px;
}

.q-field {
  width: 100%;
}

.q-btn {
  margin-top: 15px;
}
</style>
