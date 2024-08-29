<template>
  <button id="atras" @click="Salir()"><span class="material-symbols-outlined">arrow_back</span></button>
  <div class="form-container">
    <form>
      <label for="cc">Número de Identificación:</label>
      <input type="text" id="cc" v-model="ccNumber" />
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
  router.replace("/home");
};
</script>

<style scoped>
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f7f9fc; 
}

.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #248639, #A9A9A9);
  padding: 20px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  background-color: #ffffff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
}

label {
  font-weight: bold;
  color: #4CAF50;
  margin-bottom: 10px;
  font-size: 18px;
}

input {
  width: 100%;
  padding: 12px;
  border: 2px solid #4CAF50;
  border-radius: 5px;
  margin-bottom: 20px;
  font-size: 16px;
}

button {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 5px;
  background-color: #4CAF50;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #388E3C;
}

#atras {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.15);
}

#atras span {
  font-size: 24px;
}
</style>
