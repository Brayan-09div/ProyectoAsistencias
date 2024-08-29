<template>
  <div class="perfilcompleto">
    <button id="atras" @click="Salir()">
      <span class="material-symbols-outlined">arrow_back</span>
    </button>
    <div class="profile-container">
      <div class="profile-card">
        <div class="profile-avatar">
          <img :src="user.photo" alt="User Avatar" />
        </div>
        <h2 class="profile-name">{{ user.name }}</h2>
        <p class="profile-title">{{ user.role }}</p>
        <div class="profile-info">
          <p><i class="fas fa-envelope"></i> {{ user.email }}</p>
          <p><i class="fas fa-lock"></i> {{ encryptedPassword }}</p>
        </div>
        <a href="#" @click.prevent="resetPassword" class="reset-link">
          ¿Olvidaste tu contraseña?
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const user = ref({
  name: 'John Doe', 
  role: 'Instructor', 
  email: 'john.doe@example.com',
  password: '12345678', 
  photo: 'https://via.placeholder.com/100'
})

const encryptedPassword = ref('')

function encryptPassword(password) {
  return btoa(password)
}

onMounted(() => {
  encryptedPassword.value = encryptPassword(user.value.password)
})

function resetPassword() {
  alert('Link de restablecimiento de contraseña enviado a tu correo.')
}

const router = useRouter()
const Salir = async () => {
  router.replace("/home")
}
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
