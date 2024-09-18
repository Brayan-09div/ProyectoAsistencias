import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { useUsuariosStore } from "../stores/usuarios.js";
import { ref } from "vue";

export const useBitacoraStore = defineStore("bitacora", () => {
  const useUsuarios = useUsuariosStore();
  let bitacoras = ref({})

  const crearBitacora = async (cc) => {
    try {
      const r = await axios.post(
        "/Bitacoras/",
        { cc },
        {
          headers: {
            "x-token": useUsuarios.xtoken,
          },
        }
      );
      Notify.create({
        type: "positive",
        message: "Bitácora creada correctamente",
      });
      return r.data;
    } catch (error) {
      console.log(error);
      Notify.create({
        type: "negative",
        message: "Hubo un error al crear la bitácora",
      });
      return error;
    }
  };

  // Listar todas las bitácoras
  const listarBitacoras = async () => {
    try {
      let r = await axios.get("/Bitacoras/listar", {
        headers: {
          "x-token": useUsuarios.xtoken,
        },
      });
      console.log(r);
      return r.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  };
  const listarBitacorasFechaUnica = async (fecha) => {
    try {
      let r = await axios.get(`/Bitacoras/ListarFecha/${fecha}`, {
        headers: {
          "x-token": useUsuarios.xtoken,
        },
      });
      console.log(r);
      return r.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const listarBitacorasFecha = async (fechaInicio,fechaFin) => {
    try {
      let r = await axios.get(`/Bitacoras/ListarFechas/${fechaInicio}/${fechaFin}`, {
        headers: {
          "x-token": useUsuarios.xtoken,
        },
      });
      console.log(r);
      return r.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const listarBitacorasFicha = async (IdFicha)=>{
    try {
      let r = await axios.get(`/Bitacoras/ListarFicha/${IdFicha}`, {
        headers: {
          "x-token": useUsuarios.xtoken,
        },
      });
      console.log(r);
      return r.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const listarBitacorasAprendiz = async (idAprendis) => {
    try {
      let r = await axios.get(`/Bitacoras/ListarAprendis/${idAprendis}`, {
        headers: {
          "x-token": useUsuarios.xtoken,
        },
      });
      console.log(r);
      return r.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const listarBitacoraFechaFicha = async (IdFicha, fecha) => {
    try {
      let r = await axios.get(`/Bitacoras/ListarFichaFecha/${IdFicha}/${fecha}`, {
        headers: {
          "x-token": useUsuarios.xtoken,
        },
      });
      bitacoras.value.data=r.data;
      bitacoras.value.fecha = fecha;
      bitacoras.value.IdFicha = IdFicha;
      console.log(bitacoras);
      return r.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const cambiaEstado = async (Id, nuevoEstado) => {
    try {
      const response = await axios.put(
        `/Bitacoras/ActualizarEstado/${Id}`, 
        { estado: nuevoEstado },
        {
          headers: {
            "x-token": useUsuarios.xtoken,
          },
        }
      );
      Notify.create({
        type: "positive",
        message: "Estado de la bitácora actualizado correctamente",
      });
      return response.data;
    } catch (error) {
      console.log(error);
      Notify.create({
        type: "negative",
        message: "Hubo un error al actualizar el estado de la bitácora",
      });
      return error;
    }
  };

  return {
    crearBitacora,
    listarBitacoras,
    listarBitacorasFecha,
    listarBitacorasFicha,
    listarBitacorasAprendiz,
    listarBitacorasFechaUnica,
    listarBitacoraFechaFicha,
    cambiaEstado,
    bitacoras,
  };
});
