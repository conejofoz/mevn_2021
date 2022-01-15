import routefx from 'express-promise-router'
import VentaController from '../controllers/VentaController'
import auth from '../middlewares/auth'

const router = routefx()

router.post('/add', auth.verifyAlmacenero, VentaController.add)
router.get('/list', VentaController.list)
router.get('/grafico12Meses', VentaController.grafico12Meses)
router.get('/consultaFechas', VentaController.consultaFechas)
router.get('/query', VentaController.query)
//router.get('/:_id', VentaController.query)
//router.put('/update', VentaController.update)
//router.delete('/remove', VentaController.remove)
router.patch('/activate', VentaController.activate)
router.patch('/deactivate', VentaController.deactivate)


export default router