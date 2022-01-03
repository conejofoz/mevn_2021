import routerfx from 'express-promise-router'
import categoriaRouter from './categoria' //categoria.js

const router = routerfx();

router.use('/categoria', categoriaRouter)




export default router