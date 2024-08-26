<template>
    <div class="form-container">
    
      <form>
        <label for="cc">Número de Identificación:</label>
        <input type="text" id="cc" v-model="ccNumber">
        <button type="submit">Aceptar</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import { ref } from 'vue';
  
  let ccNumber = ref("");
  const router = useRouter();
  
  const Salir = async () => {
    router.replace("/loguin");
  };
  </script>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; 
  background-color: #f0f0f0; 
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #4CAF50; 
  color: white;
  cursor: pointer;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

label {
  margin-bottom: 5px;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>

