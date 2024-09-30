<template>
  <div>
    <div id="en">
      <button id="atras" @click="Salir()">
        <span class="material-symbols-outlined">arrow_back</span>
      </button>
      <h1 id="programas">Programas</h1>
    </div>
    <hr>
    <div style="margin: 0px;">
      <div class="tablafichas">
        <div v-if="loadingTable" class="spinner-container">
          <q-spinner color="green" size="50px" />
        </div>
        <div v-else>
          <q-btn
            id="agregarficha"
            @click="fixed = true"
            color="primary"
            :loading="loadingAgregar"
          >
            <q-spinner v-if="loadingAgregar" color="white" size="20px" />
            <span v-else class="material-symbols-outlined">add_circle</span>Crear
          </q-btn>

        <q-table :rows="rows" :columns="columns" row-key="codigo">
          <template class="tabla" v-slot:body-cell-opciones="props">
            <q-td :props="props">
              <q-btn
                id="edit"
                @click="traerDatos(props.row)"
                color="primary"
                :loading="loadingEdit"
              >
                <q-spinner v-if="loadingEdit" color="white" size="20px" />
                <span v-else class="material-symbols-outlined">edit</span>
              </q-btn>
            </q-td>
            
          </template>
          
          <template v-slot:header-cell="props">
            <q-th :props="props" :style="{ fontWeight: 'bold', color: 'black', fontSize: '16px' }">
              {{ props.col.label }}
            </q-th>
          </template>
          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <q-btn
                @click="activar(props.row._id, props.row)"
                :color="props.row.estado == 1 ? 'green' : 'red'"
                :loading="loadingStates[props.row._id]"
              >
                <q-spinner v-if="loadingStates[props.row._id]" color="white" size="20px" />
                {{ props.row.estado == 1 ? 'Activo' : 'Inactivo' }}
              </q-btn>
            </q-td>
          </template>
        </q-table>
        <!-- Modal principal -->
        <q-dialog v-model="fixed" :backdrop-filter="'blur(4px) saturate(150%)'" transition-show="rotate" transition-hide="rotate" persistent>
          <q-card class="modal-card">
            <q-card-section class="modal-header">
              <div class="text-h6">{{ b ? "Editar Ficha" : "Guardar Ficha" }}</div>
            </q-card-section>

            <q-separator />

            <q-card-section style="max-height: 50vh" class="scroll modal-body">
              <q-input filled v-model="num" label="Nombre De La Ficha" :dense="dense" :error="numError" error-message="El nombre de la ficha es requerido" />
              <q-input filled v-model="cod" label="Codigo De La Ficha" :dense="dense" :error="codError" error-message="El código de la ficha es requerido" />
            </q-card-section>

            <q-card-actions align="center" class="modal-footer">
              <q-btn
                id="btncerrar"
                flat
                label="Cerrar"
                color="primary"
                v-close-popup
                @click="cerar()"
              />
              <q-btn
                id="btnguardar"
                flat
                label="Guardar"
                color="primary"
                @click="crearFicha()"
                :loading="loadingGuardar"
              >
                <q-spinner v-if="loadingGuardar" color="white" size="20px" />
              </q-btn>
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onBeforeMount, watch } from 'vue';
import { Dark } from 'quasar';
import { useQuasar } from 'quasar';
import { useFichaStore } from '../stores/fichas.js';

const useFicha = useFichaStore();
const $q = useQuasar();
const router = useRouter();
let fixed = ref(false);
let num = ref("");
let cod = ref("");
let b = ref(false);
let id = ref("");

const numError = ref(false);
const codError = ref(false);

const isDark = ref(Dark.isActive);
watch(isDark, (val) => {
  Dark.set(val);
});

const rows = ref([]);
const loadingAgregar = ref(false);
const loadingEdit = ref(false);
const loadingGuardar = ref(false);
const loadingStates = ref({});

const loadingTable = ref(true);  // Nueva variable de estado para la tabla

onBeforeMount(() => {
  traer();
});

async function traer() {
  if (!Object.values(loadingStates.value).includes(true)) {
    loadingTable.value = true;  // Mostrar spinner solo si no hay otros botones en carga
  }

  try {
    let res = await useFicha.listarFichas();
    rows.value = res.data;
  } catch (error) {
    console.error("Error al cargar los datos:", error);
  } finally {
    loadingTable.value = false;  // Ocultar spinner cuando los datos se hayan cargado
  }
}

function traerDatos(datos) {
  id.value = datos._id;
  fixed.value = true;
  b.value = true;
  num.value = datos.nombre;
  cod.value = datos.codigo;
  numError.value = false;
  codError.value = false;
}

function cerar() {
  b.value = false;
  num.value = "";
  cod.value = "";
  numError.value = false;
  codError.value = false;
}

async function activar(id, row) {
  loadingStates.value[id] = true;  // Activar el spinner solo para el botón correspondiente
  try {
    await useFicha.activarDesactivarFichas(id);  // Cambiar el estado de la ficha
    await traer();  // Actualizar la tabla
  } catch (error) {
    console.error("Error al cambiar el estado:", error);
  } finally {
    loadingStates.value[id] = false;  // Desactivar el spinner solo para el botón correspondiente
  }
}

async function crearFicha() {

  num.value = num.value.trim();
  cod.value = cod.value.trim();

  numError.value = !num.value;
  codError.value = !cod.value;

  if (numError.value || codError.value) {
    return;
  }

  loadingGuardar.value = true;

  if (b.value) {
    const res = await editarFicha(id.value);
    if (res?.response?.data?.errors) {
      fixed.value = true;
    } else {
      await traer();
      fixed.value = false;
    }
  } else {
    let res = await useFicha.guardarFicha(cod.value, num.value);
    if (res?.response?.data?.errors) {
      fixed.value = true;
    } else {
      await traer();
      cerar();
      fixed.value = false;
    }
  }

  loadingGuardar.value = false;
}

async function editarFicha() {
  numError.value = !num.value;
  codError.value = !cod.value;

  if (numError.value || codError.value) {
    return;
  }

  loadingGuardar.value = true;
  let res = await useFicha.editarFicha(id.value, cod.value, num.value);
  await traer();
  loadingGuardar.value = false;
  return res;
}

const columns = ref([
  { name: 'codigo', label: 'CÓDIGO', field: 'codigo', align: 'center', sortable: true },
  { name: 'nombre', label: 'NOMBRE', field: 'nombre', align: 'center', sortable: true },
  { name: 'estado', label: 'ESTADO', field: 'estado', align: 'center', sortable: true },
  { name: 'opciones', label: 'OPCIONES', align: 'center' },
]);

const Salir = async () => {
  router.replace("/home")
}
</script>

<style scoped>
#en {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0px;
  padding-top: 0px;
}

#programas {
  font-size: 35px;
  font-weight: bold;
  text-align: center;
  flex-grow: 1;
  padding-top: 0px;
  margin-top: 0px;
  padding-top: 40px;
  margin-bottom: 0px;
}

#atras {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background-color: rgb(8, 73, 55);
  color: white;
  margin-left: 3%;
  margin-bottom: 0px;
  margin-top: 4%;
}

hr {
  width: 80%;
  border: 2px solid #2F7D32;
  margin: 0 auto;
  margin-top: -20px;
  margin-bottom: 0px;
}

.tablafichas {
  width: 80%;
  margin: 0 auto;
  margin-bottom: 60px;
}

#agregarficha {
  margin: 0 auto;
  margin-bottom: 20px;
  margin-top: 30px;
  background-color: #2F7D32 !important;
  font-size: 13px;
  font-weight: bold;
}

#agregarficha .material-symbols-outlined {
  font-size: 19px;
  margin-right: 5px;
}

.modal-card {
  max-width: 400px;
  width: 100%;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  background-color: #f8f9fa;
}

.modal-header {
  background-color: #2F7D32;
  color: white;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  padding: 16px;
  font-weight: bold !important;
  font-size: 18px;
  text-align: center;
}

.modal-body {
  padding: 35px;
}

.modal-footer {
  padding: 16px;
  background-color: #f1f1f1;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
}

#btnguardar {
  background-color: #2F7D32 !important;
  font-size: 13px;
  font-weight: bold;
  color: white !important;
}

#btncerrar {
  color: black !important;
  border: 1px black;
}

#edit {
  background-color: rgb(28, 75, 51) !important;
  border-radius: 70%;
  margin: 5px;
  width: 37px;
  color: white;
}

.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px; /* Ajusta el tamaño según lo necesario */
}
</style>