import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { Notify } from "quasar";

export const useUsuariosStore = defineStore(
  "usuario",
  () => {
    let xtoken = ref("");
    let usuarios = ref("");
    let loading = ref("");
    const loguin = async (email, password) => {
      try {
        let r = await axios.post("/Usuarios/login", {
          email: email,
          password: password,
        });
        xtoken.value = r.data.token;
        usuarios.value = r.data;
        Notify.create({
          type: "positive",
          message: "Loguin exitoso",
        });
        return r;
      } catch (error) {
        console.log(error);
        Notify.create({
          type: "negative",
          message: "Error al iniciar sesión",
        });
        return error;
      }
    };
    const guardarUsuario = async (emial, nom, password) => {
      try {
        let r = await axios.post(
          "/Usuarios",
          {
            email: emial,
            nombre: nom,
            password: password,
          },
          {
            headers: {
              "x-token": xtoken.value,
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

    
  const cargarcould = async (id, formData) =>{
      try {
        const response = await axios.put(`/Usuarios/cargarCloud/${id}`, formData, {
          headers: {
            "x-token": xtoken.value,
            "Content-Type": "multipart/form-data",
          },
        });
      
        if (response.data && response.data.usuario) {
          response.data.usuario;
        }
        return response;
      } catch (error) {
        console.error('Error al cargar el archivo:', error);
        throw error;
      }
    }

  const updatecoul = async (id) => {
      try {
          let r = await axios.put(
              `/Usuarios/cargarcould/${id}`,{
                  headers: {
                      "x-token": xtoken.value, 
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


    const listarUsuarios = async () => {
      try {
        let r = await axios.get("/Usuarios/listar", {
          headers: {
            "x-token": xtoken.value,
          },
        });
        console.log(r);
        return r;
      } catch (error) {
        console.log(error);
        return error;
      }
    };


    const editarUsuario = async (id, emial, nom) => {
      console.log(id);
      try {
        let r = await axios.put(
          `/Usuarios/editar/${id}`,
          { email: emial, nombre: nom },
          {
            headers: {
              "x-token": xtoken.value,
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
    };
    
    const cambiarPassword = async (id, contraseñavieja, password) => {
      try {
        let r = await axios.put(
          `/Usuarios/cambiarContrasena/${id}`,
          { contraseñavieja: contraseñavieja, password: password },
          {
            headers: {
              "x-token": xtoken.value,
            },
          }
        );
        Notify.create({
          color: "positive",
          message: "Contraseña cambiada exitosamente",
          icon: "check_circle",
          timeout: 2500,
        });
        return r;
      } catch (error) {
        Notify.create({
          color: "negative",
          message: error.response.data.errors[0].msg || "Error al cambiar la contraseña",
          icon: "error",
          timeout: 2500,
        });
        return error;
      }
    };
    

    const activarDesactivarUsuario = async (id) => {
      try {
        if (id !== usuarios.value.usuario._id) {
          let r = await axios.put(
            `/Usuarios/activarDesactivar/${id}`,
            {},
            {
              headers: {
                "x-token": xtoken.value,
              },
            }
          );
          console.log(r);
          return r;
        } else {
          console.log("tonoto");
        }
      } catch (error) {
        console.log(error);
        return error;
      }
    };
    const eliminar = async (id) => {
      try {
        let r = await axios.delete(`/Usuarios/eliminar/${id}`, {
          headers: {
            "x-token": xtoken.value,
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
    };

    const solicitarRecuperacion = async (email) => {
      try {
        let r = await axios.post("/Usuarios/recuperarpassword", 
          { email : email });
        Notify.create({
          color: "positive",
          message: "Enlace de recuperación enviado, revisa tu correo.",
          icon: "check_circle",
          timeout: 2500,
        });
        return r;
      } catch (error) {
        console.log(error);
        Notify.create({
          color: "negative",
          message:
            error.response.data.errors[0].msg ||
            "Error al solicitar recuperación.",
          icon: "error",
          timeout: 2500,
        });
        return error;
      }
    };

    const restablecerContrasena = async (email, password) => {
      try {
        let r = await axios.put(`Usuarios/cambiarContrasenaEmail`, {
          password: password,
          email: email,
        });
        Notify.create({
          color: "positive",
          message: "Contraseña restablecida con éxito.",
          icon: "check_circle",
          timeout: 2500,
        });
        return r; 
      } catch (error) {
        console.error(error); 
        Notify.create({
          color: "negative",
          message:
            (error.response?.data?.errors?.[0]?.msg || 
            "Error al restablecer la contraseña."),
          icon: "error",
          timeout: 2500,
        });
        return error; 
      }
    };

    const logout = async () => {
      xtoken.value = "";
    };

    return {
      guardarUsuario,
      listarUsuarios,
      editarUsuario,
      activarDesactivarUsuario,
      eliminar,
      loguin,
      logout,
      solicitarRecuperacion,
      restablecerContrasena,
      cambiarPassword,
      updatecoul,
      cargarcould,
      xtoken,
      usuarios,
    };
  },
  { persist: true }
);
