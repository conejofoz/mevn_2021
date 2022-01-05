import routerfx from 'express-promise-router'
import categoriaRouter from './categoria' //categoria.js
import articuloRouter from './articulo'
import usuarioRouter from './usuario'


const router = routerfx();

router.use('/categoria', categoriaRouter)
router.use('/articulo', articuloRouter)
router.use('/usuario', usuarioRouter)




export default router