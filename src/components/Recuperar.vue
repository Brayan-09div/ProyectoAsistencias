<template>
  <div class="container">
    <q-card class="q-pa-md" style="width: 400px; max-width: 100%; margin: auto;">
      <q-card-section>
        <div class="text-h5">Restablecer Contraseña</div>
        <p class="text-subtitle2">Correo: {{ email }}</p>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="password"
          filled
          label="Nueva contraseña"
          type="password"
          :error="passwordError"
          error-message="La contraseña es requerida"
          class="q-mb-md"
        />
        <q-input
          v-model="password2"
          filled
          label="Confirmar contraseña"
          type="password"
          :error="password2Error"
          error-message="La confirmación de la contraseña es requerida"
        />
      </q-card-section>

      <q-card-actions align="center">
        <q-btn
          label="Restablecer Contraseña"
          color="primary"
          @click="restablecerContraseña"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUsuariosStore } from "../stores/usuarios.js";
import { useRoute } from "vue-router";
import { Notify } from 'quasar';

const route = useRoute();
const useUsuarios = useUsuariosStore();

const password = ref('');
const password2 = ref('');
const email = ref(route.query.correo || '');

const passwordError = ref(false);
const password2Error = ref(false);

async function restablecerContraseña() {
  passwordError.value = !password.value;
  password2Error.value = !password2.value;

  if (password.value !== password2.value) {
    Notify.create({
      color: "negative",
      message: "Las contraseñas no coinciden.",
      icon: "error",
      timeout: 2500,
    });
    return;
  }

  if (passwordError.value || password2Error.value) {
    return;
  }

  try {
    await useUsuarios.restablecerContrasena(email.value, password.value);
    Notify.create({
      color: "positive",
      message: "Contraseña restablecida con éxito.",
      icon: "check_circle",
      timeout: 2500,
    });
  } catch (error) {
    console.error("Error al restablecer la contraseña", error);
    Notify.create({
      color: "negative",
      message: "Error al restablecer la contraseña.",
      icon: "error",
      timeout: 2500,
    });
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.q-card {
  text-align: center;
  font-weight: bold !important;
}

.text-h5 {
  font-weight: bold;
}

.text-subtitle2 {
  color: #666;
}

.q-btn {
  margin-top: 15px;
}
</style>
