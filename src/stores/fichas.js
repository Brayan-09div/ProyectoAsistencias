import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { Notify } from "quasar";
import { useUsuariosStore } from "../stores/usuarios.js"

export const useFichaStore = defineStore("ficha", () => {
  const useUsuarios = useUsuariosStore()
  const listarFichas = async () => {
    try {
      let r = await axios.get("/Fichas/listar", {
        headers: {
          "x-token": useUsuarios.xtoken,
        },
      });
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
        `/Fichas/activarDesactivar/${id}`, {}, 
        {
          headers: {
            "x-token": useUsuarios.xtoken, 
          },
        }
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
      let r = await axios.post(
        "/Fichas",
        {
          codigo: cod,
          nombre: nom,
        },
        {
          headers: {
            "x-token": useUsuarios.xtoken,
          },
        }
      );
      console.log(r);
      Notify.create({
        color: "positive",
        message: "Registro exitoso",
        icon: "check_circle",
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
        { codigo: cod, nombre: nom }, {
          headers: {
            "x-token": useUsuarios.xtoken,
          },
        }
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

  const eliminar = async (id) => {
    try {
      let r = await axios.delete(`/Fichas/eliminar/${id}`, {
        headers: {
          "x-token": useUsuarios.xtoken,
        },
      });
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
    guardarFicha,
    activarDesactivarFichas,
    editarFicha,
    eliminar
  };
}, { persist: true });
