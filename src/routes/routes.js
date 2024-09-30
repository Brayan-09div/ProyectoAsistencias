import home from '../components/Home.vue'
import fichas from '../components/Fichas.vue'
import aprendiz from '../components/Aprendiz.vue'
import usuario from '../components/Usuario.vue'
import bitacoras from '../components/Bitacoras.vue'
import loguin from '../components/Loguin.vue'
import inscripcion from '../components/inscripcion.vue'
import perfil from '../components/Perfil.vue'
import InformesAprendiz from '../components/InformesAprendiz.vue'
import Informes from '../components/Informes.vue'
import recuperar from '../components/Recuperar.vue'
import enviarCorreo from '../components/enviarCorreo.vue'
import pdf from '../components/pdf.vue'

import { createRouter, createWebHashHistory } from 'vue-router'



const routes = [
    { path: '/home', component: home, children:[
        { path: '/fichas', component: fichas },
        { path: '/aprendiz', component: aprendiz },
        { path: '/usuario', component: usuario },
        { path: '/bitacoras', component: bitacoras },
        { path: '/perfil', component: perfil },
        { path: '/informesAprendiz', component: InformesAprendiz },
        { path: '/informes', component: Informes },
    ] },
    
    {path: '/inscripcion',  component: inscripcion},
    {path: '/',  component: loguin},
    {path: '/recuperar',  component: recuperar},
    {path: '/enviarCorreo',  component: enviarCorreo},
    { path: '/pdf', component: pdf},
 
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})