const { mysql } = require("../connection");
const { uploader } = require("./../helper/uploader")
const fs = require('fs')
const cryptogenerate = require('../helper/encrypt')

module.exports = {
    // GET USER, ngambil data user
    getUser: (req, res) => {
        mysql.query(`select * from user`, (err, result) => {
            if (err) res.status(500).send(err);
            res.status(200).send({ datauser: result });
        });
    },
    // POST USER, nambah data user
    postUser: (req, res) => {
        try {
            const path = '/users/images'; //file save path
            const upload = uploader(path, 'IMAGEUSER').fields([{ name: 'image' }])

            upload(req, res, (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Upload gagal', error: err.message })
                }
                // foto baru telah terupload
                console.log('masuk upload')
                const { image } = req.files;
                console.log('ini image', image)
                console.log('ini req', req.files)
                const imagePath = image ? path + '/' + image[0].filename : null

                console.log(req.body.data)
                const data = JSON.parse(req.body.data)
                data.image = imagePath  // menambahkan property image di object data dan image tersebut harus sesuai dengan coulomns di table nya
                data.password= cryptogenerate(data.password)    // menambahkan/ubah property ug namanya password di object data dan password tersebut harus sesuai dengan coulomns di table nya. 
                // dan password sudah i encrypt melalui cryptogenerate

                console.log('masuk post')
                var sql = `INSERT INTO user SET ?`;
                mysql.query(sql, data, (err, results) => {
                    if (err) {
                        console.log(err.message);
                        return res.status(500).json({ message: "Ada yang salah", error: err.message })
                    }
                })
                console.log('berhasil post')
                mysql.query(`SELECT * FROM user`, (err, result1) => {
                    if (err) res.status(500).send(err)
                    res.status(200).send({ datauser: result1 })
                })
            })
        } catch (error) {

        }
    },
    // EDIT USER, ngambil data user
    putUser: (req, res) => {
        const userId = req.params.id;
        var sql = `SELECT * from user where id = ${userId};`
        mysql.query(sql, (err, results) => {
            if (err) {
                throw err
            }

            if (results.length) {
                const path = '/users/images'; //file save path
                const upload = uploader(path, 'IMAGEUSER').fields([{ name: 'image' }])
                upload(req, res, (err) => {
                    if (err) {
                        return res.status(500).json({ message: 'Upload gagal', error: err.message })
                
                    }
                    // foto baru telah upload
                    console.log('masuk upload')
                    const { image } = req.files;
                    console.log('ini image', image)
                    console.log('ini req', req.files)
                    const imagePath = image ? path + '/' + image[0].filename : null
                    console.log(req.body.data)
                    const data = JSON.parse(req.body.data)
                    try {
                        if (imagePath) {
                            data.image = imagePath
            
                        }
                        sql = `UPDATE user SET ? WHERE id = ${req.params.id}`
                        mysql.query(sql, data, (err, result) => {
                            if (err) {
                                console.log('salah query')
                                if (imagePath) {
                                    fs.unlinkSync('./public' + imagePath);
                                }
                                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                            }
                            if (imagePath) {  // jika berhasil, hapus foto yg lama
                                console.log('benar query')                          
                                if (results[0].image) {
                                    fs.unlinkSync('./public' + results[0].image);
                                }
                            } 
                            console.log('berhasil put')
                            mysql.query(`SELECT * FROM user`, (err, result1) => {
                                if (err) res.status(500).send(err)
                                res.status(200).send({ datauser: result1 })
                            })
                        });
                    } catch (err) {
                        console.log(err.message)
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                    }
                })
            }
        })
        // console.log('masuk put')
        // var sql =`UPDATE user SET ? WHERE id = ${req.params.id}`
        // mysql.query(sql, req.body, (err, result) => {
        //     if (err) {
        //         console.log(err.message);
        //         return res.status(500).json({message:"Ada yang salah", error:err.message})
        //     }
        //     console.log('berhasil put')
        //     mysql.query(`SELECT * FROM user`,( err, result1)=>{
        //         if (err) res.status(500).send(err)
        //         res.status(200).send({datauser:result1})
        //     })

        // });

    },
    // DELETE USER, ngambil data user
    deleteUser: (req, res) => {
        var sql = `select * from user where id=${req.params.id}`
        mysql.query(sql, (err, result)=>{
            if (err) res.status(500).send(err)
            if (result.length) {
                console.log('masuk DELETE')
                sql = `DELETE FROM user WHERE id = ${req.params.id}`
                mysql.query(sql, (err, result1) => {
                    if (err) res.status(500).send(err)
                    if (result[0].image) {
                        fs.unlinkSync('./public'+result[0].image)
                    }
                    mysql.query(`SELECT * FROM user`, (err, result2) => {
                        if (err) res.status(500).send(err)
                        res.status(200).send({datauser:result2})
                    })

                })
            }
        })

        // mysql.query(sql, (err, result) => {
        //     if (err) {
        //         console.log(err.message);
        //         return res.status(500).json({ message: "Ada yang salah", error: err.message })
        //     }
        //     console.log('berhasil delete')
        //     mysql.query(`SELECT * FROM user`, (err, result1) => {
        //         if (err) res.status(500).send(err)
        //         res.status(200).send({ datauser: result1 })
        //     })
        
        // });
    }
}

