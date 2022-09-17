const pg = require('pg')
const pool = new pg.Pool({
    user:'newuser',
    host:'localhost',
    database:'users',
    password:'user',
    port:5432
})

const getUsers = (req,res)=>{
    console.log("Got request")
    pool.query('SELECT * FROM user_details ORDER BY id ASC;',(err,data)=>{
        if(err){
            throw err;
        }
        console.log(data.rowCount)
        res.status(200).json(data.rows)
    })
}

const getUserById = (req,res)=>{
    console.log("Get user by id")
    const Id = parseInt(req.params.id)
    pool.query('SELECT * FROM user_details WHERE id=$1',[Id],(err,result)=>{
        if(err) throw err;
        console.log(result.rowCount)
        res.status(200).json(result.rows);
    })
}

const createUser = (req,res)=>{
    console.log("Create User")
    const { name, email } = req.body;

    pool.query("SELECT * FROM user_details WHERE name=$1 AND email=$2",[name, email],(err,result)=>{
        if(err) throw err;

        if(result.rowCount==0){
            pool.query("INSERT INTO user_details(name,email) VALUES($1,$2) RETURNING id",[name,email],(erro,results)=>{
                if(erro) throw erro;
                res.status(200).json(results.rows)
            })
        }
        else{
            res.status(400).json({"ERROR!!":"User already exists!!"})
        }
    })
}

module.exports = {
    getUsers,
    getUserById,
    createUser
}