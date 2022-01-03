import routefx from 'express-promise-router'
import CategoriaController from '../controllers/CategoriaController'

const router = routefx()

router.post('/add', CategoriaController.add)
router.get('/query', CategoriaController.query)
router.get('/list', CategoriaController.list)
router.put('/', CategoriaController.update)
router.delete('/', CategoriaController.remove)
router.patch('/', CategoriaController.activate)
router.patch('/', CategoriaController.deactivate)


export default router