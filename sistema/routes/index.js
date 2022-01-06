import routerfx from 'express-promise-router'
import categoriaRouter from './categoria' //categoria.js
import articuloRouter from './articulo'
import usuarioRouter from './usuario'
import personaRouter from './persona'
import ingresoRouter from './ingreso'


const router = routerfx();

router.use('/categoria', categoriaRouter)
router.use('/articulo', articuloRouter)
router.use('/usuario', usuarioRouter)
router.use('/persona', personaRouter)
router.use('/ingreso', ingresoRouter)




export default router