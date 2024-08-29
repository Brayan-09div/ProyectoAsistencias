<template>
  <div class="form-container">
    <form @submit.prevent="crearBitacora">
      <label for="cc">Número de Identificación:</label>
      <input type="text" id="cc" v-model="cc" required>
      <button type="submit">Aceptar</button>
    </form>
  </div>
</template>
  
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useBitacoraStore } from '../stores/bitacoras.js'; 

const useBitacora = useBitacoraStore();
const cc = ref('');
const router = useRouter();

const crearBitacora = async () => {
  if (cc.value) {
    try {
      await useBitacora.crearBitacora(cc.value);
      cc.value = '';
    } catch (error) {
      console.error('Error al crear la bitácora:', error);
     
    }
  } else {
    console.error("El campo CC es obligatorio");
  }
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

