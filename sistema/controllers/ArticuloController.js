import { restart } from "nodemon";
import models from "../models";

export default{
    add: async(req, res, next) => {
        try {
            const reg = await models.Articulo.create(req.body)
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
            const reg = await models.Articulo.findOne({_id:req.query._id})
            .populate('categoria', {nombre:1})
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
    queryCodigo: async(req, res, next) => {
        try {
            const reg = await models.Articulo.findOne({codigo:req.query.codigo})
            .populate('categoria', {nombre:1})
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
            //const reg = await models.Articulo.find({'nombre': new RegExp(valor, 'i')},{createdAt:0}).sort({'nombre':1})
            const reg = await models.Articulo.find({$or:[{'nombre': new RegExp(valor, 'i')},{'description': new RegExp(valor, 'i')}]},{createdAt:0})
            .populate('categoria', {nombre:1})
            .sort({'nombre':-1})
            res.status(200).json(reg)
        } catch (e) {
            res.status(500).send({
                message:'Ocurrió un error'
            })
            next(e)
        }
    },
    update: async(req, res, next) => {
        try {
            const reg = await models.Articulo.findByIdAndUpdate({_id:req.body._id},{
                categoria: req.body.categoria,
                nombre:req.body.nombre, 
                description:req.body.description,
                precio_venta:req.body.precio_venta,
                stock:req.body.stock
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
            const reg = await models.Articulo.findByIdAndDelete({_id:req.body._id})
            res.status(200).json(reg)
        } catch (e) {
            res.status(500).send({
                message:'Ocurrió un error'
            })
            next(e)
        }
    },
    activate: async(req, res, next) => {
        try {
            const reg = await models.Articulo.findByIdAndUpdate({_id:req.body._id},{estado:1})
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
            const reg = await models.Articulo.findByIdAndUpdate({_id:req.body._id},{estado:0})
            res.status(200).json(reg)
        } catch (e) {
            res.status(500).send({
                message:'Ocurrió un error'
            })
            next(e)
        }
    },
}