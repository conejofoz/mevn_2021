import routefx from 'express-promise-router'
import CategoriaController from '../controllers/CategoriaController'
import auth from '../middlewares/auth'

const router = routefx()

//router.post('/add', auth.verifyAlmacenero, CategoriaController.add)
router.post('/add', CategoriaController.add)
router.get('/list', auth.verifyAlmacenero, CategoriaController.list)
router.get('/query', CategoriaController.query)
//router.get('/:_id', CategoriaController.query)
router.put('/update', CategoriaController.update)
router.delete('/remove', CategoriaController.remove)
router.patch('/activate', CategoriaController.activate)
router.patch('/deactivate', CategoriaController.deactivate)


export default router