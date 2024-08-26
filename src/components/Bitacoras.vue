<template>
  <div>
    <div id="en">
      <button id="atras" @click="Salir">
        <span class="material-symbols-outlined">arrow_back</span>
      </button>
      <h1 id="programas">Bitacoras</h1>
    </div>
    <hr />
    <div>
      <q-input filled v-model="fechaInicio" label="Fecha de Inicio" type="date" />
      <q-input filled v-model="fechaFin" label="Fecha de Fin" type="date" />
      <q-btn @click="filtrarPorFechas">Filtrar por Fechas</q-btn>
    </div>
    <div style="margin: 0px;">
      <div class="tablafichas">
        <q-btn id="agregarficha" @click="fixed = true" color="primary">
          <span class="material-symbols-outlined"></span>Crear
        </q-btn>
        <q-table :rows="rows" :columns="columns" row-key="_id">
          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <q-select
                v-model="props.row.estado"
                :options="['pendiente', 'asistió', 'faltó', 'excusa']"
                @update:model-value="cambiarEstado(props.row._id, props.row.estado)"
              />
            </q-td>
          </template>
        </q-table>

        <q-dialog v-model="fixed" :backdrop-filter="'blur(4px) saturate(150%)'" transition-show="rotate" transition-hide="rotate" persistent>
          <q-card>
            <q-card-section>
              <div class="text-h6">{{ b ? "Editar Ficha" : "Guardar Ficha" }}</div>
            </q-card-section>
            <q-separator />
            <q-card-section style="max-height: 50vh" class="scroll">
              <q-input filled v-model="nom" label="Nombre Del Aprendiz" :dense="dense" />
              <q-input filled v-model="cc" label="CC" :dense="dense" />
              <q-input filled v-model="IdFicha" label="Id De La Ficha" :dense="dense" />
              <q-input filled v-model="email" label="Email del Aprendiz" :dense="dense" />
              <q-input filled v-model="telefono" label="Telefono Del Aprendiz" :dense="dense" />
            </q-card-section>
            <q-separator />
            <q-card-actions align="right">
              <q-btn flat label="Cerrar" color="primary" v-close-popup @click="cerrar" />
              <q-btn flat label="Guardar" color="primary" @click="crearFicha" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog v-model="confirm" persistent :backdrop-filter="'blur(4px) saturate(150%)'" transition-show="rotate" transition-hide="rotate">
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

const useBitacora = useBitacoraStore();
const router = useRouter();
const $q = useQuasar();

const confirm = ref(false);
const fixed = ref(false);
const num = ref("");
const cod = ref("");
const b = ref(false);
const id = ref("");

const fechaInicio = ref('');
const fechaFin = ref('');

const isDark = ref(Dark.isActive);

watch(isDark, val => Dark.set(val));

const rows = ref([]);

onBeforeMount(traer);

async function traer() {
  try {
    const res = await useBitacora.listarBitacoras();
    console.log("Respuesta de la API:", res);  // Verifica la estructura de la respuesta
    if (res && Array.isArray(res.data)) {
      rows.value = res.data.map(bitacora => {
        const fecha = new Date(bitacora.fecha);
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const año = fecha.getFullYear();
        bitacora.fecha = `${dia}/${mes}/${año}`;
        return bitacora;
      });
    } else {
      console.error("La respuesta de la API no es válida o no es un array", res);
    }
  } catch (error) {
    console.error("Error al traer las bitácoras:", error);
  }
}
async function filtrarPorFechas() {
  try {
    const res = await useBitacora.listarBitacorasPorFechas(fechaInicio.value, fechaFin.value);
    if (res && Array.isArray(res.data)) {
      rows.value = res.data.map(bitacora => {
        const fecha = new Date(bitacora.fecha);
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const año = fecha.getFullYear();
        bitacora.fecha = `${dia}/${mes}/${año}`;
        return bitacora;
      });
    } else {
      console.error("La respuesta de la API no es válida o no es un array", res);
    }
  } catch (error) {
    console.error("Error al filtrar las bitácoras por fechas:", error);
  }
}

function ides(ids) {
  id.value = ids;
  confirm.value = true;
}

function traerDatos(datos) {
  id.value = datos._id;
  fixed.value = true;
  b.value = true;
  num.value = datos.nombre;
  cod.value = datos.codigo;
}

function cerrar() {
  b.value = false;
  num.value = "";
  cod.value = "";
}

async function crearFicha() {
  try {
    const res = b.value ? await editarFicha(id.value) : await useFicha.guardarFicha(cod.value, num.value);
    if (!res?.response?.data?.errors) {
      await traer();
      fixed.value = false;
    }
  } catch (error) {
    console.error("Error al crear o editar la ficha:", error);
  }
}

async function cambiarEstado(id, nuevoEstado) {
  try {
    await useBitacora.actulizarEstado(id, nuevoEstado);
    await traer();
  } catch (error) {
    console.error("Error al cambiar el estado:", error);
  }
}

const columns = ref([
  { name: 'fecha', label: 'Fecha', field: 'fecha', align: 'center', sortable: true },
  { name: 'IdAprendiz', align: 'center', label: 'Nombre Aprendiz', field: row => row?.IdAprendis?.nombre, sortable: true },
  { name: 'IdAprendiz', align: 'center', label: 'Telefono Aprendiz', field: row => row?.IdAprendis?.telefono, sortable: true },
  { name: 'IdAprendiz', align: 'center', label: 'Email Aprendiz', field: row => row?.IdAprendis?.email, sortable: true },
  { name: 'IdAprendiz', align: 'center', label: 'Cc', field: row => row?.IdAprendis?.cc, sortable: true },
  { name: 'nombreFicha', align: 'center', label: 'Nombre Ficha', field: row => row?.IdAprendis?.IdFicha?.nombre, sortable: true },
  { name: 'codigoFicha', align: 'center', label: 'Código Ficha', field: row => row?.IdAprendis?.IdFicha?.codigo, sortable: true },
  { name: 'estado', align: 'center', label: 'Estado', field: 'estado', sortable: true },
]);

const Salir = () => router.replace("/home");

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
  background-color: #2F7D32 !important;
  font-size: 13px;
  font-weight: bold;
}

#agregarficha .material-symbols-outlined {
  font-size: 19px;
  margin-right: 5px;
}

</style>
