<template>
<div>
    <q-card class="q-pa-md" style="width: 400px;">
      <q-card-section>
        <div class="text-h6">Iniciar Sesión</div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="email"
          filled
          label="Nombre de Usuario"
          dense
        />
        <q-input
          v-model="password"
          filled
          label="Contraseña"
          type="password"
          dense
          class="q-mt-md"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn @click ="loguin()" label="Iniciar Sesión" color="primary" />
      </q-card-actions>
    </q-card>
</div>
</template>

<script setup>
import { ref } from 'vue';
import {useUsuariosStore} from "../stores/usuarios.js"
import { useRouter } from "vue-router";
const router = useRouter();
const email = ref('');
const password = ref('');
const useUsuarios = useUsuariosStore()

async function loguin() {
  try {
    let res = await useUsuarios.loguin(email.value, password.value);
    console.log(res);
    if (res?.response?.data?.errors || res?.response?.data?.msg) {
      console.error('Error en el inicio de sesión:', res.message);
    } else {
      router.replace("/home ");
    }
  } catch (error) {
    console.error('Error en el inicio de sesión:', error.message);
  }
}

</script>

<style scoped>
.q-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
