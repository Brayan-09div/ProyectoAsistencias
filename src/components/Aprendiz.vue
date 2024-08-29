<template>
    <div>
      <div style="margin: 10px;">
        <div style="display:flex; justify-content: end;">
          <q-btn @click="fixed = true" color="primary" id="agregar-aprendiz">
            Agregar Aprendiz
          </q-btn>
        </div>
        <q-table title="Aprendiz" :rows="rows" :columns="columns" row-key="name">
          <template v-slot:body-cell-opciones="props">
            <q-td :props="props">
              <q-btn @click="traerDatos(props.row)" color="primary">📝</q-btn>
              <q-btn @click="activar(props.row._id)" v-if="props.row.estado == 0">✅</q-btn>
              <q-btn @click="activar(props.row._id)" v-else>❌</q-btn>
            </q-td>
          </template>
          <template v-slot:body-cell-estado1="props">
            <q-td :props="props">
              <p :style="{ color: props.row.estado == 1 ? 'green' : 'red' }">
                {{ props.row.estado == 1 ? 'Activo' : 'Inactivo' }}
              </p>
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
        <div style="display:flex; justify-content: end;">
          <q-btn @click="fixed = true" color="primary" id="agregar-aprendiz">
            Agregar Aprendiz
          </q-btn>
        </div>
        <q-toggle v-model="isDark" label="Modo Oscuro" />
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

  const rows = ref([]);
  
  const isDark = ref(Dark.isActive);
  watch(isDark, (val) => {
      Dark.set(val);
  });
  

  
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
      { name: 'nombre1', label: 'Nombre del Aprendiz', align: 'center', field: 'nombre', sortable: true },
      { name: 'codigo1', label: 'Documento Del Aprendiz', align: 'center', field: 'cc', sortable: true },
      { name: 'email1', label: 'Email Del Aprendiz', align: 'center', field: 'email', sortable: true },
      { name: 'telefono1', label: 'Telefono Del Aprendiz', align: 'center', field: 'telefono', sortable: true },
      { name: 'IdFicha1', label: 'Número De Ficha', align: 'center', field: row => row?.IdFicha?.codigo, sortable: true },
      { name: 'IdFicha2', label: 'Nombre De Ficha', align: 'center', field: row => row?.IdFicha?.nombre, sortable: true },
      { name: 'estado1', label: 'Estado', align: 'center', field: 'estado', sortable: true },
      { name: 'opciones', label: 'Opciones', align: 'center' },
  ]);
  

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
  </style>
  