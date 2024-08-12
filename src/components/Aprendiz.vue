<template>
    <div>
        <div style="margin: 10px;">
            <div style="display:flex; justify-content: end;">
                <q-btn @click="fixed = true" color="primary">Agregar Aprendiz</q-btn>
            </div>
            <q-table title="Aprendiz" :rows="rows" :columns="columns" row-key="name">
                <template v-slot:body-cell-opciones="props">
                    <q-td :props="props">
                        <q-btn @click="traerDatos(props.row)" color="primary">📝</q-btn>
                        <q-btn @click="ides(props.row._id)">🗑️</q-btn>
                        <q-btn @click="activar(props.row._id)" v-if="props.row.estado == 0">✅</q-btn>
                        <q-btn @click="activar(props.row._id)" v-else>❌</q-btn>
                    </q-td>
                </template>
                <template v-slot:body-cell-estado1="props">
                    <q-td :props="props">
                        <p style="color:green" v-if="props.row.estado == 1">Activo</p>
                        <p style="color:red" v-else>Inactivo</p>
                    </q-td>
                </template>
            </q-table>
            <q-dialog v-model="fixed" :backdrop-filter="'blur(4px) saturate(150%)'" transition-show="rotate"
                transition-hide="rotate" persistent>
                <q-card>
                    <q-card-section>
                        <div class="text-h6">{{ b == true ? "Editar Aprendiz" : "Guardar Aprendiz" }}</div>
                    </q-card-section>

                    <q-separator />

                    <q-card-section style="max-height: 50vh" class="scroll">
                        <q-input filled v-model="nom" label="Nombre Del Aprendiz" :dense="dense" />
                        <q-input filled v-model="cc" label="CC" :dense="dense" />
                        <q-select rounded outlined v-model="IdFicha" use-input hide-selected fill-input input-debounce="0"
                            :options="options" @filter="filterFn" label="Selecciona una ficha">
                            <template v-slot:no-option>
                                <q-item>
                                    <q-item-section class="text-grey">
                                        Sin resultados
                                    </q-item-section>
                                </q-item>
                            </template>
                        </q-select>
                        <q-input type="email" filled v-model="email" label="Email del Aprendiz" :dense="dense" />
                        <q-input filled v-model="telefono" label="Telefono Del Aprendiz" :dense="dense" />
                    </q-card-section>

                    <q-separator />

                    <q-card-actions align="right">
                        <q-btn flat label="Cerar" color="primary" v-close-popup @click="cerar()" />
                        <q-btn flat label="Guardar" color="primary" @click="crearAprendiz()" />
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
                        <q-btn @click="eliminarAprendiz()" flat label="Aceptar" color="primary" v-close-popup />
                    </q-card-actions>
                </q-card>
            </q-dialog>
            <div style="display:flex; justify-content: end;">
                <q-btn @click="fixed = true" color="primary">Agregar Aprendiz</q-btn>
            </div>
            <q-toggle v-model="isDark" label="Modo Oscuro" />
        </div>
    </div>
</template>

<script setup>
import { onBeforeMount, ref, watch } from "vue";
import { Notify } from 'quasar'
import { useQuasar } from 'quasar'
import { useAprendizStore } from "../stores/aprendiz.js"
import { useFichaStore } from '../stores/fichas.js';
import { Dark } from 'quasar'

const useAprendiz = useAprendizStore()
const useFicha = useFichaStore();

const $q = useQuasar()
let confirm = ref(false)
let r = ref("")
let fixed = ref(false)
let nom = ref("")
let cc = ref("")
let IdFicha = ref("")
let email = ref("")
let telefono = ref("")
let error = ref("")
let b = ref(false)
let id = ref("")
let fichas =ref([])
let options = ref(fichas.value)
let dates = ref({})
let ccOriginal = ref("")
let emailOriginal = ref("")
const isDark = ref(Dark.isActive);
watch(isDark, (val) => {
    Dark.set(val);
});


const rows = ref([])

onBeforeMount(() => {
    traer()

})

function ides(ids) {
    id.value = ids
    confirm.value = true
}

function filterFn(val, update, abort) {
    update(() => {
        const needle = val.toLowerCase();
        options.value = fichas.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    });
};
 
async function traer() {
    let res = await useAprendiz.listarAprendiz();
    let ris = await useFicha.listarFichas();
    ris.data.forEach(item => {
        dates.value={
            label: item.nombre,
            value: item._id
        }
        fichas.value.push(dates.value)
    });
    rows.value = res.data
}



function traerDatos(datos) {
    console.log(datos);
    id.value = datos._id
    fixed.value = true
    b.value = true
    nom.value = datos.nombre
    cc.value = datos.cc
    email.value = datos.email
    telefono.value = datos.telefono
    IdFicha.value = { 
        label: datos.IdFicha.nombre,
        value: datos.IdFicha._id
    }
    ccOriginal.value = datos.cc
    emailOriginal.value = datos.email
}

function cerar() {
    b.value = false
    num.value = ""
    cod.value = ""
}

async function activar(id) {
    let res = await useAprendiz.activarDesactivarAprendiz(id)
    await traer()
}

async function crearAprendiz() {
    if (b.value == true) {
        const res = await editarAprendiz(id)
        if (res?.response?.data?.errors) {
            fixed.value = true
        } else {
            await traer()
            fixed.value = false
        }
    } else {
        let res = await useAprendiz.guardarAprendis(cc.value, nom.value, email.value, telefono.value, IdFicha.value.value)
        if (res?.response?.data?.errors) {
            fixed.value = true
        } else {
            await traer()
            fixed.value = false
        }
    }
}

async function editarAprendiz() {
    const datosActualizados = {};

    if (cc.value !== ccOriginal.value) {
        datosActualizados.cc = cc.value;
    }
    if (email.value !== emailOriginal.value) {
        datosActualizados.email = email.value;
    }
    if (nom.value) {
        datosActualizados.nombre = nom.value;
    }
    if (telefono.value) {
        datosActualizados.telefono = telefono.value;
    }
    if (IdFicha.value) {
        datosActualizados.IdFicha = IdFicha.value.value;
    }
    let res = await useAprendiz.editarAprendiz(id.value, datosActualizados);
    await traer();
    return res;
}

async function eliminarAprendiz() {
    let res = await useAprendiz.eliminarAprendiz(id.value)
    await traer()
    return res
}


const columns = ref([
    {
        name: 'nombre1', required: true, label: 'Nombre del Aprendiz',
        align: 'center',
        field: "nombre",
        sortable: true
    },
    { name: 'codigo1', align: 'center', label: 'Documento Del Aprendiz', field: 'cc', sortable: true },
    { name: 'email1', align: 'center', label: 'Email Del Aprendiz', field: 'email', sortable: true },
    { name: 'telefono1', align: 'center', label: 'Telefono Del Aprendiz', field: 'telefono', sortable: true },
    { name: 'IdFicha1', align: 'center', label: 'Numero De Ficha', field: (row) => row?.IdFicha?.codigo, sortable: true },
    { name: 'IdFicha1', align: 'center', label: 'Numero De Ficha', field: (row) => row?.IdFicha?.nombre, sortable: true },
    { name: 'estado1', align: 'center', label: 'Estado', field: 'estado', sortable: true },
    { name: 'opciones', label: 'Opciones', align: 'center' },
])






</script>

<style scoped></style>