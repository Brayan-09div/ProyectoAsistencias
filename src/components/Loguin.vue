<template>
  <div>
    <div class="login-container">
      <q-card class="q-pa-md" style="width: 400px;">
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
            :error="emailError"
            error-message="El nombre de usuario es requerido"
          />
          <q-input
            v-model="password"
            filled
            label="Contraseña"
            type="password"
            dense
            class="q-mt-md"
            :error="passwordError"
            error-message="La contraseña es requerida"
          />
        </q-card-section>

        <q-card-actions align="center">
          <q-btn class="boton" @click="login" label="Iniciar Sesión" color="primary" />
        </q-card-actions>

        <q-card-actions align="center" class="q-mt-md">
          <router-link to="/enviarCorreo">
            <q-btn flat label="¿Olvidaste tu contraseña?" color="secondary" />
          </router-link>
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUsuariosStore } from "../stores/usuarios.js";
import { useRouter } from "vue-router";

const router = useRouter();
const email = ref('');
const password = ref('');
const emailError = ref(false);
const passwordError = ref(false);
const useUsuarios = useUsuariosStore();

async function login() {
  emailError.value = !email.value;
  passwordError.value = !password.value;

  if (emailError.value || passwordError.value) {
    return; 
  }

  try {
    let res = await useUsuarios.loguin(email.value, password.value);
    if (res?.response?.data?.errors || res?.response?.data?.msg) {
      console.error('Error en el inicio de sesión:', res.message);
    } else {
      router.replace("/home");
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

.q-card {
  text-align: center;
  align-items: center;
  justify-content: center;
  font-weight: bold !important;
}

.text-h5 {
  font-weight: bold;
}

.text-h6 {
  font-weight: bold;
  font-size: 18px;
}

.boton {
  background-color: #4CAF50 !important;
  color: #ffffff !important;
  font-weight: bold;
  margin-top: 15px;
}
</style>

