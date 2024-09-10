<template>
<div>
    <div id="en">
      <button id="atras" @click="Salir">
        <span class="material-symbols-outlined">arrow_back</span>
      </button>
      <h1 id="programas">Bitacoras</h1>
    </div>
    <hr>

    <div class="btnsB">
      <q-btn id="agregarficha" @click="fixed = true" color="primary">
        <span class="material-symbols-outlined">add_circle</span>Crear
      </q-btn>
      <button id="btnlist" @click="abrirModal1()">LISTAR FECHAS</button>
      <button id="btnlist" @click="abrirModal2()">LISTAR FICHA</button>
      <button id="btnlist" @click="abrirModal3()">LISTAR APRENDIZ</button>
      <button id="btnlist" @click="abrirModal4()">LISTAR FECHA</button>


      <q-dialog v-model="mostrarModal1" persistent>
      <q-card class="modal-card">
          <div class="modal-header">Listar Fechas</div>
          <div class="modal-body">
      <q-input v-model="fechaInicio" filled type="date" />
      <BR></BR>
      <q-input v-model="fechaFin" filled type="date" />
      </div>

      <div class="modal-footer">
        <q-card-actions align="right">
          <q-btn id="cierra" flat label="Cerrar" color="primary" v-close-popup @click="cerrarModal" />
          <q-btn id="lista" flat label="Listar" color="primary" @click="listarFechas" />
        </q-card-actions>
      </div>
      </q-card>
    </q-dialog>
      
    
    <q-dialog v-model="mostrarModal2" persistent>
      <q-card class="modal-card">
        <div class="modal-header">Listar Ficha</div>
        <div class="modal-body">
        <q-select rounded outlined v-model="IdFicha" use-input hide-selected fill-input input-debounce="0"
                :options="options" @filter="filterFichas" label="Selecciona una ficha">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Sin resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="modal-footer">
          <q-card-actions align="right">
          <q-btn id="cierra" flat label="Cerrar" color="primary" v-close-popup @click="cerrarModal" />
          <q-btn id="lista" flat label="Listar" color="primary" @click="listarBitacorasFicha" />
        </q-card-actions>
       </div>
       </q-card>
      </q-dialog>



      <q-dialog v-model="mostrarModal3" persistent>
        <q-card class="modal-card">
        <div class="modal-header">Listar Aprendiz</div>
        <div class="modal-body">
         <q-select rounded outlined v-model="idAprendis" use-input hide-selected fill-input input-debounce="0"
                :options="optionsAprendiz" @filter="filterAprendiz" label="Selecciona un aprendiz">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Sin resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
        </div>
        <div class="modal-footer">
          <q-card-actions align="right">
          <q-btn id="cierra" flat label="Cerrar" color="primary" v-close-popup @click="cerrarModal" />
          <q-btn id="lista" flat label="Listar" color="primary" @click="listarBitacorasAprendiz()" />
        </q-card-actions>
       </div>
       </q-card>
      </q-dialog>



      <q-dialog v-model="mostrarModal4" persistent>
        <q-card class="modal-card">
        <div class="modal-header">Listar Fecha</div>
        <div class="modal-body">
      <q-input v-model="fecha" filled type="date"/>
    </div>
    <div class="modal-footer">
          <q-card-actions align="right">
          <q-btn id="cierra" flat label="Cerrar" color="primary" v-close-popup @click="cerrarModal" />
          <q-btn id="lista" flat label="Listar" color="primary" @click="listarFecha()" />
        </q-card-actions>
       </div>
       </q-card>
      </q-dialog>
    
    </div>
</div>


    <div style="margin: 0px;">
      <div class="tablafichas">
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
          <template v-slot:header-cell="props">
            <q-th :props="props" :style="{ fontWeight: 'bold', color: 'black', fontSize: '14px' }">
              {{ props.col.label }}
            </q-th>
          </template>
        </q-table>



        <q-dialog
          v-model="fixed"
          :backdrop-filter="'blur(4px) saturate(150%)'"
          transition-show="rotate"
          transition-hide="rotate"
          persistent
        >

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
              <q-btn id="cierra" flat label="Cerrar" color="primary" v-close-popup @click="cerrar" />
              <q-btn id="lista"flat label="Guardar" color="primary" @click="crearBitacora" />
            </q-card-actions>
          </div>
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

        <!-- <q-toggle v-model="isDark" label="Modo Oscuro" /> -->
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
const mostrarModal1 = ref(false);
const mostrarModal2 = ref(false);
const mostrarModal3 = ref(false);
const mostrarModal4 = ref(false);



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
  mostrarModal1.value = false;
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
  mostrarModal4.value = false;
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
  mostrarModal2.value = false;
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
  mostrarModal3.value = false;
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
  { name: 'fecha', label: 'FECHA', field: 'fecha', align: 'center', sortable: true },
  { name: 'IdAprendiz', align: 'center', label: 'NOMBRE', field: row => row?.IdAprendis?.nombre, sortable: true },
  { name: 'IdAprendiz', align: 'center', label: 'TELEFONO', field: row => row?.IdAprendis?.telefono, sortable: true },
  { name: 'IdAprendiz', align: 'center', label: 'EMAIL', field: row => row?.IdAprendis?.email, sortable: true },
  { name: 'IdAprendiz', align: 'center', label: 'DOCUMENTO', field: row => row?.IdAprendis?.cc, sortable: true },
  { name: 'nombreFicha', align: 'center', label: 'NOMBRE FICHA', field: row => row?.IdAprendis?.IdFicha?.nombre, sortable: true },
  { name: 'codigoFicha', align: 'center', label: 'CODIGO FICHA', field: row => row?.IdAprendis?.IdFicha?.codigo, sortable: true },
  { name: 'estado', align: 'center', label: 'ESTADO', field: 'estado', sortable: true },
]);


function abrirModal1() {
  mostrarModal1.value = true; // Abre el modal
}

function abrirModal2() {
  mostrarModal2.value = true; // Abre el modal
}

function abrirModal3() {
  mostrarModal3.value = true; // Abre el modal
}

function abrirModal4() {
  mostrarModal4.value = true; // Abre el modal
}

function cerrarModal() {
  mostrarModal.value = false; // Cierra el modal
}

const Salir = async () => {
  router.replace("/home")
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
  width: 40px; /* Aumenté el tamaño para mejorar la clicabilidad */
  height: 40px; /* Aumenté el tamaño para mejorar la clicabilidad */
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background-color: rgb(8, 73, 55);
  color: white;
  margin-left: 5%;
  margin-top: 0%;
  cursor: pointer; /* Asegura que se vea como un botón clickeable */
}

#atras:focus {
  outline: none; /* Elimina el borde de enfoque */
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
  margin-bottom: 150px;
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

.btnsB{
  width: 90%;
  margin: 0 auto;
  margin-bottom: 20px;
  display: flex;
  gap: 20px;
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

#lista {
  background-color: #2F7D32 !important;
  font-size: 13px;
  font-weight: bold;
  color: white !important;
}

#cierra {
  color: black !important;
  border: 1px black;
}

#btnlist{
  background-color: #2F7D32 !important;
  font-size: 13px;
  font-weight: bold;
  color: white;
  border-radius: 3px;
  border: 0px;
  height: 34px;
  width: 140px;
}
</style>