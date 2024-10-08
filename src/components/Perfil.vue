<template>
  <button id="atras" @click="Salir()"><span class="material-symbols-outlined">arrow_back</span></button>
  <div class="perfilcompleto">
    <!-- Botón de regreso -->

    <div class="profile-container">
      <div class="profile-card">
        <!-- Encabezado del perfil con foto de portada y avatar -->
        <div class="profile-header">
          <div class="profile-cover" :style="{ backgroundImage: `url(${coverPhoto})` }"></div>
          <div class="profile-avatar">
            <img :src="avatarUrl" alt="Avatar del Usuario" @click="openPhotoDialog" />
            <div class="avatar-edit" @click="openPhotoDialog">
              <q-icon name="edit" size="sm" color="white" />
            </div>
          </div>
        </div>

        <!-- Información del usuario -->
        <h2 class="profile-name">{{ useUsuarios.usuarios.usuario.nombre }}</h2>
        <p class="profile-title">{{ useUsuarios.usuarios.usuario.email }}</p>

        <div class="profile-info">
          <p>
            <q-icon name="work" /> Rol: {{ useUsuarios.usuarios.usuario.roles[0] }}
          </p>
          <p>
            <q-icon :name="statusIcon(useUsuarios.usuarios.usuario.estado)" :color="statusColor(useUsuarios.usuarios.usuario.estado)" />
            Estado: {{ displayEstado(useUsuarios.usuarios.usuario.estado) }}
          </p>
          <p>
            <q-icon name="event" /> Miembro desde: {{ formatDate(useUsuarios.usuarios.usuario.createdAt) }}
          </p>
        </div>

        <!-- Acciones del perfil -->
        <div class="profile-actions">
          <q-btn color="green-7" icon="lock" label="Cambiar Contraseña" @click="openChangePasswordDialog" class="q-mr-sm" />
          <q-btn color="green-7" icon="edit" label="Editar Perfil" @click="openEditDialog" />
        </div>

        <!-- Enlaces de redes sociales -->
        <!-- <div class="social-links">
          <p>Redes Sociales</p>
          <div>
            <q-btn round color="blue" icon="fab fa-facebook-f" class="q-mr-sm" @click="openSocialLink('facebook')" />
            <q-btn round color="light-blue" icon="fab fa-twitter" class="q-mr-sm" @click="openSocialLink('twitter')" />
            <q-btn round color="light-blue-10" icon="fab fa-linkedin-in" @click="openSocialLink('linkedin')" />
          </div>
        </div> -->
      </div>

      <!-- Diálogo para cambiar la foto de perfil -->
      <q-dialog v-model="photoDialog">
        <q-card class="modal-card" style="min-width: 350px">
            <div class="modal-header">Cambiar Foto de Perfil</div>
          <q-card-section class="q-pt-none">
            <div class="modal-body">
            <q-file v-model="newPhoto" label="Seleccionar nueva foto" filled>
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
            </div>
          </q-card-section>
          <div class="modal-footer">
          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="primary" v-close-popup @click="cerrarPhotoDialog" />
            <q-btn flat label="Guardar" color="primary" @click="updatePhoto" :loading="loadingPhoto" />
          </q-card-actions>
          </div>
        </q-card>
      </q-dialog>

      <!-- Diálogo para cambiar contraseña -->
      <q-dialog v-model="changePasswordDialog" :backdrop-filter="'blur(4px) saturate(150%)'" transition-show="rotate" transition-hide="rotate" persistent>
        <q-card class="modal-card">
            <div class="modal-header">Cambiar Contraseña</div>
          <q-card-section class="q-pt-none">
            <div class="modal-body">
            <q-input 
              type="password" 
              filled 
              v-model="contraseñavieja" 
              label="Contraseña antigua" 
              :dense="dense" 
              :error="contraseñaviejaError"
              error-message="La contraseña antigua es requerida" 
              class="q-mb-md"
            />
            <q-input 
              type="password" 
              filled 
              v-model="password" 
              label="Nueva contraseña" 
              :dense="dense" 
              :error="contraseñanuevaError"
              error-message="La nueva contraseña es requerida" 
            />
          </div>
        </q-card-section>
          <div class="modal-footer">
          <q-card-actions align="right">
            <q-btn flat label="Cerrar" color="primary" v-close-popup @click="cerrarChangePasswordDialog" />
            <q-btn flat label="Cambiar Contraseña" color="green-7" @click="restablecerContraseña" :loading="loadingGuardar" />
          </q-card-actions>
          </div>
        </q-card>
      </q-dialog>

      <!-- Diálogo para editar perfil -->
      <q-dialog v-model="editDialog">
        <q-card class="modal-card">
            <div class="modal-header">Editar Perfil</div>
          <q-separator />
          <div class="modal-body">
          <q-card-section class="q-pt-none">
            <q-input 
              filled 
              v-model="nom" 
              label="Nombre" 
              :dense="dense" 
              :error="nomError"
              error-message="El nombre es requerido" 
              class="q-mb-md"
            />
            <q-input 
              filled 
              v-model="email" 
              label="Email" 
              type="email"
              :dense="dense" 
              :error="emailError"
              error-message="Ingrese un correo electrónico válido" 
            />
          </q-card-section>
          </div>
          <q-separator />
          <div class="modal-footer">
          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="primary" v-close-popup @click="cerrarEditDialog" />
            <q-btn flat label="Guardar" color="green-7" @click="editarUsuario" :loading="loadingGuardar" />
          </q-card-actions>
          </div>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUsuariosStore } from '../stores/usuarios.js';
import { Notify } from 'quasar';


const useUsuarios = useUsuariosStore();


const changePasswordDialog = ref(false);
const editDialog = ref(false);
const photoDialog = ref(false);

const contraseñavieja = ref('');
const password = ref('');
const contraseñaviejaError = ref(false);
const contraseñanuevaError = ref(false);


const nom = ref(useUsuarios.usuarios.usuario.nombre);
const email = ref(useUsuarios.usuarios.usuario.email);
const id = ref(useUsuarios.usuarios.usuario._id);
const nomError = ref(false);
const emailError = ref(false);


const newPhoto = ref(null);
const avatarUrl = ref('');
const coverPhoto = ref('https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80');

// Variables de control
const loadingGuardar = ref(false);
const loadingPhoto = ref(false);
const router = useRouter();

onMounted(async () => {
  try {
    avatarUrl.value =   useUsuarios.usuarios.usuario.avatar|| 'https://as1.ftcdn.net/v2/jpg/01/12/09/12/1000_F_112091233_xghsriqmHzk4sq71lWBL4q0e7n9QJKX6.jpg';
  } catch (error) {
    console.error('Error al obtener el avatar del usuario:', error);
    avatarUrl.value = 'https://as1.ftcdn.net/v2/jpg/01/12/09/12/1000_F_112091233_xghsriqmHzk4sq71lWBL4q0e7n9QJKX6.jpg';
  }
});


const formatDate = (date) => {
  const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, opciones);
};

const displayEstado = (estado) => {
  return estado === 1 ? 'Activo' : 'Desactivado';
};

const statusIcon = (estado) => {
  return estado === 1 ? 'check_circle' : 'cancel';
};

const statusColor = (estado) => {
  return estado === 1 ? 'positive' : 'negative';
};

// Funciones para abrir diálogos
const openChangePasswordDialog = () => {
  changePasswordDialog.value = true;
};

const openEditDialog = () => {
  editDialog.value = true;
};

const openPhotoDialog = () => {
  photoDialog.value = true;
};

// Funciones para cerrar diálogos
const cerrarChangePasswordDialog = () => {
  changePasswordDialog.value = false;
  contraseñavieja.value = '';
  password.value = '';
  contraseñaviejaError.value = false;
  contraseñanuevaError.value = false;
};

const cerrarEditDialog = () => {
  editDialog.value = false;
  nom.value = useUsuarios.usuarios.usuario.nombre;
  email.value = useUsuarios.usuarios.usuario.email;
  nomError.value = false;
  emailError.value = false;
};

const cerrarPhotoDialog = () => {
  photoDialog.value = false;
  newPhoto.value = null;
};

const updatePhoto = async () => {
  if (newPhoto.value) {
    try {
      loadingPhoto.value = true;
      const formData = new FormData();
      formData.append('archivo', newPhoto.value); 
      const response = await useUsuarios.cargarcould(id.value, formData);
      if (response.data && response.data.url) {
        avatarUrl.value = response.data.url;
        Notify.create({
          color: 'positive',
          message: 'Foto de perfil actualizada con éxito.',
          icon: 'check_circle',
        });
        photoDialog.value = false;
      } else {
        throw new Error('No se recibió la URL del avatar actualizado');
      }
    } catch (error) {
      console.error('Error al actualizar la foto de perfil:', error);
      Notify.create({
        color: 'negative',
        message: 'Error al actualizar la foto de perfil: ' + (error.response?.data?.error || error.message),
        icon: 'error',
      });
    } finally {
      loadingPhoto.value = false;
    }
  }
};


const restablecerContraseña = async () => {
  contraseñaviejaError.value = !contraseñavieja.value;
  contraseñanuevaError.value = !password.value;

  if (contraseñaviejaError.value || contraseñanuevaError.value) {
    Notify.create({
      color: 'negative',
      message: 'Por favor, complete todos los campos requeridos.',
      icon: 'error',
      timeout: 2500,
    });
    return;
  }

  try {
    loadingGuardar.value = true;
    await useUsuarios.cambiarPassword(id.value, contraseñavieja.value, password.value);
    Notify.create({
      color: 'positive',
      message: 'Contraseña cambiada con éxito.',
      icon: 'check_circle',
      timeout: 2500,
    });
    cerrarChangePasswordDialog();
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    Notify.create({
      color: 'negative',
      message: 'Error al cambiar la contraseña. Verifica la contraseña antigua.',
      icon: 'error',
      timeout: 2500,
    });
  } finally {
    loadingGuardar.value = false;
  }
};


const editarUsuario = async () => {
  nomError.value = !nom.value;
  emailError.value = !email.value || !validateEmail(email.value);
  if (nomError.value || emailError.value) {
    Notify.create({
      color: 'negative',
      message: 'Por favor, complete todos los campos requeridos correctamente.',
      icon: 'error',
      timeout: 2500,
    });
    return;
  }
  try {
    loadingGuardar.value = true;
    await useUsuarios.editarUsuario(id.value, email.value, nom.value);
    Notify.create({
      color: 'positive',
      message: 'Perfil actualizado con éxito.',
      icon: 'check_circle',
      timeout: 2500,
    });
    cerrarEditDialog();
  } catch (error) {
    console.error('Error al editar el perfil:', error);
    Notify.create({
      color: 'negative',
      message: 'Error al actualizar el perfil.',
      icon: 'error',
      timeout: 2500,
    });
  } finally {
    loadingGuardar.value = false;
  }
};

// Función para validar email
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};


const openSocialLink = (platform) => {
  const urls = {
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
  };
  window.open(urls[platform], '_blank');
};


const Salir = () => {
  router.replace('/home');
};

</script>

<style scoped>
.perfilcompleto {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #e4fff6;
  padding: 20px;
}

#atras {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background-color: rgb(8, 73, 55);
  color: white;
  margin-left: 3%;
  margin-bottom: 0px;
  margin-top: 4%;
  position: fixed;
}

.back-button {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 10;
}

.profile-container {
  width: 100%;
  max-width: 600px;
  padding-top: 30px;
  padding-bottom: 150px;
}

.profile-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.profile-header {
  position: relative;
  height: 200px;
}

.profile-cover {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.profile-avatar {
  position: absolute;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid white;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-edit {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 5px;
  border-radius: 50%;
  cursor: pointer;
}

.profile-name {
  margin-top: 70px;
  font-size: 28px;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-bottom: 0px;
}

.profile-title {
  font-size: 18px;
  color: #777;
  margin-bottom: 20px;
  text-align: center;
}

.profile-info {
  padding: 0 20px;
}

.profile-info p {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
  font-size: 16px;
}

.profile-info .q-icon {
  margin-right: 10px;
  font-size: 20px;
}

.profile-actions {
  margin: 20px 0;
  display: flex;
  justify-content: center;
  margin-top: 50px;
  margin-bottom: 50px;
}

.profile-actions .q-btn {
  margin: 0 10px;
}

.social-links {
  margin-top: 20px;
  padding-bottom: 20px;
  text-align: center;
}

.social-links p {
  margin-bottom: 10px;
  font-weight: bold;
  color: #555;
}

.social-links .q-btn {
  margin: 0 5px;
}

.modal-card {
  max-width: 400px;
  width: 100%;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  background-color: #f8f9fa;
}



.modal-header {
  background-color: #2F7D32;
  color: white;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  padding: 16px;
  font-weight: bold !important;
  font-size: 18px;
  text-align: center;
}

.modal-body {
  padding: 35px;
}

.modal-footer {
  padding: 16px;
  background-color: #f1f1f1;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
}

/* Estilos responsivos */
@media (max-width: 600px) {
  .profile-header {
    height: 150px;
  }

  .profile-avatar {
    width: 100px;
    height: 100px;
    bottom: -50px;
  }

  .profile-name {
    margin-top: 60px;
    font-size: 24px;
  }

  .profile-title {
    font-size: 16px;
  }

  .profile-info p {
    font-size: 14px;
  }
  
}
</style>