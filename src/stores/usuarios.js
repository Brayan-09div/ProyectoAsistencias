import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { Notify } from "quasar";

export const useUsuariosStore = defineStore("usuario", () => {
    let xtoken = ref("");
    let usuarios = ref("")
    let loading = ref("")
    const loguin = async (email, password)=>{
      try {
          let r = await axios.post("/Usuarios/login", {
            email: email,
            password: password,
          });
          xtoken.value = r.data.token;
          usuarios.value=r.data
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
    const guardarUsuario = async (emial, nom,  password) => {
      try {
        let r = await axios.post(
          "/Usuarios",
          {
            email: emial,
            nombre: nom,
            password:  password
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

    const listarUsuarios = async () => {
        try {
          let r = await axios.get("/Usuarios/listar",  {
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
            { email: emial,
              nombre: nom
            },{
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

      const activarDesactivarUsuario = async (id) => {
        try {
          if(id !== usuarios.value.usuario._id){
          let r = await axios.put(
            `/Usuarios/activarDesactivar/${id}`, {}, 
            {
              headers: {
                "x-token": xtoken.value, 
              },
            }
          );
          console.log(r);
          return r;
        }else{console.log("tonoto");
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
      }
  
      
      

      const logout = async ()=>{
        xtoken.value = ""
      }

    return {
        guardarUsuario,
        listarUsuarios,
        editarUsuario,
        activarDesactivarUsuario,
        eliminar,
        loguin,
        logout,
        xtoken,
        usuarios 
    };

  },{ persist : true});
  