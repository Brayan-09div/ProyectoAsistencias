<template>
    <div>
      <div id="en">
        <button id="atras" @click="Salir()"><span class="material-symbols-outlined">arrow_back</span></button>
        <h1 id="programas">Usuarios</h1>
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
                <q-btn @click="traerDatos(props.row)" color="primary">📝</q-btn>
                <q-btn @click="ides(props.row._id)">🗑️</q-btn>
              </q-td>
            </template>
            <template v-slot:body-cell-estado="props">
              <q-td :props="props">
                <q-btn
                  @click="activar(props.row._id)"
                  :color="props.row.estado == 1 ? 'green' : 'red'"
                >
                  {{ props.row.estado == 1 ? 'Activo' : 'Inactivo' }}
                </q-btn>
              </q-td>
            </template>
          </q-table>
          <q-dialog v-model="fixed" :backdrop-filter="'blur(4px) saturate(150%)'" transition-show="rotate"
                  transition-hide="rotate" persistent>
                  <q-card>
                      <q-card-section>
                          <div class="text-h6">{{ b == true ? "Editar Usuario" : "Guardar Usuario" }}</div>
                      </q-card-section>
  
                      <q-separator />
  
                      <q-card-section style="max-height: 50vh" class="scroll">
                          <q-input filled v-model="nom" label="Nombre Del Usuario" :dense="dense" />
                          <q-input filled v-model="email" label=" Email" :dense="dense" />
                      </q-card-section>
  
                      <q-separator />
                      <q-card-actions align="right">
                          <q-btn flat label="Cerar" color="primary" v-close-popup @click="cerar()" />
                          <q-btn flat label="Guardar" color="primary" @click="crearUsuario()" />
                      </q-card-actions>
                  </q-card>
              </q-dialog>
  
  
              <q-dialog v-model="confirm" persistent :backdrop-filter="'blur(4px) saturate(150%)'"
                  transition-show="rotate" transition-hide="rotate">
                  <q-card>
                      <q-card-section class="row items-center">
                          <span class="q-ml-sm">Seguro Quieres Eliminar La Ficha</span>
                      </q-card-section>
  
                      <q-card-actions align="right">
                          <q-btn flat label="Cancelar" color="primary" v-close-popup />
                          <q-btn @click="eliminarUsuario()" flat label="Aceptar" color="primary" v-close-popup />
                      </q-card-actions>
                  </q-card>
              </q-dialog>
              <q-toggle v-model="isDark" label="Modo Oscuro" />
        </div>
        
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter} from 'vue-router'
  import { ref, onBeforeMount, watch } from 'vue';
  import { Dark } from 'quasar';
  import { useQuasar } from 'quasar';
  import {useUsuariosStore} from "../stores/usuarios.js"
  
  const useUsuarios = useUsuariosStore()
  const $q = useQuasar();
  const router = useRouter()
  let confirm = ref(false);
  let fixed = ref(false);
  let nom = ref("");
  let email = ref("");
  let password = ref("");
  let b = ref(false);
  let id = ref("");
  
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
    let res = await useUsuarios.listarUsuarios();
    rows.value = res.data;
  }
  
  function traerDatos(datos) {
    id.value = datos._id;
    fixed.value = true;
    b.value = true;
    nom.value = datos.nombre;
    email.value = datos.email;
    password.value = datos.password;
  }
  
  function cerar() {
    b.value = false;
    nom.value = "";
    email.value = "";
  }
  
  async function activar(id) {
    let res = await useUsuarios.activarDesactivarUsuario(id);
    await traer();
  }
  
  async function crearUsuario() {
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
  }
  
  async function editarFicha() {
    let res = await useFicha.editarFicha(id.value, cod.value, num.value);
    await traer();
    return res;
  }
  
  async function eliminarUsuario() {
    let res = await useUsuarios.eliminar(id.value);
    await traer();
    return res;
  }
  
  const columns = ref([
    { name: 'email', label: 'Email', field: 'email', align: 'center', sortable: true },
    { name: 'nombre', label: 'NOMBRE', field: 'nombre', align: 'center', sortable: true },
    { name: 'estado', label: 'ESTADO', field: 'estado', align: 'center', sortable: true },
    { name: 'opciones', label: 'OPCIONES', align: 'center' },
  ]);
  
  const Salir = async ( ) =>{
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
    margin-top: 10px;
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
  
  </style>
  