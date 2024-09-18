import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { Notify } from "quasar";
import { useUsuariosStore } from "../stores/usuarios.js"



export const useAprendizStore = defineStore("Aprendiz", () => {
    const useUsuarios = useUsuariosStore()
    
    const store = ref("store");
    const listarAprendiz = async () => {
        try {
            let r = await axios.get("/Aprendices/Listar", {
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

    const activarDesactivarAprendiz = async (id) => {
        console.log(id);
        try {
          let r = await axios.put(
            `/Aprendices/activarDesactivar/${id}`, 
          {},
            {
              headers: {
                "x-token": useUsuarios.xtoken, 
              },
            }
          );
          console.log(r);
          return r;
        } catch (error) {
          return error;
        }
      };
      

    const guardarAprendis = async (cc, nom, email, telefono, IdFicha, firmaVirtual) => {
        try {
            let r = await axios.post(
                "/Aprendices",
                {
                    cc: cc,
                    nombre: nom,
                    email: email,
                    telefono: telefono,
                    IdFicha: IdFicha,
                    firmaVirtual: firmaVirtual
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
                message: error.response?.data?.errors[0]?.msg || "Error desconocido",
                icon: "error",
                timeout: 2500,
            });
            return error;
        }
    };

    const cargarcould = async (id, formData) => {
        try {
          let r = await axios.put(`/Aprendices/cargarCloud/${id}`, formData, {
            headers: {
              "x-token": useUsuarios.xtoken,
              "Content-Type": "multipart/form-data",
            },
          });
          console.log(r);
          return r;
        } catch (error) {
          console.log(error);
          throw error; 
        }
      };

    const updatecoul = async (id) => {
        try {
            let r = await axios.put(
                `/Aprendices/cargarcould/${id}`,{
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
    }



    const editarAprendiz = async (id, data) => {
        console.log(id);
        try {
            let r = await axios.put(
                `/Aprendices/editar/${id}`,
                data,  {
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

    const eliminarAprendiz = async (id) => {
        try {
            let r = await axios.delete(`/Aprendices/eliminar/${id}`,  {
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
        listarAprendiz,
        eliminarAprendiz,
        guardarAprendis,
        editarAprendiz,
        activarDesactivarAprendiz,
        cargarcould,
        updatecoul,
        store,


    };
}, { persist: true });
