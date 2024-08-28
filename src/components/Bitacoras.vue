<template>
  <div>
    <div id="en">
      <button id="atras" @click="Salir">
        <span class="material-symbols-outlined">arrow_back</span>
      </button>
      <h1 id="programas">Bitacoras</h1>
      <q-input v-model="fechaInicio" filled type="date" hint="Native date" />
      <q-input v-model="fechaFin" filled type="date" hint="Native date" />
      <button @click="listarFechas()">Listar Fechas</button>
    </div>
    <div>
      <q-select
        rounded
        outlined
        v-model="selectedFicha"
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        :options="fichaOptions"
        @filter="filterFichas"
        label="Selecciona una ficha"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              Sin resultados
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <button @click="listarBitacorasFicha()">Listar por Ficha</button>
    </div>
    
    <div>
      <q-select
        rounded
        outlined
        v-model="selectedAprendiz"
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        :options="aprendizOptions"
        @filter="filterAprendices"
        label="Selecciona un aprendiz"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              Sin resultados
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <button @click="listarBitacorasAprendiz()">Listar por Aprendiz</button>
    </div>

    <div>
      <q-input v-model="fecha" filled type="date" hint="Native date" />
      <button @click="listarFecha()">Listar Fechas</button>
    </div>
    <div style="margin: 0px;">
      <div class="tablafichas">
        <q-btn id="agregarficha" @click="fixed = true" color="primary">
          <span class="material-symbols-outlined">add_circle</span>Crear
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

        <q-dialog
          v-model="fixed"
          :backdrop-filter="'blur(4px) saturate(150%)'"
          transition-show="rotate"
          transition-hide="rotate"
          persistent
        >
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

        <q-dialog
          v-model="confirm"
          persistent
          :backdrop-filter="'blur(4px) saturate(150%)'"
          transition-show="rotate"
          transition-hide="rotate"
        >
          <q-card>
            <q-card-section class="row items-center">
              <span class="q-ml-sm">¿Seguro quieres eliminar la ficha?</span>
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
import { ref, onMounted, onBeforeMount, watch } from 'vue';
import { Dark, useQuasar } from 'quasar';
import { useBitacoraStore } from '../stores/bitacoras.js';
import { useAprendizStore } from "../stores/aprendiz.js";
import { useFichaStore } from '../stores/fichas.js';
import { useRouter } from 'vue-router';

const useBitacora = useBitacoraStore();
const useAprendiz = useAprendizStore();
const useFicha = useFichaStore();

const router = useRouter();
const $q = useQuasar();

const confirm = ref(false);
const fixed = ref(false);
const isDark = ref(Dark.isActive);

const fecha = ref("");
const fechaInicio = ref("");
const fechaFin = ref("");
const IdFicha = ref("");
const idAprendis = ref("");

const selectedFicha = ref(null);
const selectedAprendiz = ref(null);

const fichaOptions = ref([]);
const aprendizOptions = ref([]);

watch(isDark, val => Dark.set(val));

const props = defineProps({
  modelValue: [String, Object],
  label: String
});

const emit = defineEmits(['update:modelValue']);

function filterFichas(val, update) {
  update(() => {
    const needle = val.toLowerCase();
    fichaOptions.value = useFicha.fichas.map(v => ({
      label: v.nombre,
      value: v._id
    })).filter(v => v.label.toLowerCase().includes(needle));
  });
}

function filterAprendices(val, update) {
  update(() => {
    const needle = val.toLowerCase();
    aprendizOptions.value = useAprendiz.aprendices.map(v => ({
      label: v.nombre,
      value: v._id
    })).filter(v => v.label.toLowerCase().includes(needle));
  });
}

onMounted(async () => {
  await useFicha.listarFichas().then(fichas => {
    fichaOptions.value = fichas.map(v => ({
      label: v.nombre,
      value: v._id
    }));
  });

  await useAprendiz.listarAprendiz().then(aprendices => {
    aprendizOptions.value = aprendiz.map(v => ({
      label: v.nombre,
      value: v._id
    }));
  });
});

watch(() => props.modelValue, (newVal) => {
  selectedFicha.value = newVal;
});

watch(selectedFicha, (newVal) => {
  emit('update:modelValue', newVal);
});

const rows = ref([]);

onBeforeMount(traer);

async function traer() {
  const res = await useBitacora.listarBitacoras();
  rows.value = res.map(bitacora => {
    const fecha = new Date(bitacora.fecha);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const año = fecha.getFullYear();
    bitacora.fecha = `${dia}/${mes}/${año}`;
    return bitacora;
  });
}

function listarFechas() {
  useBitacora.listarBitacorasFechas(fechaInicio.value, fechaFin.value).then(res => {
    rows.value = res.map(bitacora => {
      const fecha = new Date(bitacora.fecha);
      const dia = String(fecha.getDate()).padStart(2, '0');
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      const año = fecha.getFullYear();
      bitacora.fecha = `${dia}/${mes}/${año}`;
      return bitacora;
    });
  });
}

function listarBitacorasFicha() {
  useBitacora.listarBitacorasFicha(selectedFicha.value).then(res => {
    rows.value = res.map(bitacora => {
      const fecha = new Date(bitacora.fecha);
      const dia = String(fecha.getDate()).padStart(2, '0');
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      const año = fecha.getFullYear();
      bitacora.fecha = `${dia}/${mes}/${año}`;
      return bitacora;
    });
  });
}

function listarBitacorasAprendiz() {
  useBitacora.listarBitacorasAprendiz(selectedAprendiz.value).then(res => {
    rows.value = res.map(bitacora => {
      const fecha = new Date(bitacora.fecha);
      const dia = String(fecha.getDate()).padStart(2, '0');
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      const año = fecha.getFullYear();
      bitacora.fecha = `${dia}/${mes}/${año}`;
      return bitacora;
    });
  });
}

function listarFecha() {
  useBitacora.listarBitacorasPorFecha(fecha.value).then(res => {
    rows.value = res.map(bitacora => {
      const fecha = new Date(bitacora.fecha);
      const dia = String(fecha.getDate()).padStart(2, '0');
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      const año = fecha.getFullYear();
      bitacora.fecha = `${dia}/${mes}/${año}`;
      return bitacora;
    });
  });
}

function crearBitacora() {
  const bitacoraData = {
    nom: nom.value,
    cc: cc.value,
    IdFicha: IdFicha.value,
    email: email.value,
    telefono: telefono.value
  };

  useBitacora.crearBitacora(bitacoraData).then(() => {
    fixed.value = false;
    traer();
  });
}

function eliminarAprendiz() {
  useBitacora.eliminarAprendiz(idAprendis.value).then(() => {
    traer();
  });
}

function Salir() {
  router.push('/home');
}

function cerrar() {
  fixed.value = false;
}

const columns = [
  { name: 'id', required: true, label: 'ID', align: 'left', field: row => row._id },
  { name: 'nombre', label: 'Nombre', align: 'left', field: row => row.nom },
  { name: 'cc', label: 'CC', align: 'left', field: row => row.cc },
  { name: 'id_ficha', label: 'ID Ficha', align: 'left', field: row => row.IdFicha },
  { name: 'email', label: 'Email', align: 'left', field: row => row.email },
  { name: 'telefono', label: 'Teléfono', align: 'left', field: row => row.telefono },
  { name: 'estado', label: 'Estado', align: 'left', field: row => row.estado }
];
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
