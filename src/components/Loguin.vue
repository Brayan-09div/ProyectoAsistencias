<template>
<div>
  <div class="login-container">
    <q-card class=" q-pa-md" style="width: 400px;">
      <q-card-section>
        <div class="text-h5">BIENVENIDOS A REPFORA</div>
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

      <q-card-actions align="center">
        <q-btn class="boton" @click ="loguin()" label="Iniciar Sesión" color="primary" />
      </q-card-actions>
    </q-card>
</div>
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
      router.replace("/fichas");
    }
  } catch (error) {
    console.error('Error en el inicio de sesión:', error.message);
  }
}

</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url(https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2);
  background-repeat: no-repeat;
  background-size: cover;
  color: #000000;
}

.q-card{
  text-align: center;
  align-items: center;
  justify-content: center;
  font-weight: bold !important;
}

.text-h5{
  font-weight: bold;
}

.text-h6{
  font-weight: bold;
  font-size: 18px;
}

.boton{
  background-color: #4CAF50 !important;
  color: #ffffff !important;
  font-weight: bold;
  margin-top: 15px;
}
</style>
