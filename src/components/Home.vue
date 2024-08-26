<template>
  <div>
    <q-layout view="hHh LpR fFf">
      <q-header elevated class="bg-black text-white">
        <q-toolbar style="background-color: #307e35;">
          <q-btn dense flat round icon="menu" @click="toggleLeftDrawer"></q-btn>
          <q-toolbar-title>
            REPFORA
          </q-toolbar-title>
          <q-btn class="btnSalir" @click="Salir()" color="green-9">
            <span class="material-symbols-outlined">logout</span>
          </q-btn>
        </q-toolbar>
      </q-header>

      <q-drawer v-model="leftDrawerOpen" :width="250" side="left" overlay behavior="mobile" class="bg-black" dark
        elevated>
        <router-link to="/perfil" class="text-weight-bold">
          <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
            <div class="absolute-bottom bg-transparent">
              <q-avatar size="60px" class="q-mb-sm">
                <img src="https://cdn.quasar.dev/img/boy-avatar.png">
              </q-avatar>

              <div>Nombre</div>
            </div>
          </q-img>
        </router-link>

        <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
          <q-list padding>



            <q-item clickable to="/usuario" v-ripple>
              <q-item-section avatar>
                <q-icon name="person" />
              </q-item-section>

              <q-item-section>
                Usuarios
              </q-item-section>
            </q-item>


            <q-item clickable to="/aprendiz" v-ripple>
              <q-item-section avatar>
                <q-icon name="person" />
              </q-item-section>

              <q-item-section>
                Aprendiz
              </q-item-section>
            </q-item>


            <q-item clickable to="/bitacoras" v-ripple>
              <q-item-section avatar>
                <q-icon name="person" />
              </q-item-section>

              <q-item-section>
                Bitacoras
              </q-item-section>
            </q-item>

            <q-item clickable to="/fichas" v-ripple>
              <q-item-section avatar>
                <q-icon name="document" />
              </q-item-section>

              <q-item-section>
                Fichas
              </q-item-section>
            </q-item>

            <q-item clickable to="/isncripcion" v-ripple>
              <q-item-section avatar>
                <q-icon name="document" />
              </q-item-section>

              <q-item-section>
                Isncripcion
              </q-item-section>
            </q-item>

          </q-list>
        </q-scroll-area>
      </q-drawer>

      <div>
        <Router-view />
      </div>

      <q-footer elevated class="bg-black text-white">
        <q-toolbar style="background-color: #307e35">
          <q-toolbar-title class="text-center">
            <span class="text-bold" style="font-size: 15px">Soporte</span><span> - {{ new Date().getFullYear() }}</span>
          </q-toolbar-title>
        </q-toolbar>
      </q-footer>
    </q-layout>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { RouterView } from 'vue-router'
import { useRouter } from "vue-router";
import { useUsuariosStore } from "../stores/usuarios"
const router = useRouter();
let useUsuarios = useUsuariosStore()
const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};


const Salir = async () => {
  const res = await useUsuarios.logout()
  router.replace("/")
  console.log(res);

}

</script>


<style>
.material-symbols-outlined {
  margin: 0px;
  padding: 0px;
  font-size: 30px;
}
</style>