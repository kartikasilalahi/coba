const { mysql } = require("../connection");
const {uploader} = require("./../helper/uploader")

module.exports = {
    // GET USER, ngambil data user
    getUser: (req, res) => {
        mysql.query(`select * from user`, (err, result) => {
            if (err) res.status(500).send(err);
            res.status(200).send({ datauser: result });
        });
    },
    // POST USER, nambah data user
    postUser: (req, res)=>{
        try {
            const path = '/users/images'; //file save path
            const upload = uploader(path, 'IMAGEUSER').fields([{name:'image'}])

            upload(req, res, (err)=>{
                if (err) {
                    return res.status(500).json({message:'Upload gagal', error:err.message})
                }
                console.log('masuk upload')
                const { image } = req.files;
                console.log('ini image', image)
                const imagePath = image ? path + '/' + image[0].filename : null

                console.log(req.body.data)
                const data = JSON.parse(req.body.data)
                data.image = imagePath  // tambahkan property image di object data dan image tersebut harus sesuai dengan coulomns di table nya

                console.log('masuk post')
                var sql = `INSERT INTO user SET ?`;
                mysql.query(sql, data, (err,results)=>{
                    if (err) {
                        console.log(err.message);
                        return res.status(500).json({message:"Ada yang salah", error:err.message})
                    }
                })
                console.log('berhasil post')
                mysql.query(`SELECT * FROM user`,( err, result1)=>{
                    if (err) res.status(500).send(err)
                    res.status(200).send({datauser:result1})
                })
            })
        } catch (error) {
            
        }
    },
    // EDIT USER, ngambil data user
    putUser: (req, res) => {
        console.log('masuk put')
        var sql =`UPDATE user SET ? WHERE id = ${req.params.id}`
        mysql.query(sql, req.body, (err, result) => {
            if (err) {
                console.log(err.message);
                return res.status(500).json({message:"Ada yang salah", error:err.message})
            }
            console.log('berhasil put')
            mysql.query(`SELECT * FROM user`,( err, result1)=>{
                if (err) res.status(500).send(err)
                res.status(200).send({datauser:result1})
            })
            
        });
    },
    // DELETE USER, ngambil data user
    deleteUser: (req, res) => {
        console.log('masuk DELETE')
        var sql =`DELETE FROM user WHERE id = ${req.params.id}`
        mysql.query(sql,  (err, result) => {
            if (err) {
                console.log(err.message);
                return res.status(500).json({message:"Ada yang salah", error:err.message})
            }
            console.log('berhasil delete')
            mysql.query(`SELECT * FROM user`,( err, result1)=>{
                if (err) res.status(500).send(err)
                res.status(200).send({datauser:result1})
            })
            
        });
    }
};

