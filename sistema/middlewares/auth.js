import tokenService from '../services/token'

export default{
    verifyUsuario: async (req, res, next) =>{
        
        if(!req.headers.token){
            return res.status(404).send({message: 'No existe token'})
        }

        const usuarioRol = await tokenService.decode(req.headers.token)

        if(usuarioRol.rol == 'Administrador' || usuarioRol.rol == 'Vendedor' || usuarioRol.rol == 'Almacenero'){
            next()
        } else {
            return res.status(403).send({message: 'No autorizado'})
        }

    },
    verifyAdministrador: async (req, res, next) =>{
        
        if(!req.headers.token){
            return res.status(404).send({message: 'No existe token'})
        }

        const usuarioRol = await tokenService.decode(req.headers.token)

        if(usuarioRol.rol == 'Administrador'){
            next()
        } else {
            return res.status(403).send({message: 'No autorizado'})
        }

    },
    verifyAlmacenero: async (req, res, next) =>{
        
        if(!req.headers.token){
            return res.status(404).send({message: 'No existe token'})
        }

        const usuarioRol = await tokenService.decode(req.headers.token)

        if(usuarioRol.rol == 'Administrador' || usuarioRol.rol == 'Almacenero'){
            next()
        } else {
            return res.status(403).send({message: 'No autorizado'})
        }

    },
    verifyVendedor: async (req, res, next) =>{
        
        if(!req.headers.token){
            return res.status(404).send({message: 'No existe token'})
        }

        const usuarioRol = await tokenService.decode(req.headers.token)

        if(usuarioRol.rol == 'Administrador' || usuarioRol.rol == 'Vendedor'){
            next()
        } else {
            return res.status(403).send({message: 'No autorizado'})
        }
    },

}