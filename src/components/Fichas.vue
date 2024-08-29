<template>
  <div>
    <div id="en">
      <button id="atras" @click="Salir()"><span class="material-symbols-outlined">arrow_back</span></button>
      <h1 id="programas">Programas</h1>
    </div>
    <hr>
    <div style="margin: 0px;">
      <div class="tablafichas">
        <div style="margin-top: 0px;">
          <q-btn id="agregarficha" @click="fixed = true" color="primary">
            <span class="material-symbols-outlined">add_circle</span>Crear
          </q-btn>
        </div>
        <q-table :rows="rows" :columns="columns" row-key="codigo">
          <template class="tabla" v-slot:body-cell-opciones="props">
            <q-td :props="props">
              <q-btn id="edit" @click="traerDatos(props.row)" color="primary"><span
                  class="material-symbols-outlined">edit</span></q-btn>
            </q-td>
          </template>
          <template v-slot:header-cell="props">
            <q-th :props="props" :style="{ fontWeight: 'bold', color: 'black', fontSize: '16px' }">
              {{ props.col.label }}
            </q-th>
          </template>
          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <q-btn @click="activar(props.row._id)" :color="props.row.estado == 1 ? 'green' : 'red'">
                {{ props.row.estado == 1 ? 'Activo' : 'Inactivo' }}
              </q-btn>
            </q-td>
          </template>
        </q-table>
        <q-dialog v-model="fixed" :backdrop-filter="'blur(4px) saturate(150%)'" transition-show="rotate"
          transition-hide="rotate" persistent>
          <q-card>
            <q-card-section>
              <div class="text-h6">{{ b == true ? "Editar Ficha" : "Guardar Ficha" }}</div>
            </q-card-section>

            <q-separator />

            <q-card-section style="max-height: 50vh" class="scroll">
              <q-input filled v-model="num" label="Nombre De La Ficha" :dense="dense" />
              <q-input filled v-model="cod" label="Codigo De La Ficha" :dense="dense" />

            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
              <q-btn flat label="Cerar" color="primary" v-close-popup @click="cerar()" />
              <q-btn flat label="Guardar" color="primary" @click="crearFicha()" />
            </q-card-actions>
          </q-card>
        </q-dialog>


      </div>

    </div>
    <q-dialog v-model="fixed" :backdrop-filter="'blur(4px) saturate(150%)'" transition-show="rotate"
      transition-hide="rotate" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ b == true ? "Editar Ficha" : "Guardar Ficha" }}</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">
          <q-input filled v-model="num" label="Nombre De La Ficha" :dense="dense" :error="numError"
            error-message="El nombre de la ficha es requerido" />
          <q-input filled v-model="cod" label="Codigo De La Ficha" :dense="dense" :error="codError"
            error-message="El código de la ficha es requerido" />
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup @click="cerar()" />
          <q-btn flat label="Guardar" color="primary" @click="crearFicha()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onBeforeMount, watch } from 'vue';
import { Dark } from 'quasar';
import { useQuasar } from 'quasar';
import { useFichaStore } from '../stores/fichas.js';

const useFicha = useFichaStore();
const $q = useQuasar();
const router = useRouter()
let confirm = ref(false);
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

onBeforeMount(() => {
  traer();
});

function ides(ids) {
  id.value = ids;
  confirm.value = true;
}

async function traer() {
  let res = await useFicha.listarFichas();
  rows.value = res.data;
}

function traerDatos(datos) {
  id.value = datos._id;
  fixed.value = true;
  b.value = true;
  num.value = datos.nombre;
  cod.value = datos.codigo;
  numError.value = false; // Reset error states
  codError.value = false;
}

function cerar() {
  b.value = false;
  num.value = "";
  cod.value = "";
  numError.value = false; // Reset error states
  codError.value = false;
}

async function activar(id) {
  let res = await useFicha.activarDesactivarFichas(id);
  await traer();
}

async function crearFicha() {
  numError.value = !num.value;
  codError.value = !cod.value;

  if (numError.value || codError.value) {
    return;
  }

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
}

async function editarFicha() {
  numError.value = !num.value;
  codError.value = !cod.value;

  if (numError.value || codError.value) {
    return;
  }

  let res = await useFicha.editarFicha(id.value, cod.value, num.value);
  await traer();
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
  margin-left: 25px;
  margin-bottom: 0px;
  margin-top: 20px;
}

hr {
  width: 80%;
  border: 2px solid #2F7D32;
  margin: 0 auto;
  margin-top: -20px;
  margin-bottom: 0px
}

.tablafichas {
  width: 80%;
  margin: 0 auto;
  margin-bottom: 60px
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

#delete {
  background-color: red;
  border-radius: 70%;
  margin: 5px;
  width: 37px;
  color: white;
}

#edit {
  background-color: rgb(28, 75, 51) !important;
  border-radius: 70%;
  margin: 5px;
  width: 37px;
  color: white;
}
</style>
