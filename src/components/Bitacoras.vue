<template>
  <div>
    <div id="en">
      <button id="atras" @click="Salir">
        <span class="material-symbols-outlined">arrow_back</span>
      </button>
      <h1 id="programas">Bitacoras</h1>

    </div>
    <q-input v-model="fechaInicio" filled type="date" hint="Native date" />
      <q-input v-model="fechaFin" filled type="date" hint="Native date" />
      <button @click="listarFechas()">listar Fechas</button>

    <div>
 
    </div>
    <div style="margin: 0px;">
      <div class="tablafichas">
        <q-btn id="agregarficha" @click="fixed = true" color="primary">
          <span class="material-symbols-outlined">add_circle</span>Crear
        </q-btn>
        <q-table :rows="rows" :columns="columns" row-key="_id">
          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <q-select
                v-model="props.row.estado"
                :options="['pendiente', 'asistió', 'faltó', 'excusa']"
                @update:model-value="cambiarEstado(props.row._id, props.row.estado)"
              />
            </q-td>
          </template>
        </q-table>

        <q-dialog
          v-model="fixed"
          :backdrop-filter="'blur(4px) saturate(150%)'"
          transition-show="rotate"
          transition-hide="rotate"
          persistent
        >
          <q-card>
            <q-card-section>
              <div class="text-h6">Crear Bitácora</div>
            </q-card-section>
            <q-separator />
            <q-card-section style="max-height: 50vh" class="scroll">
              <q-input filled v-model="nom" label="Nombre Del Aprendiz" :dense="dense" />
              <q-input filled v-model="cc" label="CC" :dense="dense" />
              <q-input filled v-model="IdFicha" label="Id De La Ficha" :dense="dense" />
              <q-input filled v-model="email" label="Email del Aprendiz" :dense="dense" />
              <q-input filled v-model="telefono" label="Teléfono Del Aprendiz" :dense="dense" />
            </q-card-section>
            <q-separator />
            <q-card-actions align="right">
              <q-btn flat label="Cerrar" color="primary" v-close-popup @click="cerrar" />
              <q-btn flat label="Guardar" color="primary" @click="crearBitacora" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog
          v-model="confirm"
          persistent
          :backdrop-filter="'blur(4px) saturate(150%)'"
          transition-show="rotate"
          transition-hide="rotate"
        >
          <q-card>
            <q-card-section class="row items-center">
              <span class="q-ml-sm">Seguro Quieres Eliminar La Ficha</span>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Cancelar" color="primary" v-close-popup />
              <q-btn @click="eliminarAprendiz" flat label="Aceptar" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-toggle v-model="isDark" label="Modo Oscuro" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onBeforeMount, watch } from 'vue';
import { Dark, useQuasar } from 'quasar';
import { useBitacoraStore } from '../stores/bitacoras.js';
import { useAprendizStore } from "../stores/aprendiz.js";
import { useFichaStore } from '../stores/fichas.js';

const useBitacora = useBitacoraStore();
const useAprendiz = useAprendizStore();
const useFicha = useFichaStore();
const router = useRouter();
const $q = useQuasar();

const confirm = ref(false);
const fixed = ref(false);
const isDark = ref(Dark.isActive);

let fecha = ref("");

let fechaInicio = ref("");
let fechaFin = ref("");

let IdFicha = ref("");

let idAprendis = ref("");

let fichas = ref([]);
let options = ref(fichas.value);

let aprendiz = ref([]);
let optionsAprendiz = ref(aprendiz.value);



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

function filterAprendiz(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    optionsAprendiz.value = aprendiz.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
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

  let ros = await useAprendiz.listarAprendiz();
  aprendiz.value = ros.data.map(item => ({
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

async function listarFechas() {
  try {
    const res = await useBitacora.listarBitacorasFecha(fechaInicio.value, fechaFin.value);
    
    if (!res?.response?.data?.errors) {
      rows.value = res.map(bitacora => {
        const fecha = new Date(bitacora.fecha);
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const año = fecha.getFullYear();
        bitacora.fecha = `${dia}/${mes}/${año}`;
        return bitacora;
      });
      fixed.value = false;
    }
  } catch (error) {
    console.error('Error al listar bitácoras por fechas:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al listar bitácoras por fechas.'
    });
  }
}

async function listarFecha() {
  try {
    const res = await useBitacora.listarBitacorasFechaUnica(fecha.value);
    
    if (!res?.response?.data?.errors) {
      rows.value = res.map(bitacora => {
        const fecha = new Date(bitacora.fecha);
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const año = fecha.getFullYear();
        bitacora.fecha = `${dia}/${mes}/${año}`;
        return bitacora;
      });
      fixed.value = false;
    }
  } catch (error) {
    console.error('Error al listar bitácoras por fecha:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al listar bitácoras por fecha.'
    });
  }
}

async function listarBitacorasFicha() {
  try {
    const res = await useBitacora.listarBitacorasFicha(IdFicha.value.value);
  
    if (!res?.response?.data?.errors) {
      rows.value = res.map(bitacora => {
        const fecha = new Date(bitacora.fecha);
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const año = fecha.getFullYear();
        bitacora.fecha = `${dia}/${mes}/${año}`;
        return bitacora;
      });
      fixed.value = false;
    }
  } catch (error) {
    console.error('Error al listar bitácoras por ficha:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al listar bitácoras por ficha.'
    });
  }
}

async function listarBitacorasAprendiz() {
  try {
    console.log(idAprendis.value);
    
    const res = await useBitacora.listarBitacorasAprendiz(idAprendis.value.value);

    
    if (!res?.response?.data?.errors) {
      rows.value = res.map(bitacora => {
        const fecha = new Date(bitacora.fecha);
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const año = fecha.getFullYear();
        bitacora.fecha = `${dia}/${mes}/${año}`;
        return bitacora;
      });
      fixed.value = false;
    }
  } catch (error) {
    console.error('Error al listar bitácoras por aprendiz:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al listar bitácoras por aprendiz.'
    });
  }
}

async function crearBitacora() {
  try {
    const res = await useBitacora.crearBitacora({
      fecha: new Date().toISOString(),
      nombre: nom.value,
      cc: cc.value,
      ficha: IdFicha.value,
      email: email.value,
      telefono: telefono.value,
      estado: 'pendiente'
    });
    
    if (!res?.response?.data?.errors) {
      $q.notify({
        type: 'positive',
        message: 'Bitácora creada correctamente.'
      });
      fixed.value = false;
      traer();
    }
  } catch (error) {
    console.error('Error al crear la bitácora:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al crear la bitácora.'
    });
  }
}

function cambiarEstado(id, nuevoEstado) {
  useBitacora.actulizarEstado(id, nuevoEstado)
    .then(() => {
      $q.notify({
        type: 'positive',
        message: 'Estado actualizado correctamente.'
      });
      traer();
    })
    .catch(error => {
      console.error('Error al cambiar estado:', error);
      $q.notify({
        type: 'negative',
        message: 'Error al cambiar estado.'
      });
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

function cerrar() {
  fixed.value = false;
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

hr {
  width: 80%;
  border: 2px solid #2F7D32;
  margin: -20px auto 0;
}

.tablafichas {
  width: 80%;
  margin: 0 auto;
}

#agregarficha {
  margin: 30px auto 20px;
}
</style>