import routefx from 'express-promise-router'
import UsuarioController from '../controllers/UsuarioController'
import auth from '../middlewares/auth'

const router = routefx()

router.post('/add', auth.verifyAdministrador, UsuarioController.add)
router.get('/list', auth.verifyAdministrador, UsuarioController.list)
router.get('/query', UsuarioController.query)
//router.get('/:_id', UsuarioController.query)
router.put('/update', UsuarioController.update)
router.delete('/remove', UsuarioController.remove)
router.patch('/activate', UsuarioController.activate)
router.patch('/deactivate', UsuarioController.deactivate)
router.post('/login', UsuarioController.login)


export default router