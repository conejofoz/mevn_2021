import routefx from 'express-promise-router'
import ArticuloController from '../controllers/ArticuloController'
import auth from '../middlewares/auth'

const router = routefx()

router.post('/add', auth.verifyAlmacenero, ArticuloController.add)
router.get('/list', ArticuloController.list)
router.get('/query', ArticuloController.query)
router.put('/update', ArticuloController.update)
router.delete('/remove', ArticuloController.remove)
router.patch('/activate', ArticuloController.activate)
router.patch('/deactivate', ArticuloController.deactivate)


export default router