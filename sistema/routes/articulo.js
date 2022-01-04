import routefx from 'express-promise-router'
import ArticuloController from '../controllers/ArticuloController'

const router = routefx()

router.post('/add', ArticuloController.add)
router.get('/list', ArticuloController.list)
router.get('/query', ArticuloController.query)
router.put('/update', ArticuloController.update)
router.delete('/remove', ArticuloController.remove)
router.patch('/activate', ArticuloController.activate)
router.patch('/deactivate', ArticuloController.deactivate)


export default router