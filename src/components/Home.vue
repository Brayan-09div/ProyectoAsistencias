<template>
  <div class="home1">
    <div>
      <h1 v-if="isHome" id="programas">REGISTRO Y PROGRAMACIÓN DE FORMACIÓN ACTUALIZADA</h1>
      <hr v-if="isHome">
      <q-layout view="hHh LpR fFf">
        <q-header elevated class="bg-black text-white">
          <q-toolbar style="background-color: #307e35;">
            <q-btn dense flat round icon="menu" @click="toggleLeftDrawer"></q-btn>
            <q-toolbar-title style="font-weight: bold;">REPFORA</q-toolbar-title>
            <q-btn class="btnSalir" @click="Salir" color="green-9" style="border: 0px;">
              <span class="material-symbols-outlined">logout</span>
            </q-btn>
          </q-toolbar>
        </q-header>

        <q-drawer v-model="leftDrawerOpen" :width="250" side="left" overlay behavior="mobile" class="bg-black" style="background-color: white !important;">
          <router-link to="/perfil" class="text-weight-bold">
            <q-img class="absolute-top" src="https://caracol.com.co/resizer/v2/KWOY6HLXGJDY7FINVWKHW4BZH4.jpg?auth=1cb703fcb1fe937ca055451ec405ad84789073f23e256b7fba7bf44f1622b06e&width=650&height=488&quality=70&smart=true" style="height: 150px">
              <div class="absolute-bottom bg-transparent">
                <q-avatar size="70px" class="q-mb-sm">
                  <img :src="useUsuarios.usuarios.usuario.avatar.trim()" alt="User avatar">
                </q-avatar>
                <div style="text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3); text-transform: uppercase;">{{ useUsuarios.usuarios.usuario.nombre }}</div>
              </div>
            </q-img>
          </router-link>

          <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
            <q-list padding>
              <!-- Lista de opciones con iconos -->
              <q-item clickable to="/usuario" v-ripple class="menu-button">
                <q-item-section avatar>
                  <q-icon name="person" />
                </q-item-section>
                <q-item-section>USUARIOS</q-item-section>
              </q-item>

              <q-item clickable to="/aprendiz" v-ripple class="menu-button">
                <q-item-section avatar>
                  <q-icon name="school" />
                </q-item-section>
                <q-item-section>APRENDICES</q-item-section>
              </q-item>

              <q-item clickable to="/fichas" v-ripple class="menu-button">
                <q-item-section avatar>
                  <q-icon name="folder" />
                </q-item-section>
                <q-item-section>FICHAS</q-item-section>
              </q-item>

              <q-item clickable to="/bitacoras" v-ripple class="menu-button">
                <q-item-section avatar>
                  <q-icon name="book" />
                </q-item-section>
                <q-item-section>BITACORAS</q-item-section>
              </q-item>

              <q-item clickable to="/informesAprendiz" v-ripple class="menu-button">
                <q-item-section avatar>
                  <q-icon name="assignment_ind" />
                </q-item-section>
                <q-item-section>INFORMES APRENDIZ</q-item-section>
              </q-item>

              <q-item clickable to="/informes" v-ripple class="menu-button">
                <q-item-section avatar>
                  <q-icon name="assessment" />
                </q-item-section>
                <q-item-section>INFORMES</q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
        </q-drawer>

        <div>
          <router-view />
        </div>

        <div class="cards" v-if="isHome">
          <!-- Tus tarjetas aquí -->
        </div>

        <hr v-if="isHome">

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
const useUsuarios = useUsuariosStore();
const leftDrawerOpen = ref(false);
const isHome = ref(route.path === '/home');

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const Salir = async () => {
  await useUsuarios.logout();
  router.replace("/");
};

watch(
  () => route.path,
  (newPath) => {
    isHome.value = newPath === '/home';
  }
);

const getAvatarUrl = (avatar) => {
  if (!avatar) {
    return '/path/to/default/avatar.jpg';
  }
  return `https://tu-dominio.com/${avatar}`;
};
</script>

<style>
.material-symbols-outlined {
  margin: 0px;
  padding: 0px;
  font-size: 35px;
}

#programas,
#inscrip {
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

.menu-button {
  background-color: #2F7D32;
  color: white !important;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 15px;
  font-weight: bold;
  width: 95%;
  display: flex;
  flex-direction: row; /* Cambia la dirección a fila */
  align-items: center; /* Alinea los elementos verticalmente */
  justify-content: flex-start; /* Alinea los elementos a la izquierda */
  margin-left: 2%;
}

.menu-button q-icon {
  margin-right: 10px; /* Espacio entre el icono y el texto */
}

.menu-button:hover {
  background-color: #276527;
}


.cards {
  width: 80%;
  margin: 0 auto;
  margin-bottom: 120px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 15px;
  margin-top: 20px;
  justify-content: center;
  text-align: center;
  align-items: center;
}

#Ver,
#REGISTRO {
  background-color: #2F7D32 !important;
  font-size: 15px;
  font-weight: bold;
}

#REGISTRO {
  width: 35%;
}

#Ver {
  width: 55%;
}

.inscripciones {
  text-align: center;
  justify-content: center;
  align-items: center;
  margin-bottom: 100px;
}

.home1 {
  margin-top: 3%;
}
</style>
