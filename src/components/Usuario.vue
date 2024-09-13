<template>
  <div>
    <div id="en">
      <button id="atras" @click="Salir()">
        <span class="material-symbols-outlined">arrow_back</span>
      </button>
      <h1 id="programas">Usuarios</h1>
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
          <!-- Asegúrate de que la tabla esté dentro del contenedor adecuado para la visibilidad -->
          <div class="table-container">
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
                @click="activar(props.row._id)"
                :color="props.row.estado == 1 ? 'green' : 'red'"
                :loading="loadingStates[props.row._id]"
              >
                <q-spinner v-if="loadingStates[props.row._id]" color="white" size="20px" />
                {{ props.row.estado == 1 ? 'Activo' : 'Inactivo' }}
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
        <!-- Modal de Crear/Editar Usuario -->
        <q-dialog v-model="fixed" :backdrop-filter="'blur(4px) saturate(150%)'" transition-show="rotate" transition-hide="rotate" persistent>
          <q-card class="modal-card">
            <q-card-section class="modal-header">
              <div class="text-h6">{{ b ? "Editar Usuario" : "Guardar Usuario" }}</div>
            </q-card-section>

            <q-separator />

            <q-card-section style="max-height: 50vh" class="scroll modal-body">
              <q-input filled v-model="nom" label="Nombre Del Usuario" :dense="dense" :error="nomError" error-message="El nombre es requerido" />
              <q-input filled v-model="email" label="Email" :dense="dense" :error="emailError" error-message="El email es requerido y debe ser válido" />
            </q-card-section>

            <q-card-actions align="center" class="modal-footer">
              <q-btn
                class="btn-cerrar"
                flat
                label="Cerrar"
                color="primary"
                v-close-popup
                @click="cerrar()"
              />
              <q-btn
                class="btn-guardar"
                flat
                label="Guardar"
                color="primary"
                @click="crearUsuario()"
                :loading="loadingGuardar"
              >
                <q-spinner v-if="loadingGuardar" color="white" size="20px" />
              </q-btn>
            </q-card-actions>
          </q-card>
        </q-dialog>
        
        <!-- Modal de Confirmación de Eliminación -->
        <q-dialog v-model="confirm" :backdrop-filter="'blur(4px) saturate(150%)'" transition-show="rotate" transition-hide="rotate" persistent>
          <q-card class="modal-card">
            <q-card-section class="modal-header">
              <span class="text-h6">Confirmación</span>
            </q-card-section>

            <q-separator />

            <q-card-section class="scroll modal-body">
              <span class="q-ml-sm">¿Seguro quieres eliminar el usuario?</span>
            </q-card-section>

            <q-separator />

            <q-card-actions align="center" class="modal-footer">
              <q-btn class="btn-cerrar" flat label="Cancelar" color="primary" v-close-popup />
              <q-btn class="btn-guardar" @click="eliminarUsuario()" flat label="Aceptar" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onBeforeMount, watch } from 'vue';
import { Dark } from 'quasar';
import { useQuasar } from 'quasar';
import { useUsuariosStore } from "../stores/usuarios.js"

const useUsuarios = useUsuariosStore();
const $q = useQuasar();
const router = useRouter();

let confirm = ref(false);
let fixed = ref(false);
let nom = ref("");
let email = ref("");
let password = ref("");
let b = ref(false);
let id = ref("");

const nomError = ref(false);
const emailError = ref(false);

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

function ides(ids) {
  id.value = ids;
  confirm.value = true;
}

async function traer() {
  // Mostrar spinner global si no hay otros botones en carga
  if (!Object.values(loadingStates.value).includes(true) && !loadingAgregar.value && !loadingEdit.value && !loadingGuardar.value) {
    loadingTable.value = true;
  }

  try {
    let res = await useUsuarios.listarUsuarios();
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
  nom.value = datos.nombre;
  email.value = datos.email;
  password.value = ''; // Clear password during edit
}

function cerrar() {
  b.value = false;
  nom.value = "";
  email.value = "";
  password.value = "";
  nomError.value = false;
  emailError.value = false;
}

async function activar(id, row) {
  loadingStates.value[id] = true;  // Activar el spinner solo para el botón correspondiente

  try {
    await useUsuarios.activarDesactivarUsuario(id);  // Cambiar el estado del usuario
    // Actualizar la tabla
    const index = rows.value.findIndex(user => user._id === id);
    if (index !== -1) {
      rows.value[index].estado = row.estado === 1 ? 0 : 1; // Alternar el estado
    }
  } catch (error) {
    console.error("Error al cambiar el estado:", error);
  } finally {
    loadingStates.value[id] = false;  // Desactivar el spinner solo para el botón correspondiente
  }
}

async function crearUsuario() {

  nomError.value = !nom.value;
  emailError.value = !email.value || !email.value.includes('@');

  if (nomError.value || emailError.value) {
    return;
  }

  loadingGuardar.value = true;

  if (b.value) {
    const res = await useUsuarios.editarUsuario(id.value, email.value, nom.value);
    if (res?.response?.data?.errors) {
      fixed.value = true;
    } else {
      await traer();
      fixed.value = false;
    }
  } else {
    let res = await useUsuarios.guardarUsuario(email.value, nom.value, password.value);
    if (res?.response?.data?.errors) {
      fixed.value = true;
    } else {
      await traer();
      fixed.value = false;
    }
  }

  loadingGuardar.value = false;
}

async function eliminarUsuario() {
  let res = await useUsuarios.eliminar(id.value);
  await traer();
  return res;
}

const columns = ref([
  { name: 'email', label: 'EMAIL', field: 'email', align: 'center', sortable: true },
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

.btn-guardar{
  background-color: #2F7D32 !important;
  font-size: 13px !important;
  font-weight: bold !important;
  color: white !important;
}

.btn-cerrar{
  color: black !important;
  border: 1px black !important;
}

#edit {
  background-color: rgb(28, 75, 51) !important;
  border-radius: 50%;
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