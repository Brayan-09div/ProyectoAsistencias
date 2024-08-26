import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { useUsuariosStore } from "../stores/usuarios.js";

export const useBitacoraStore = defineStore("bitacora", () => {
  const useUsuarios = useUsuariosStore();

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

  // Actualizar estado de una bitácora
  const actulizarEstado = async (id, estado) => {
    try {
      let r = await axios.put(
        `/Bitacoras/ActualizarEstado/${id}`,
        { estado }, // Enviamos el nuevo estado en el body
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

  const listarBitacorasPorFechas = async (fechaInicio, fechaFin) => {
    try {
      let response = await axios.get("/Bitacoras/ListarPorFechas", {
        params: { fechaInicio, fechaFin },
        headers: {
          "x-token": useUsuarios.xtoken,
        },
      });
      console.log(response);  // Verifica la respuesta completa
      return response;        // Devuelve la respuesta completa
    } catch (error) {
      console.log(error);
      return { data: [] };   // Devuelve un objeto con un array vacío en caso de error
    }
  };

  return {
    listarBitacoras,
    actulizarEstado,
    listarBitacorasPorFechas,
  };
});
