<template>
      <div id="en">
      <button id="atras" @click="Salir()"><span class="material-symbols-outlined">arrow_back</span></button>
      <h1 id="programas">Aprendices</h1>
    </div>
    <hr>
    <div style="margin: 0px;">
      <div class="tablafichas">
        <div style="margin-top: 0px;">
          <q-btn @click="fixed = true" color="primary" id="agregar-aprendiz"><span class="material-symbols-outlined">add_circle</span>
            Agregar
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
              <div class="text-h6">{{ b ? "Editar Aprendiz" : "Guardar Aprendiz" }}</div>
            </q-card-section>
  
            <q-separator />
  
            <q-card-section style="max-height: 50vh" class="scroll">
              <q-input filled v-model="nom" label="Nombre Del Aprendiz" :dense="dense" :error="nomError"
                error-message="El nombre del aprendiz es requerido" />
              <q-input filled v-model="cc" label="CC" :dense="dense" :error="ccError"
                error-message="El CC es requerido" />
              <q-select rounded outlined v-model="IdFicha" use-input hide-selected fill-input input-debounce="0"
                :options="options" @filter="filterFn" label="Selecciona una ficha">
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
            </q-card-section>
  
            <q-separator />
  
            <q-card-actions align="right">
              <q-btn flat label="Cerrar" color="primary" v-close-popup @click="cerrar()" />
              <q-btn flat label="Guardar" color="primary" @click="crearAprendiz()" />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <!-- <q-toggle v-model="isDark" label="Modo Oscuro" /> -->
      </div>
    </div>
  </template>
  
  <script setup>
  import { onBeforeMount, ref, watch } from "vue";
  import { useQuasar } from 'quasar';
  import { useAprendizStore } from "../stores/aprendiz.js";
  import { useFichaStore } from '../stores/fichas.js';
  import { Dark } from 'quasar';
  
  const useAprendiz = useAprendizStore();
  const useFicha = useFichaStore();
  
  const $q = useQuasar();
  let fixed = ref(false);
  let nom = ref("");
  let cc = ref("");
  let IdFicha = ref("");
  let email = ref("");
  let telefono = ref("");
  let b = ref(false);
  let id = ref("");
  let fichas = ref([]);
  let options = ref(fichas.value);
  let ccOriginal = ref("");
  let emailOriginal = ref("");


  const nomError = ref(false);
  const ccError = ref(false);
  const emailError = ref(false);
  const telefonoError = ref(false);
  
  const isDark = ref(Dark.isActive);
  watch(isDark, (val) => {
      Dark.set(val);
  });
  
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
   
      nomError.value = false;
      ccError.value = false;
      emailError.value = false;
      telefonoError.value = false;
  }
  
  async function activar(id) {
      await useAprendiz.activarDesactivarAprendiz(id);
      await traer();
  }
  
  async function crearAprendiz() {

      nomError.value = !nom.value;
      ccError.value = !cc.value;
      emailError.value = !email.value;
      telefonoError.value = !telefono.value;
  
      if (nomError.value || ccError.value || emailError.value || telefonoError.value) {
          return;
      }
  
      if (b.value) {
          const res = await editarAprendiz();
          cerrar();
          if (res?.response?.data?.errors) {
              fixed.value = true;
          } else {
              await traer();
              fixed.value = false;
          }
      } else {
          let res = await useAprendiz.guardarAprendiz(cc.value, nom.value, email.value, telefono.value, IdFicha.value.value);
          if (res?.response?.data?.errors) {
              fixed.value = true;
          } else {
              await traer();
              fixed.value = false;
          }
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
  
  const columns = ref([
      { name: 'nombre1', label: 'NOMBRE', align: 'center', field: 'nombre', sortable: true, width: '200px'},
      { name: 'codigo1', label: 'DOCUMENTO', align: 'center', field: 'cc', sortable: true, width: '100px' },
      { name: 'email1', label: 'EMAIL', align: 'center', field: 'email', sortable: true },
      { name: 'telefono1', label: 'TELEFONO', align: 'center', field: 'telefono', sortable: true, width: '100px'},
      { name: 'IdFicha1', label: 'N° DE FICHA', align: 'center', field: row => row?.IdFicha?.codigo, sortable: true, width: '100px' },
      { name: 'IdFicha2', label: 'NOMBRE DE FICHA', align: 'center', field: row => row?.IdFicha?.nombre, sortable: true },
      { name: 'estado1', label: 'ESTADO', align: 'center', field: 'estado', sortable: true, width: '100px'},
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
  width: 95%;
  border: 2px solid #2F7D32;
  margin: 0 auto;
  margin-top: -20px;
  margin-bottom: 0px
}

.tablafichas {
  width: 95%;
  margin: 0 auto;
  margin-bottom: 60px
}

#agregar-aprendiz {
  margin: 0 auto;
  margin-bottom: 20px;
  margin-top: 30px;
  background-color: #2F7D32 !important;
  font-size: 13px;
  font-weight: bold;
}

#agregar-aprendiz .material-symbols-outlined {
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
  