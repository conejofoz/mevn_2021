/*
const express=require('express')
const morgan=require('morgan')
const cors=require('cors')
*/

import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import path from 'path'

const app=express()
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, 'public')))

app.set('port', process.env.PORT || 3000)

app.listen(app.get('port'),()=>{
    console.log('servidor rodando na porta ' + app.get('port'))
})