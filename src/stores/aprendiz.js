import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { Notify } from "quasar";



export const useAprendizStore = defineStore("Aprendiz", () => {
  
    const listarAprendiz = async () => {
        try {
            let r = await axios.get("http://localhost:4500/api/Aprendices/Listar");
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
                `http://localhost:4500/api/Fichas/activarDesactivar/${id}`
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
            let r = await axios.post("http://localhost:4500/api/Fichas", {
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
                `http://localhost:4500/api/Fichas/editar/${id}`,
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

    const eliminarAprendiz = async (id) => {
        try {
            let r = await axios.delete(`http://localhost:4500/api/Fichas/eliminar/${id}`);
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
     
    };
}, { persist: true });
