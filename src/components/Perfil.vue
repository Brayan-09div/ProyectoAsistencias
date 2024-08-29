<template>
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
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  // Datos simulados, en un caso real, estos vendrían de una API
  const user = ref({
    name: 'John Doe', // Esto vendría de la base de datos
    role: 'Instructor', // Puede ser "Aprendiz" o "Instructor"
    email: 'john.doe@example.com',
    password: '12345678', // Contraseña original (en un caso real, nunca deberías exponerla así)
    photo: 'https://via.placeholder.com/100'
  })
  
  const encryptedPassword = ref('')
  
  // Función para simular la encriptación de la contraseña
  function encryptPassword(password) {
    // Simula la encriptación, en la realidad usarías una librería de encriptación
    return btoa(password)
  }
  
  // Simula la obtención de datos del usuario
  onMounted(() => {
    // Simula la encriptación de la contraseña
    encryptedPassword.value = encryptPassword(user.value.password)
  })
  
  // Función para manejar el clic en el enlace de restablecimiento de contraseña
  function resetPassword() {
    alert('Link de restablecimiento de contraseña enviado a tu correo.')
    // Aquí podrías redirigir al usuario a una página de restablecimiento de contraseña
  }
  </script>
  
  <style scoped>
  /* General page styling */
  .profile-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
  }
  
  /* Profile card styling */
  .profile-card {
    background-color: #ffffff;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 100%;
    max-width: 400px;
  }
  
  /* Avatar styling */
  .profile-avatar img {
    border-radius: 50%;
    width: 100px;
    height: 100px;
  }
  
  /* Name styling */
  .profile-name {
    font-size: 24px;
    font-weight: 600;
    margin: 15px 0 5px;
    color: #333;
  }
  
  /* Title styling */
  .profile-title {
    font-size: 16px;
    color: #888;
    margin-bottom: 20px;
  }
  
  /* Info styling */
  .profile-info p {
    font-size: 14px;
    color: #555;
    margin: 5px 0;
  }
  
  .profile-info i {
    margin-right: 10px;
    color: #888;
  }
  
  /* Reset link styling */
  .reset-link {
    display: inline-block;
    margin-top: 20px;
    color: #007bff;
    text-decoration: none;
    font-size: 14px;
  }
  
  .reset-link:hover {
    text-decoration: underline;
  }
  </style>
  