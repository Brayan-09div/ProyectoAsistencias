<template>
    <div class="container">
      <q-card class="q-pa-md" style="width: 400px; max-width: 100%; margin: auto;">
        <q-card-section>
          <div class="text-h5">Recuperar Contraseña</div>
          <q-input
            v-model="email"
            filled
            label="Correo electrónico"
            type="email"
            :error="emailError"
            error-message="Ingrese un correo electrónico válido"
            class="q-mb-md"
            placeholder="Ingrese su correo electrónico"
          />
        </q-card-section>
  
        <q-card-actions align="center">
          <q-btn
            label="Enviar"
            color="primary"
            @click="enviar"
          />
        </q-card-actions>
      </q-card>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useUsuariosStore } from "../stores/usuarios.js";
  import { useRouter } from "vue-router";
  import { Notify } from 'quasar';
  
  const router = useRouter();
  const useUsuarios = useUsuariosStore();
  const email = ref("");
  const emailError = ref(false);
  
  const enviar = async () => {
    emailError.value = !email.value.trim();
    
    if (emailError.value) {
      Notify.create({
        color: "negative",
        message: "Por favor, ingrese un email",
        icon: "error",
        timeout: 2500,
      });
      return;
    }
  
    try {
      let res = await useUsuarios.solicitarRecuperacion(email.value);
      
      if (res?.data?.success) {
        Notify.create({
          color: "positive",
          message: "Se ha enviado el correo de recuperación.",
          icon: "check_circle",
          timeout: 2500,
        });
        router.push("/"); 
      } else {
        Notify.create({
          color: "negative",
          message: "Hubo un error al enviar el correo. Inténtalo nuevamente.",
          icon: "error",
          timeout: 2500,
        });
      }
    } catch (error) {
      console.error('Error en la solicitud de recuperación de contraseña:', error);
      Notify.create({
        color: "negative",
        message: "Error en la recuperación de contraseña. Por favor, inténtelo más tarde.",
        icon: "error",
        timeout: 2500,
      });
    }
  };
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
  }
  
  .text-h5 {
    font-weight: bold;
  }
  
  .q-btn {
    margin-top: 15px;
  }
  </style>
  