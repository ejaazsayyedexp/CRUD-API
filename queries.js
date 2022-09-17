const pg = require('pg')
const pool = new pg.Pool({
    user:'newuser',
    host:'localhost',
    database:'users',
    password:'user',
    port:5432
})

const getUsers = (req,res)=>{
    pool.query('SELECT * FROM user_details ORDER BY id ASC;',(err,data)=>{
        if(err){
            throw err;
        }
        console.log(data.rowCount)
        res.status(200).json(data.rows)
    })
}

const getUserById = (req,res)=>{
    const Id = parseInt(req.params.id)
    pool.query('SELECT * FROM user_details WHERE id=$1',[Id],(err,result)=>{
        if(err) throw err;
        if(result.rowCount!=0) res.status(200).json(result.rows);
        else res.status(400).json({"Error!":"User not found!"})
    })
}

const createUser = (req,res)=>{
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

const deleteUser = (req,res)=>{
    const { id } = req.body;
    pool.query("SELECT * FROM user_details WHERE id=$1",[id],(err,result)=>{
        if(err) throw err;
        if(result.rowCount!=0){
            pool.query("DELETE FROM user_details WHERE id=$1 RETURNING *",[id],(erro,resu)=>{
                if(erro) throw erro;
                res.status(200).json(resu.rows)
            })
        }
        else{
            res.status(400).json({"ERROR":"User does not exist!"})
        }
    })
}

const updateUser = (req,res)=>{
    const id = parseInt(req.params.id)
    const { name, email } = req.body;
    pool.query("SELECT * FROM user_details WHERE id=$1",[id],(err,result)=>{
        if(result.rowCount!=0){
            if(name==undefined) {
                if(email==undefined){
                    res.status(400).json({"Status":"No details found to be updated"})
                }
                else{
                    pool.query("UPDATE user_details SET email=$1 WHERE id=$2 RETURNING *",[email,id],(erro,resu)=>{
                        if(erro) throw erro;
                        res.status(200).json(resu.rows)
                    })
                }
            }
            else if(email==undefined){
                pool.query("UPDATE user_details SET name=$1 WHERE id=$2 RETURNING *",[name,id],(erro,resu)=>{
                    if(erro) throw erro;
                    res.status(200).json(resu.rows)
                })
            } 
            else{
                pool.query("UPDATE user_details SET name=$1, email=$2 WHERE id=$3 RETURNING *",[name,email,id],(erro,resu)=>{
                    if(erro) throw erro;
                    res.status(200).json(resu.rows)
                })
            }
        }
        else{
            res.status(400).json({"Status":"User does not exist!!"})
        }
    })
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    deleteUser,
    updateUser
}