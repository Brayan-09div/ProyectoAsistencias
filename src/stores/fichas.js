import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { Notify } from "quasar";



export const useFichaStore = defineStore("ficha", () => {
  let token = ref("");
  const listarFichas = async () => {
    try {
      let r = await axios.get("/Fichas/listar");
      console.log(r);
      return r;
    } catch (error) {
      console.log(error);
      return error;
    }
  };
  const activarDesactivarFichas = async (id) => {
    console.log(id);
    try {
      let r = await axios.put(
        `/Fichas/activarDesactivar/${id}`
      );
      console.log(r);
      return r;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const guardarFicha = async (cod, nom) => {
    try {
      let r = await axios.post("/Fichas", {
        codigo: cod,
        nombre: nom,
      });
      console.log(r);
      Notify.create({
        color: "positive",
        message: "Registro exitoso",
        icon: "error",
        timeout: 2500,
      });
      return r;
    } catch (error) {
      console.log(error);
      Notify.create({
        color: "negative",
        message: error.response.data.errors[0].msg,
        icon: "error",
        timeout: 2500,
      });

      return error;
    }
  };

  const editarFicha = async (id, cod, nom) => {
    console.log(id);
    try {
      let r = await axios.put(
        `/Fichas/editar/${id}`,
        { codigo: cod, nombre: nom }
      );
      console.log(r);
      Notify.create({
        color: "positive",
        message: "Edición exitosa",
        icon: "error",
        timeout: 2500,
      });
      return r;
    } catch (error) {
      console.log(error);
      Notify.create({
        color: "negative",
        message: error.response.data.errors[0].msg,
        icon: "error",
        timeout: 2500,
      });
      return error;
    }
  }

  const eliminar = async (id) =>{
    try {
      let r = await axios.delete(`/Fichas/eliminar/${id}`);
      console.log(r);
      Notify.create({
        color: "positive",
        message: "Eliminación exitosa",
        icon: "error",
        timeout: 2500,
      });
      return r;
    } catch (error) {
      console.log(error);
      Notify.create({
        color: "negative",
        message: error.response.data.errors[0].msg,
        icon: "error",
        timeout: 2500,
      });
      return error;
    }
  }

  return {
    listarFichas,
    token,
    guardarFicha,
    activarDesactivarFichas,
    editarFicha,
    eliminar
  };
},{ persist : true}   );
