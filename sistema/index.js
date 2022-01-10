/*
const express=require('express')
const morgan=require('morgan')
const cors=require('cors')
*/

import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import path from 'path'
import mongoose from 'mongoose'
import router from './routes' //index.js

mongoose.Promise = global.Promise
const dbUrl = 'mongodb://localhost:27017/dbsistemasp'
//mongoose.connect(dbUrl, {useCreateIndex:true, useNewUrlParser:true})
mongoose.connect(dbUrl, {useNewUrlParser:true})
.then(mongoose => console.log('Conectado ao banco de dados na porta 27017'))
.catch(err => console.log(err))


const app=express()
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, 'public')))


app.use('/api', router)


app.set('port', process.env.PORT || 3000)

app.listen(app.get('port'),()=>{
    console.log('servidor rodando na porta ' + app.get('port'))
})