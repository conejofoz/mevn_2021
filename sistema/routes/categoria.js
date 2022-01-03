import routefx from 'express-promise-router'
import CategoriaController from '../controllers/CategoriaController'

const router = routefx()

router.post('/add', CategoriaController.add)
router.get('/query', CategoriaController.query)
router.get('/list', CategoriaController.list)
router.put('/update', CategoriaController.update)
router.delete('/remove', CategoriaController.remove)
router.patch('/activate', CategoriaController.activate)
router.patch('/deactivate', CategoriaController.deactivate)


export default router