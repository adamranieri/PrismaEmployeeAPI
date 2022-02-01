import {Employee, PrismaClient, WorkLog } from '@prisma/client'
import express, { Request, Response } from 'express'
import cors from 'cors'
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime'


const prisma = new PrismaClient()
const app = express()

app.use(express.json())
app.use(cors())

function errorHandler(req:Request,res:Response,error:Error){

    console.log(error)    
    if(error instanceof PrismaClientValidationError || error instanceof PrismaClientKnownRequestError ){
        res.status(400).send()
    }else{
        res.status(500).send()
    }
    
}

app.get("/employees",async (req,res)=>{

    try {
        const employees = await prisma.employee.findMany({select:{username:true,fname:true,lname:true,isManager:true,id:true}})
        res.send(employees)
    } catch (error) {
        errorHandler(req,res,error)
    }

})

app.get("/worklogs", async (req,res)=>{

    try {
        const worklogs:WorkLog[] = await prisma.workLog.findMany()
        res.send(worklogs)
    } catch (error) {
        errorHandler(req,res,error)
    }

})

app.get('/employees/:id/worklogs', async (req,res)=>{

    try {
        const {id} = req.params
        const worklogs: WorkLog[] = await prisma.workLog.findMany({where:{employeeId:Number(id)}})
        res.send(worklogs)
    } catch (error) {
        errorHandler(req,res,error)
    }

})

app.post('/employees', async (req,res)=>{

    try {
        const employee:Employee = await prisma.employee.create({data:req.body})
        res.status(201).send(employee)
    } catch (error) {
        errorHandler(req,res,error)
    }

})

app.post('/employees/:id/worklogs', async (req,res)=>{

    try {
        const workLog:WorkLog = req.body
        workLog.employeeId = Number(req.params.id)
        workLog.timestamp = new Date()
        const savedLog:WorkLog = await prisma.workLog.create({data:workLog})
        res.send(savedLog)
        
    } catch (error) {
        errorHandler(req,res,error)
    }

})

app.patch('/login', async (req,res)=>{

    try {
        const {username,password}:{username:string,password:string} = req.body
        const employee = await prisma.employee.findFirst({where:{username,password}, select:{id:true, isManager:true,fname:true,lname:true}})
    
        employee?
            res.send(employee)
        :
            res.status(400).send("No employee with that username and password")
        
    } catch (error) {
        errorHandler(req,res,error)
    }

})


app.listen(3000,()=> console.log("Application started"))
