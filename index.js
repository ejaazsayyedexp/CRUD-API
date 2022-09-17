const express = require('express')
const app = express()

const { getUsers, getUserById, createUser } = require('./queries')

const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

// @GET / => Get for test
// @GET /users :getUsers()=> Get all users info
// @GET /users/:id :getUserById()=> Get users info by id

app.get('/',(req,res)=>{
    res.status(200).json({"info":"Status good"})
})

app.get('/users',getUsers)
app.get('/users/:id',getUserById)

// @POST /users :createUser()=> Create new user entry in db

app.post('/users',createUser)

app.listen(2100,()=>{
    console.log("At 2100")
})
