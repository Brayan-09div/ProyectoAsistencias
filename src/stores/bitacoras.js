import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { useUsuariosStore } from "../stores/usuarios.js";

export const useBitacoraStore = defineStore("bitacora", () => {
  const useUsuarios = useUsuariosStore();

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

  const actulizarEstado = async (id, estado) => {
    try {
      let r = await axios.put(
        `/Bitacoras/ActualizarEstado/${id}`,
        { estado },
        {
          headers: {
            "x-token": useUsuarios.xtoken,
          },
        }
      );
      console.log(r);
      Notify.create({
        type: "positive",
        message: "Bitácora actualizada correctamente",
      });
      return r.data;
    } catch (error) {
      console.log(error);
      Notify.create({
        type: "negative",
        message: "Hubo un error al actualizar la bitácora",
      });
    }
  };


  return {
    crearBitacora,
    listarBitacoras,
    actulizarEstado,
    listarBitacorasFecha,
    listarBitacorasFicha,
    listarBitacorasAprendiz,
    listarBitacorasFechaUnica,
  };
});
