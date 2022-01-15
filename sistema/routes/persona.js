import routefx from 'express-promise-router'
import PersonaController from '../controllers/PersonaController'
import auth from '../middlewares/auth'

const router = routefx()

router.post('/add', PersonaController.add)
router.get('/list', PersonaController.list)
router.get('/listClientes', auth.verifyUsuario, PersonaController.listClientes)
router.get('/listProveedores', auth.verifyUsuario, PersonaController.listProveedores)
router.get('/query', PersonaController.query)
//router.get('/:_id', PersonaController.query)
router.put('/update', PersonaController.update)
router.delete('/remove', PersonaController.remove)
router.patch('/activate', PersonaController.activate)
router.patch('/deactivate', PersonaController.deactivate)



export default router