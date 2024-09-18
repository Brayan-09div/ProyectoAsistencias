<template>
  <div class="contenido">
    <div id="en">
      <button id="atras" @click="Salir">
        <span class="material-symbols-outlined">arrow_back</span>
      </button>
      <h1 id="programas" style="font-size: 40px;">Informes</h1>
    </div>
    <hr>

    <!-- Modal para filtrar bitácoras -->
    <q-dialog v-model="mostrarModal" persistent>
      <q-card class="modal-card1">
        <div class="modal-header1">Seleccionar Filtros</div>
        <div class="modal-body1">
          <div class="filtroFichas">
            <q-select rounded outlined v-model="IdFicha" use-input hide-selected fill-input input-debounce="0"
              :options="options" @filter="filterFichas" label="Selecciona una ficha" />
          </div>
          <div class="fecha1">
            <q-input v-model="fecha" filled type="date" />
          </div>
        </div>

        <div class="modal-footer1">
          <q-card-actions align="right">
            <q-btn id="cierra" flat label="Cerrar" color="primary" v-close-popup @click="cerrarModal" />
            <q-btn id="lista" flat label="Listar" color="primary" @click="listarBitacorasFichaFecha" />
            <template v-slot:append>
              <!-- Spinner para el botón Listar -->
              <q-spinner v-if="loadingListar" color="white" size="20px" />
            </template>
          </q-card-actions>
        </div>
      </q-card>
    </q-dialog>

    <div class="tablafichas">
      <!-- Spinner visible cuando loadingTable es true -->
      <div v-if="loadingTable" class="spinner-container">
        <q-spinner color="green" size="50px" />
      </div>

      <!-- Mostrar la tabla solo cuando loadingTable es false -->
      <div v-else>
        <div class="btns">
          <q-btn id="btnlist1" color="green" label="Crear PDF" icon="picture_as_pdf" push class="q-my-md"
            :disabled="!datosListados" @click="crearPDF" />
          <button id="btnlist" @click="abrirModal()">FILTROS</button>
        </div>
        <q-table :rows="rows" :columns="columns" row-key="_id">
          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <q-select v-model="props.row.estado" :options="['pendiente', 'asistió', 'faltó', 'excusa']"
                @update:model-value="cambiarEstado(props.row._id, props.row.estado)" />
            </q-td>
          </template>
          <template v-slot:header-cell="props">
            <q-th :props="props" :style="{ fontWeight: 'bold', color: 'black', fontSize: '14px' }">
              {{ props.col.label }}
            </q-th>
          </template>
        </q-table>
      </div>
    </div>

    <!-- Dialogo para crear bitácora -->
    <q-dialog v-model="fixed" :backdrop-filter="'blur(4px) saturate(150%)'" transition-show="rotate"
      transition-hide="rotate" persistent>
      <q-card class="modal-card">
        <div class="modal-header">Crear Bitácora</div>
        <div class="modal-body">
          <q-input filled v-model="nom" label="Nombre Del Aprendiz" :dense="dense" />
          <q-input filled v-model="cc" label="CC" :dense="dense" />
          <q-input filled v-model="IdFicha" label="Id De La Ficha" :dense="dense" />
          <q-input filled v-model="email" label="Email del Aprendiz" :dense="dense" />
          <q-input filled v-model="telefono" label="Teléfono Del Aprendiz" :dense="dense" />
        </div>

        <div class="modal-footer">
          <q-card-actions align="right">
            <q-btn class="btn-cerrar" flat label="Cerrar" color="primary" v-close-popup @click="cerrar" />
            <q-btn class="btn-guardar" flat label="Guardar" color="primary" @click="crearBitacora" />
          </q-card-actions>
        </div>
      </q-card>
    </q-dialog>

    <!-- Diálogo para confirmar eliminación -->
    <q-dialog v-model="confirm" persistent :backdrop-filter="'blur(4px) saturate(150%)'" transition-show="rotate"
      transition-hide="rotate">
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

let fichas = ref([]);  // Declaración única
let options = ref(fichas.value);  // Declaración única que depende de fichas
const mostrarModal = ref(false); // Estado del modal

let fecha = ref("");
let IdFicha = ref("");

const loadingTable = ref(true);  // Nueva variable de estado para la tabla
const loadingListar = ref(false); // Estado de carga para el botón Listar

let datosListados = ref(false); //

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
  loadingTable.value = true; // Mostrar el spinner antes de iniciar la carga

  try {
    const res = await useBitacora.listarBitacoras();
    const ris = await useFicha.listarFichas();

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
  } catch (error) {
    console.error("Error al cargar los datos:", error);
  } finally {
    loadingTable.value = false; // Ocultar el spinner después de la carga
  }
}


async function listarBitacorasFichaFecha() {
  if (IdFicha.value === '') {
    return;
  }
  loadingListar.value = true; // Mostrar spinner en el botón

  try {
    const res = await useBitacora.listarBitacoraFechaFicha(IdFicha.value.value, fecha.value);
    rows.value = res.map(bitacora => {
      const fecha = new Date(bitacora.fecha);
      const dia = String(fecha.getDate()).padStart(2, '0');
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      const año = fecha.getFullYear();
      bitacora.fecha = `${dia}/${mes}/${año}`;
      return bitacora;
    });
    datosListados.value = true; // Marcar datos como listados
  } catch (error) {
    console.error("Error al listar bitácoras:", error);
  } finally {
    loadingListar.value = false; // Ocultar spinner después de la carga
    cerrarModal();
  }
}

function cambiarEstado(id, nuevoEstado) {
  useBitacora.cambiaEstado(id, nuevoEstado)
    .then(() => {
      if (IdFicha.value && fecha.value) {
        // Si hay filtro por ficha y fecha, volvemos a listar con el filtro
        listarBitacorasFichaFecha();
      } else {
        // Si no hay filtro, cargamos todos los datos
        traer();
      }
    })
    .catch(error => {
      console.error('Error al cambiar estado:', error);
    });
}


function crearPDF() {
  if (!datosListados.value) {
    $q.notify({
      type: 'warning',
      message: 'Por favor, liste o filtre las bitácoras por ficha y fecha antes de crear el PDF.'
    });
    return;
  }

  router.push('/pdf');
}


const columns = ref([
  { name: 'fecha', label: 'FECHA', field: 'fecha', align: 'center', sortable: true },
  { name: 'IdAprendiz', align: 'center', label: 'NOMBRE', field: row => row?.IdAprendis?.nombre, sortable: true },
  { name: 'IdAprendiz', align: 'center', label: 'TELEFONO', field: row => row?.IdAprendis?.telefono, sortable: true },
  { name: 'IdAprendiz', align: 'center', label: 'EMAIL', field: row => row?.IdAprendis?.email, sortable: true },
  { name: 'IdAprendiz', align: 'center', label: 'DOCUMENTO', field: row => row?.IdAprendis?.cc, sortable: true },
  { name: 'nombreFicha', align: 'center', label: 'NOMBRE FICHA', field: row => row?.IdAprendis?.IdFicha?.nombre, sortable: true },
  { name: 'codigoFicha', align: 'center', label: 'CODIGO FICHA', field: row => row?.IdAprendis?.IdFicha?.codigo, sortable: true },
  { name: 'estado', align: 'center', label: 'ESTADO', field: 'estado', sortable: true },
]);

function abrirModal() {
  mostrarModal.value = true; // Abre el modal
}

function cerrarModal() {
  mostrarModal.value = false; // Cierra el modal
}

const Salir = async () => {
  router.replace("/home");
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
  padding-top: 30px;
}

.filtroFichas {
  width: 40%;
}

.fecha1 {
  width: 40%;
}

#programas {
  font-size: 35px;
  font-weight: bold;
  text-align: center;
  flex-grow: 1;
}

#atras {
  width: 40px;
  /* Aumenté el tamaño para mejorar la clicabilidad */
  height: 40px;
  /* Aumenté el tamaño para mejorar la clicabilidad */
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background-color: rgb(8, 73, 55);
  color: white;
  margin-left: 5%;
  margin-top: 0%;
  cursor: pointer;
  /* Asegura que se vea como un botón clickeable */
}

#atras:focus {
  outline: none;
  /* Elimina el borde de enfoque */
}

hr {
  width: 90%;
  border: 2px solid #2F7D32;
  margin: -20px auto 0;
  margin-bottom: 20px;
  margin-top: 5PX;
}

.tablafichas {
  width: 90%;
  margin: 0 auto;
  margin-bottom: 100px;
}

#agregarficha {
  background-color: #2F7D32 !important;
  font-size: 13px;
  font-weight: bold;
}

#agregarficha .material-symbols-outlined {
  font-size: 19px;
  margin-right: 5px;
}

#btnlist {
  background-color: #2F7D32 !important;
  font-size: 13px;
  font-weight: bold;
  color: white;
  border-radius: 3px;
  border: 0px;
  height: 35px;
  width: 150px;
  margin-bottom: 25px;
}

#btnlist1 {
  background-color: #2F7D32 !important;
  font-size: 13px;
  font-weight: bold;
  color: white;
  border-radius: 3px;
  border: 0px;
  height: 35px;
  width: 150px;
  margin-bottom: 25px;
  margin-top: 0px;
  padding-top: 5px;
}

.btns {
  display: flex;
  gap: 10px;
}

.contenido {
  margin-bottom: 120px
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

.btn-guardar {
  background-color: #2F7D32 !important;
  font-size: 13px;
  font-weight: bold;
  color: white !important;
}

.btn-cerrar {
  color: black !important;
  border: 1px black;
}

.modal-card1 {
  max-width: 400px;
  width: 100%;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  background-color: #f8f9fa;
}

.modal-header1 {
  background-color: #2F7D32;
  color: white;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  padding: 16px;
  font-weight: bold !important;
  font-size: 18px;
  text-align: center;
}

.modal-body1 {
  padding: 35px;
}

.modal-footer1 {
  padding: 16px;
  background-color: #f1f1f1;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
}

.filtroFichas {
  width: 100%;
  margin-bottom: 10px;
}

.fecha1 {
  width: 100%;
}

#lista {
  background-color: #2F7D32 !important;
  font-size: 13px;
  font-weight: bold;
  color: white !important;
  position: relative;
  /* Para posicionar el spinner correctamente */
}

#lista .q-spinner {
  position: absolute;
  right: 10px;
  /* Ajusta según sea necesario */
  top: 50%;
  transform: translateY(-50%);
}

#cierra {
  color: black !important;
  border: 1px black;
}

.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  /* Ajusta el tamaño según lo necesario */
}
</style>
