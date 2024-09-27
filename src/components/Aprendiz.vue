<template>
  <div id="en">
    <button id="atras" @click="Salir()">
      <span class="material-symbols-outlined">arrow_back</span>
    </button>
    <h1 id="programas">Aprendices</h1>
  </div>
  <hr>
  <div style="margin: 0px;">
    <div class="tablafichas">
      <div style="margin-top: 0px;">
        <q-btn @click="fixed = true" color="primary" id="agregar-aprendiz">
          <span class="material-symbols-outlined">add_circle</span>
          Agregar
        </q-btn>
      </div>
      <q-table :rows="rows" :columns="columns" row-key="codigo">
        <template class="tabla" v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <q-btn id="edit" @click="traerDatos(props.row)" color="primary">
              <span class="material-symbols-outlined">edit</span>
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
            <q-btn @click="Activar(props.row._id)" :color="props.row.estado == 1 ? 'green' : 'red'":loading="loadingStates[props.row._id]"
              >
                <q-spinner v-if="loadingStates[props.row._id]" color="white" size="20px" />
                {{ props.row.estado == 1 ? 'Activo' : 'Inactivo' }}
              </q-btn>
          </q-td>
        </template>
      </q-table>

      <q-dialog v-model="fixed" :backdrop-filter="'blur(4px) saturate(150%)'" transition-show="rotate"
        transition-hide="rotate" persistent>
        <q-card class="modal-card">
          <div class="modal-header">
            {{ b ? "Editar Aprendiz" : "Guardar Aprendiz" }}
          </div>

          <div class="modal-body">
            <q-input filled v-model="nom" label="Nombre Del Aprendiz" :dense="dense" :error="nomError"
              error-message="El nombre del aprendiz es requerido" />
            <q-input filled v-model="cc" label="CC" :dense="dense" :error="ccError"
              error-message="El CC es requerido" />
            <q-select filled v-model="IdFicha" :options="options" label="Selecciona una ficha" :dense="dense" use-input
              hide-selected fill-input input-debounce="0" @filter="filterFn" style="margin-bottom: 20px;">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Sin resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-input type="email" filled v-model="email" label="Email del Aprendiz" :dense="dense" :error="emailError"
              error-message="El email del aprendiz es requerido" />
            <q-input filled v-model="telefono" label="Telefono Del Aprendiz" :dense="dense" :error="telefonoError"
              error-message="El teléfono del aprendiz es requerido" />

            <div class="file-upload">
              <q-file v-model="firmaVirtual" label="Firma Virtual (Opcional)" filled accept="image/*"
                @update:model-value="handleFileChange">
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>

              <!-- Mostrar la foto existente si no se ha cargado una nueva -->
              <q-img v-if="!previewUrl && datosExistentesFirma" :src="datosExistentesFirma"
                style="max-width: 200px; max-height: 200px;" class="q-mt-md" />

              <!-- Mostrar la previsualización de la nueva foto si se ha seleccionado -->
              <q-img v-if="previewUrl" :src="previewUrl" style="max-width: 200px; max-height: 200px;" class="q-mt-md" />
            </div>
          </div>

          <div class="modal-footer">
            <q-card-actions align="right">
              <q-btn flat label="Cerrar" color="primary" v-close-popup @click="cerrar()" class="btn-cerrar" />
              <q-btn flat label="Guardar" color="primary" @click="crearAprendiz()" class="btn-guardar" />
            </q-card-actions>
          </div>
        </q-card>
      </q-dialog>
      <!-- <q-toggle v-model="isDark" label="Modo Oscuro" /> -->
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { onBeforeMount, ref, watch } from "vue";
import { useQuasar } from 'quasar';
import { useAprendizStore } from "../stores/aprendiz.js";
import { useFichaStore } from '../stores/fichas.js';
import { Dark } from 'quasar';

const router = useRouter();

const useAprendiz = useAprendizStore();
const useFicha = useFichaStore();

const $q = useQuasar();
let fixed = ref(false);
let nom = ref("");
let cc = ref("");
let IdFicha = ref("");
let email = ref("");
let telefono = ref("");
const firmaVirtual = ref(null);
const previewUrl = ref('');
let b = ref(false);
let id = ref("");
let fichas = ref([]);
let options = ref(fichas.value);
let ccOriginal = ref("");
let emailOriginal = ref("");
let datosExistentesFirma = ref("");

const nomError = ref(false);
const ccError = ref(false);
const emailError = ref(false);
const telefonoError = ref(false);

const isDark = ref(Dark.isActive);
watch(isDark, (val) => {
  Dark.set(val);
});

const loadingStates = ref({});

const rows = ref([]);

onBeforeMount(() => {
  traer();
});

function filterFn(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    options.value = fichas.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
  });
}

async function traer() {
  let res = await useAprendiz.listarAprendiz();
  let ris = await useFicha.listarFichas();
  fichas.value = ris.data.map(item => ({
    label: item.nombre,
    value: item._id
  }));
  rows.value = res.data;
}

function traerDatos(datos) {
  id.value = datos._id;
  fixed.value = true;
  b.value = true;
  nom.value = datos.nombre;
  cc.value = datos.cc;
  email.value = datos.email;
  telefono.value = datos.telefono;
  IdFicha.value = {
    label: datos.IdFicha.nombre,
    value: datos.IdFicha._id
  };

  if (datos.firmaVirtual) {
    datosExistentesFirma.value = datos.firmaVirtual;
  } else {
    datosExistentesFirma.value = '';
  }


  firmaVirtual.value = null;
  previewUrl.value = '';

  ccOriginal.value = datos.cc;
  emailOriginal.value = datos.email;
}

function cerrar() {
  b.value = false;
  nom.value = "";
  cc.value = "";
  email.value = "";
  telefono.value = "";
  IdFicha.value = "";
  firmaVirtual.value = null;
  previewUrl.value = '';
  datosExistentesFirma.value = '';

  nomError.value = false;
  ccError.value = false;
  emailError.value = false;
  telefonoError.value = false;
}

async function Activar(id, row) {
  loadingStates.value[id] = true;  // Activar el spinner solo para el botón correspondiente
  try {
    await useAprendiz.activarDesactivarAprendiz(id);  // Cambiar el estado de la ficha
    await traer();  // Actualizar la tabla
  } catch (error) {
    console.error("Error al cambiar el estado:", error);
  } finally {
    loadingStates.value[id] = false;  // Desactivar el spinner solo para el botón correspondiente
  }
}

async function crearAprendiz() {
  nomError.value = !nom.value;
  ccError.value = !cc.value;
  emailError.value = !email.value;
  telefonoError.value = !telefono.value;

  if (nomError.value || ccError.value || emailError.value || telefonoError.value) {
    return;
  }

  let res;

  if (b.value) {
    res = await editarAprendiz();
  } else {
    res = await useAprendiz.guardarAprendis(cc.value, nom.value, email.value, telefono.value, IdFicha.value.value, firmaVirtual.value);
  }

  if (res?.response?.data?.errors) {
    fixed.value = true;
  } else {
    await traer();
    fixed.value = false;
    cerrar();
  }
}

async function editarAprendiz() {
  const datosActualizados = {};

  if (cc.value !== ccOriginal.value) {
    datosActualizados.cc = cc.value;
  }
  if (email.value !== emailOriginal.value) {
    datosActualizados.email = email.value;
  }
  if (nom.value) {
    datosActualizados.nombre = nom.value;
  }
  if (telefono.value) {
    datosActualizados.telefono = telefono.value;
  }
  if (IdFicha.value) {
    datosActualizados.IdFicha = IdFicha.value.value;
  }

  let res = await useAprendiz.editarAprendiz(id.value, datosActualizados);

  await traer();
  return res;
}

const handleFileChange = (file) => {
  if (file) {
    firmaVirtual.value = file;
    previewUrl.value = URL.createObjectURL(file);
    datosExistentesFirma.value = ''; // Ocultar la firma existente al seleccionar una nueva
  } else {
    firmaVirtual.value = null;
    previewUrl.value = '';
  }
};

const subir = (e) => {
  if (e.target.files.length > 0) {
    firmaVirtual.value = e.target.files[0];
    console.log("Archivo seleccionado:", firmaVirtual.value);
  }
};

async function cargarCloud() {
  if (!firmaVirtual.value) {
    console.log("No hay archivo para subir");
    return;
  }

  const formData = new FormData();
  formData.append("archivo", firmaVirtual.value); // Cambia "firmaVirtual" a "archivo"

  try {
    let ris = await useAprendiz.cargarcould(id.value, formData);
    console.log("Archivo subido correctamente", ris);
    $q.notify({
      color: 'positive',
      message: 'Firma virtual subida correctamente',
      icon: 'cloud_done'
    });
  } catch (error) {
    console.error("Error subiendo archivo:", error);
    $q.notify({
      color: 'negative',
      message: 'Error al subir la firma virtual',
      icon: 'error'
    });
  }
}

const columns = ref([
  { name: 'nombre1', label: 'NOMBRE', align: 'center', field: 'nombre', sortable: true, width: '200px' },
  { name: 'codigo1', label: 'DOCUMENTO', align: 'center', field: 'cc', sortable: true, width: '100px' },
  { name: 'email1', label: 'EMAIL', align: 'center', field: 'email', sortable: true },
  { name: 'telefono1', label: 'TELEFONO', align: 'center', field: 'telefono', sortable: true, width: '100px' },
  { name: 'IdFicha1', label: 'N° DE FICHA', align: 'center', field: row => row?.IdFicha?.codigo, sortable: true, width: '100px' },
  { name: 'IdFicha2', label: 'NOMBRE DE FICHA', align: 'center', field: row => row?.IdFicha?.nombre, sortable: true },
  { name: 'estado', label: 'ESTADO', align: 'center', field: 'estado', sortable: true, width: '100px' },
  { name: 'opciones', label: 'OPCIONES', align: 'center', width: '80px' },
]);

const Salir = async () => {
  router.replace("/home")
}
</script>

<style scoped>
#agregar-aprendiz {
  background-color: #2F7D32 !important;
  font-size: 13px;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 20px;
}

#agregar-aprendiz .material-symbols-outlined {
  font-size: 19px;
  margin-right: 5px;
}

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
  padding-top: 40px;
  margin-bottom: 0px;
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
  margin-left: 3%;
  margin-top: 2%;
  cursor: pointer;
  /* Asegura que se vea como un botón clickeable */
}

#atras:focus {
  outline: none;
  /* Elimina el borde de enfoque */
}

hr {
  width: 95%;
  border: 2px solid #2F7D32;
  margin: 0 auto;
  margin-top: -20px;
  margin-bottom: 0px;
}

.tablafichas {
  width: 95%;
  margin: 0 auto;
  margin-bottom: 60px;
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

.q-dialog__inner {
  max-height: 90vh;
  /* Limita la altura del modal */
  overflow: hidden;
  /* Oculta el scroll en el modal */
}

.modal-body {
  max-height: calc(90vh - 200px);
  /* Ajusta el tamaño para permitir espacio dentro del modal */
  overflow-y: auto;
  padding: 35px;
  /* Permite el scroll dentro de la parte de contenido */
}

.modal-body::-webkit-scrollbar {
  display: none;
}


.modal-footer {
  padding: 16px;
  background-color: #f1f1f1;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
}

.btn-guardar {
  background-color: #2F7D32 !important;
  color: white !important;
  font-size: 13px;
  font-weight: bold;
}

.btn-cerrar {
  color: black !important;
  border: 1px solid black !important;
  font-size: 13px;
  font-weight: bold;
}

#edit {
  background-color: rgb(28, 75, 51) !important;
  border-radius: 70%;
  margin: 5px;
  width: 37px;
  color: white;
}
</style>