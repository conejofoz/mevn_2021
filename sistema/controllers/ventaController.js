import { restart } from "nodemon";
import models from "../models";

async function aumentarStock(idArticulo, cantidad){

    let {stock} = await models.Articulo.findOne({_id:idArticulo})
    let nStock = parseInt(stock) + parseInt(cantidad)
    const reg = await models.Articulo.findByIdAndUpdate({_id:idArticulo},{stock:nStock})
}

async function disminuirStock(idArticulo, cantidad){

    let {stock} = await models.Articulo.findOne({_id:idArticulo})
    let nStock = parseInt(stock) - parseInt(cantidad)
    const reg = await models.Articulo.findByIdAndUpdate({_id:idArticulo},{stock:nStock})
}

export default{
    add: async(req, res, next) => {
        try {
            
            const reg = await models.Venta.create(req.body)

            let detalles = req.body.detalles
            detalles.map(function(item){
                disminuirStock(item._id, item.cantidad)
            })

            res.status(200).json(reg)
        } catch (e) {
            res.status(500).send({
                message:'Ocurrió un error'
            })
            next(e) //mostra a mensagem no console através de morgan
        }
    },
    query: async(req, res, next) => {
        try {
            const reg = await models.Venta.findOne({_id:req.query._id})
            .populate('usuario', {nombre:1})
            .populate('persona', {nombre:1})
            if(!reg){
                res.status(404).send({message:'El registro no existe'})
            } else {
                res.status(200).json(reg)
            }
        } catch (e) {
            res.status(500).send({
                message:'Ocurrió un error'
            })
            next(e)
        }
    },
    list: async(req, res, next) => {
        try {
            let valor = req.query.valor
            //const reg = await models.Venta.find({'nombre': new RegExp(valor, 'i')},{createdAt:0}).sort({'nombre':1})
            const reg = await models.Venta.find({$or:[{'num_comprobante': new RegExp(valor, 'i')},{'serie_comprobante': new RegExp(valor, 'i')}]}).sort({'nombre':1})
            .populate('usuario', {nombre:1})
            .populate('persona', {nombre:1, direccion:1,num_documento:1,telefono:1,email:1})
            res.status(200).json(reg)
        } catch (e) {
            res.status(500).send({
                message:'Ocurrió un error'
            })
            next(e)
        }
    },/*
    update: async(req, res, next) => {
        try {
            const reg = await models.Venta.findByIdAndUpdate({_id:req.body._id},{
                nombre:req.body.nombre, 
                description:req.body.description
            })
            res.status(200).json(reg)
        } catch (e) {
            res.status(500).send({
                message:'Ocurrió un error'
            })
            next(e)
        }
    },
    remove: async(req, res, next) => {
        try {
            const reg = await models.Venta.findByIdAndDelete({_id:req.body._id})
            res.status(200).json(reg)
        } catch (e) {
            res.status(500).send({
                message:'Ocurrió un error'
            })
            next(e)
        }
    },*/
    activate: async(req, res, next) => {
        try {
            const reg = await models.Venta.findByIdAndUpdate({_id:req.body._id},{estado:1})

            let detalles = reg.detalles
            detalles.map(function(item){
                disminuirStock(item._id, item.cantidad)
            })

            res.status(200).json(reg)
        } catch (e) {
            res.status(500).send({
                message:'Ocurrió un error'
            })
            next(e)
        }
    },
    deactivate: async(req, res, next) => {
        try {
            const reg = await models.Venta.findByIdAndUpdate({_id:req.body._id},{estado:0})

            let detalles = reg.detalles
            detalles.map(function(item){
                aumentarStock(item._id, item.cantidad)
            })

            res.status(200).json(reg)
        } catch (e) {
            res.status(500).send({
                message:'Ocurrió un error'
            })
            next(e)
        }
    },
    grafico12Meses:async(req, res, next) => {
        try {
            const reg = await models.Venta.aggregate(
                [
                    {
                        $group:{
                            _id:{
                                mes:{$month:"$createdAt"},
                                year:{$year:"$createdAt"}
                            },
                            total:{$sum:"$total"},
                            numero:{$sum:1}
                        }
                    },
                    {
                        $sort:{
                            "_id.year":-1, "_id.mes":-1
                        }
                    }
                ]
            ).limit(12)

            res.status(200).json(reg)

        } catch (e) {
            res.status(500).send({
                message:'Ocurrió un error'
            })
            next(e)
        }
    },
    consultaFechas: async(req, res, next) => {
        try {

            let start = req.query.start
            let end = req.query.end

            const reg = await models.Venta.find({"createdAt": {"$gte": start, "$lt": end}})
            .populate('usuario', {nombre:1})
            .populate('persona', {nombre:1})
            .sort({'createdAt':-1})
            res.status(200).json(reg)
        } catch (e) {
            res.status(500).send({
                message:'Ocurrió un error'
            })
            next(e)
        }
    }
}