require('dotenv').config()
const express=require('express')
const pool=require('./app/database/mysql')



const app=express()

// 🔴 THIS IS REQUIRED
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

require('./app/routes/auth_routes')(app)



app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`)
})