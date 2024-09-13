<template>
  <div class="perfilcompleto">
    <button id="atras" @click="Salir()">
      <span class="material-symbols-outlined">arrow_back</span>
    </button>
    <div class="profile-container">
      <div class="profile-card">
        <div class="profile-avatar">
          <img :src="photo" alt="User Avatar" />
        </div>
        <h2 class="profile-name">{{ useUsuarios.usuarios.usuario.nombre }}</h2>
        <p class="profile-title">{{ useUsuarios.usuarios.usuario.email }}</p>
        <div class="profile-info">
          <p><i class="fas fa-envelope"></i> {{ useUsuarios.usuarios.usuario.roles[0] }}</p>
          <button @click="fixed = true">Cambiar Contraseña</button>
        </div>
      </div>

      <div>
        <q-dialog v-model="fixed" :backdrop-filter="'blur(4px) saturate(150%)'" transition-show="rotate"
                  transition-hide="rotate" persistent>
          <q-card>
            <q-card-section>
              <div class="text-h6">Cambiar Contraseña</div>
            </q-card-section>

            <q-separator />

            <q-card-section style="max-height: 50vh" class="scroll">
              <q-input type="password" filled v-model="contraseñavieja" label="Contraseña antigua" :dense="dense" :error="contraseñaviejaError"
                       error-message="La contraseña antigua es requerida" />
              <q-input type="password" filled v-model="password" label="Nueva contraseña" :dense="dense" :error="contraseñanuevaError"
                       error-message="La nueva contraseña es requerida" />
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
              <q-btn flat label="Cerrar" color="primary" v-close-popup @click="cerrar" />
              <q-btn flat label="Cambiar Contraseña" color="primary" @click="restablecerContraseña" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUsuariosStore } from '../stores/usuarios.js';
import { Notify } from 'quasar';

const useUsuarios = useUsuariosStore();

let fixed = ref(false);

let contraseñavieja = ref('');
let password = ref('');

let contraseñaviejaError = ref(false);
let contraseñanuevaError = ref(false);


  let photo = 'https://via.placeholder.com/100'


async function restablecerContraseña() {
  contraseñaviejaError.value = !contraseñavieja.value;
  contraseñanuevaError.value = !password.value;

  if (contraseñaviejaError.value || contraseñanuevaError.value) {
    return;
  }

  try {
    await useUsuarios.cambiarPassword(useUsuarios.usuarios.usuario._id, contraseñavieja.value, password.value);
    Notify.create({
      color: 'positive',
      message: 'Contraseña cambiada con éxito.',
      icon: 'check_circle',
      timeout: 2500,
    });
    // Vaciar campos después de cambiar la contraseña
    contraseñavieja.value = '';
    password.value = '';
    contraseñaviejaError.value = false;
    contraseñanuevaError.value = false;
    fixed.value = false;
  } catch (error) {
    Notify.create({
      color: 'negative',
      message: 'Error al cambiar la contraseña. Verifica la contraseña antigua.',
      icon: 'error',
      timeout: 2500,
    });
  }
}

const router = useRouter();
const Salir = () => {
  router.replace('/home');
};

const cerrar = () => {
  fixed.value = false;
};
</script>


<style scoped>
.perfilcompleto {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f6f9;
  padding: 20px;
  box-sizing: border-box;
}

#atras {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background-color: #2F7D32; /* Color verde */
  color: white;
  position: absolute;
  top: 13%;
  left: 5%;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

#atras:hover {
  background-color: #1e6f23; /* Color verde más oscuro */
}

.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.profile-card {
  background-color: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.profile-avatar img {
  border-radius: 50%;
  width: 100px;
  height: 100px;
  object-fit: cover;
  border: 3px solid #2F7D32; /* Color verde */
}

.profile-name {
  font-size: 26px;
  font-weight: 600;
  color: #333;
  margin: 15px 0 5px;
}

.profile-title {
  font-size: 18px;
  color: #777;
  margin-bottom: 20px;
}

.profile-info p {
  font-size: 15px;
  color: #555;
  margin: 8px 0;
}

.profile-info i {
  margin-right: 10px;
  color: #2F7D32; /* Color verde */
}

.reset-link {
  display: inline-block;
  margin-top: 20px;
  color: #2F7D32; /* Color verde */
  text-decoration: none;
  font-size: 15px;
}

.reset-link:hover {
  text-decoration: underline;
}
</style>
