import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { Notify } from "quasar";

export const useUsuariosStore = defineStore("usuario", () => {
    let xtoken = ref("");
    const listarUsuarios = async () => {
        try {
          let r = await axios.get("/Usuarios/listar");
          console.log(r);
          return r;
        } catch (error) {
          console.log(error);
          return error;
        }
      };

      const loguin = async (email, password)=>{
        try {
            let r = await axios.post("/usuarios/login", {
              email: email,
              password: password,
            });
            xtoken.value = r.data.token;
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
      }

      const logout = async ()=>{
        xtoken.value = ""
      }

    return {
      
        listarUsuarios,
        loguin,
        logout,
        xtoken
    };

  },{ persist : true});
  