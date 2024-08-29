<template>
  <div class="home1">
    <div>
      <h1 v-if="isHome" id="programas">REGISTRO Y PROGRAMACIÓN DE FORMACIÓN ACTUALIZADA</h1>
      <hr v-if="isHome">

      <q-layout view="hHh LpR fFf">

        <q-header elevated class="bg-black text-white">
          <q-toolbar style="background-color: #307e35;">
            <q-btn dense flat round icon="menu" @click="toggleLeftDrawer"></q-btn>
            <q-toolbar-title style="font-weight: bold;">
              REPFORA
            </q-toolbar-title>
            <q-btn class="btnSalir" @click="Salir()" color="green-9" style="border: 0px; background-color: none;">
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
              <!-- Lista de opciones -->
              <q-item clickable to="/usuario" v-ripple>
                <q-item-section avatar>
                  <q-icon name="person" />
                </q-item-section>
                <q-item-section>
                USUARIOS
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

        <div class="cards" v-if="isHome">
          <q-card class="my-card">
            <q-img src="https://images.pexels.com/photos/3184396/pexels-photo-3184396.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2">
              <div class="text-subtitle2 absolute-top text-center" style="font-weight: bold; font-size: 15px;">
                USUARIOS
              </div>
            </q-img>
            <q-card-section>
              <q-btn id="Ver" color="primary" clickable to="/usuario" v-ripple>Ver</q-btn>
            </q-card-section>
          </q-card>
          <q-card class="my-card">
      <q-img src="https://images.pexels.com/photos/711009/pexels-photo-711009.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2">
        <div class="text-subtitle2 absolute-top text-center" style="font-weight: bold; font-size: 15px;">
          APRENDICES
        </div>
      </q-img>
      <q-card-section>
        <q-btn id="Ver" color="primary" clickable to="/aprendiz" v-ripple>Ver</q-btn>
      </q-card-section>
    </q-card>
    <q-card class="my-card">
      <q-img src="https://images.pexels.com/photos/7648055/pexels-photo-7648055.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2">
        <div class="text-subtitle2 absolute-top text-center" style="font-weight: bold; font-size: 15px;">
          BITACORAS
        </div>
      </q-img>
      <q-card-section>
        <q-btn id="Ver" color="primary" clickable to="/bitacoras" v-ripple>Ver</q-btn>
      </q-card-section>
    </q-card>
    <q-card class="my-card">
      <q-img src="https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2">
        <div class="text-subtitle2 absolute-top text-center" style="font-weight: bold; font-size: 15px;">
          FICHAS
        </div>
      </q-img>
      <q-card-section>
        <q-btn id="Ver" color="primary" clickable to="/fichas" v-ripple>Ver</q-btn>
      </q-card-section>
    </q-card>
        </div>

        <hr v-if="isHome">

        <div class="inscripciones">
        <h1 v-if="isHome" id="inscrip">INSCRIPCION</h1>
        <q-btn v-if="isHome" id="REGISTRO" color="primary" clickable to="/isncripcion" v-ripple>REGISTRO</q-btn>
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
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUsuariosStore } from "../stores/usuarios";

const router = useRouter();
const route = useRoute();
let useUsuarios = useUsuariosStore();

const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const Salir = async () => {
  const res = await useUsuarios.logout();
  router.replace("/");
  console.log(res);
};

// Monitorea los cambios de ruta para actualizar el estado `isHome`
watch(
  () => route.path,
  (newPath) => {
    isHome.value = newPath === '/home';
  }
);
</script>

<style>
.material-symbols-outlined {
  margin: 0px;
  padding: 0px;
  font-size: 35px;
}

#programas {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  flex-grow: 1;
  padding-top: 0px;
  margin-top: 0px;
  padding-top: 40px;
  margin-bottom: 0px;
}

#inscrip{
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  flex-grow: 1;
  padding-top: 0px;
  margin-top: 0px;
  padding-top: 0px;
  margin-bottom: 0px;
}

hr {
  width: 80%;
  border: 2px solid #2F7D32;
  margin: 0 auto;
  margin-top: -20px;
  margin-bottom: 0px;
}

.cards{
  width: 70%;
  margin: 0 auto;
  margin-bottom: 50px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-top: 20px;
  justify-content: center;
  text-align: center;
  align-items: center;
}

#Ver{
  margin: 0 auto;
  margin-bottom: 0px;
  margin-top: 0px;
  background-color: #2F7D32 !important;
  font-size: 15px;
  font-weight: bold;
  width: 55%;
}

#REGISTRO{
  margin: 0 auto;
  margin-bottom: 100px;
  margin-top: 0px;
  background-color: #2F7D32 !important;
  font-size: 15px;
  font-weight: bold;
  width: 35%;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.inscripciones{
  text-align: center;
  justify-content: center;
  align-items: center;
}

</style>
