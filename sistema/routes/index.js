import routerfx from 'express-promise-router'
import categoriaRouter from './categoria' //categoria.js
import articuloRouter from './articulo'


const router = routerfx();

router.use('/categoria', categoriaRouter)
router.use('/articulo', articuloRouter)




export default router