import routefx from 'express-promise-router'
import IngresoController from '../controllers/IngresoController'
import auth from '../middlewares/auth'

const router = routefx()

router.post('/add', auth.verifyAlmacenero, IngresoController.add)
router.get('/list', IngresoController.list)
router.get('/grafico12Meses', IngresoController.grafico12Meses)
router.get('/consultaFechas', IngresoController.consultaFechas)
router.get('/query', IngresoController.query)
//router.get('/:_id', IngresoController.query)
//router.put('/update', IngresoController.update)
//router.delete('/remove', IngresoController.remove)
router.patch('/activate', IngresoController.activate)
router.patch('/deactivate', IngresoController.deactivate)


export default router