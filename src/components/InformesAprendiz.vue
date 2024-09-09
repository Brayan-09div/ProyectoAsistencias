<template>
    <div>
        <div id="en">
            <button id="atras" @click="Salir">
                <span class="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 id="programas">informes Aprendiz</h1>
        </div>


        <div>
            <q-select rounded outlined v-model="idAprendis" use-input hide-selected fill-input input-debounce="0"
                :options="optionsAprendiz" @filter="filterAprendiz" label="Selecciona un aprendiz">
                <template v-slot:no-option>
                    <q-item>
                        <q-item-section class="text-grey">
                            Sin resultados
                        </q-item-section>
                    </q-item>
                </template>
            </q-select>
            <button @click="listarBitacorasAprendiz()">listar Aprendiz</button>
        </div>
        <div style="margin: 0px;">
            <div class="tablafichas">
             
                <q-table :rows="rows" :columns="columns" row-key="_id">
                    <template v-slot:body-cell-estado="props">
                        <q-td :props="props">
                            <q-select v-model="props.row.estado" :options="['pendiente', 'asistió', 'faltó', 'excusa']"
                                @update:model-value="cambiarEstado(props.row._id, props.row.estado)" />
                        </q-td>
                    </template>
                </q-table>

                <q-dialog v-model="fixed" :backdrop-filter="'blur(4px) saturate(150%)'" transition-show="rotate"
                    transition-hide="rotate" persistent>
                    <q-card>
                        <q-card-section>
                            <div class="text-h6">Crear Bitácora</div>
                        </q-card-section>
                        <q-separator />
                        <q-card-section style="max-height: 50vh" class="scroll">
                            <q-input filled v-model="nom" label="Nombre Del Aprendiz" :dense="dense" />
                            <q-input filled v-model="cc" label="CC" :dense="dense" />
                            <q-input filled v-model="IdFicha" label="Id De La Ficha" :dense="dense" />
                            <q-input filled v-model="email" label="Email del Aprendiz" :dense="dense" />
                            <q-input filled v-model="telefono" label="Teléfono Del Aprendiz" :dense="dense" />
                        </q-card-section>
                        <q-separator />
                        <q-card-actions align="right">
                            <q-btn flat label="Cerrar" color="primary" v-close-popup @click="cerrar" />
                            <q-btn flat label="Guardar" color="primary" @click="crearBitacora" />
                        </q-card-actions>
                    </q-card>
                </q-dialog>

                <q-dialog v-model="confirm" persistent :backdrop-filter="'blur(4px) saturate(150%)'"
                    transition-show="rotate" transition-hide="rotate">
                    <q-card>
                        <q-card-section class="row items-center">
                            <span class="q-ml-sm">Seguro Quieres Eliminar La Ficha</span>
                        </q-card-section>
                        <q-card-actions align="right">
                            <q-btn flat label="Cancelar" color="primary" v-close-popup />
                            <q-btn @click="eliminarAprendiz" flat label="Aceptar" color="primary" v-close-popup />
                        </q-card-actions>
                    </q-card>
                </q-dialog>
                <q-toggle v-model="isDark" label="Modo Oscuro" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onBeforeMount, watch } from 'vue';
import { Dark, useQuasar } from 'quasar';
import { useBitacoraStore } from '../stores/bitacoras.js';
import { useAprendizStore } from "../stores/aprendiz.js";


const useBitacora = useBitacoraStore();
const useAprendiz = useAprendizStore();

const router = useRouter();
const $q = useQuasar();

const confirm = ref(false);
const fixed = ref(false);
const isDark = ref(Dark.isActive);

let fecha = ref("");

let fechaInicio = ref("");
let fechaFin = ref("");



let idAprendis = ref("");



let aprendiz = ref([]);
let optionsAprendiz = ref(aprendiz.value);



watch(isDark, val => Dark.set(val));


onBeforeMount(() => {
    traer();
});



function filterAprendiz(val, update, abort) {
    update(() => {
        const needle = val.toLowerCase();
        optionsAprendiz.value = aprendiz.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    });
}

const rows = ref([]);



async function traer() {
    const res = await useBitacora.listarBitacoras();
    let ros = await useAprendiz.listarAprendiz();
    aprendiz.value = ros.data.map(item => ({
        label: item.nombre,
        value: item._id
    }));

    rows.value = res.map(bitacora => {
        const fecha = new Date(bitacora.fecha);
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const año = fecha.getFullYear();
        bitacora.fecha = `${dia}/${mes}/${año}`;
        return bitacora;
    });
}
  
 



async function listarBitacorasAprendiz() {
    try {
        console.log(idAprendis.value);

        const res = await useBitacora.listarBitacorasAprendiz(idAprendis.value.value);


        if (!res?.response?.data?.errors) {
            rows.value = res.map(bitacora => {
                const fecha = new Date(bitacora.fecha);
                const dia = String(fecha.getDate()).padStart(2, '0');
                const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                const año = fecha.getFullYear();
                bitacora.fecha = `${dia}/${mes}/${año}`;
                return bitacora;
            });
            fixed.value = false;
        }
    } catch (error) {
        console.error('Error al listar bitácoras por aprendiz:', error);
        $q.notify({
            type: 'negative',
            message: 'Error al listar bitácoras por aprendiz.'
        });
    }
}


function cambiarEstado(id, nuevoEstado) {
    useBitacora.actulizarEstado(id, nuevoEstado)
        .then(() => {
            $q.notify({
                type: 'positive',
                message: 'Estado actualizado correctamente.'
            });
            listarBitacorasAprendiz();
        })
        .catch(error => {
            console.error('Error al cambiar estado:', error);
            $q.notify({
                type: 'negative',
                message: 'Error al cambiar estado.'
            });
        });
}
const columns = ref([
    { name: 'fecha', label: 'Fecha', field: 'fecha', align: 'center', sortable: true },
    { name: 'IdAprendiz', align: 'center', label: 'Nombre Aprendiz', field: row => row?.IdAprendis?.nombre, sortable: true },
    { name: 'IdAprendiz', align: 'center', label: 'Teléfono Aprendiz', field: row => row?.IdAprendis?.telefono, sortable: true },
    { name: 'IdAprendiz', align: 'center', label: 'Email Aprendiz', field: row => row?.IdAprendis?.email, sortable: true },
    { name: 'IdAprendiz', align: 'center', label: 'Cc', field: row => row?.IdAprendis?.cc, sortable: true },
    { name: 'nombreFicha', align: 'center', label: 'Nombre Ficha', field: row => row?.IdAprendis?.IdFicha?.nombre, sortable: true },
    { name: 'codigoFicha', align: 'center', label: 'Código Ficha', field: row => row?.IdAprendis?.IdFicha?.codigo, sortable: true },
    { name: 'estado', align: 'center', label: 'Estado', field: 'estado', sortable: true },
]);


function Salir() {
    router.push({ name: 'menu' });
}

function cerrar() {
    fixed.value = false;
}

</script>


<style scoped>
#en {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 40px;
}

#programas {
    font-size: 35px;
    font-weight: bold;
    text-align: center;
    flex-grow: 1;
}

#atras {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(8, 73, 55);
    color: white;
    margin-left: 25px;
    margin-top: 10px;
}

hr {
    width: 80%;
    border: 2px solid #2F7D32;
    margin: -20px auto 0;
}

.tablafichas {
    width: 80%;
    margin: 0 auto;
}

#agregarficha {
    margin: 30px auto 20px;
}
</style>