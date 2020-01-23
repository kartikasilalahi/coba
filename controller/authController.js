const fs = require('fs')
const {mysql} = require('./../connection')
const cryptogenerate = require('../helper/encrypt')
const transporter = require('../helper/mailer')

module.exports={
    belajarcrypto:(req,res)=>{
        console.log(req.query)
        const hashpassword=cryptogenerate(req.query.password)
        res.send({
            encryptan:hashpassword,
            panjangencrypt:hashpassword.length
        })
    },
    sendmail: (req,res)=>{
        var initampilan = fs.readFileSync('./satu.html', 'utf8')
        console.log('ini initampilan', initampilan)

        var mailOptions = {
            from : 'bebas <tikasilalahi.test@gmail.com>',
            to : 'tikasilalahi.test@gmail.com',
            subject : 'Ini verifikasi yak',
            html : initampilan
        }
        transporter.sendMail(mailOptions, (err,result)=>{
            if (err) return res.status(500).send({message:err})
            console.log(result)
            return res.status(200).send({message:"berhasil send", result})
        })
    },
    register:(req,res)=>{
        var data=req.body
        data.password = cryptogenerate(data.password)

        var sql = `INSERT INTO user SET ?`;
        mysql.query(sql, data, (err,results) => {
            if(err) return res.status(500).json({message: 'Ada yang salah', error:err.message})
            console.log(results)
            mysql.query(`SELECT * FROM user`, (err,results1) => {
                if (err) res.status(500).send(err)
                res.status(200).send({datauser:results1})
            })
        })
    },
    registerserver:(req,res)=>{
        var {nama,email,password} = req.body
        var sql = `SELECT nama from user where nama='${nama}'`
        mysql.query(sql, (err,result) => {
            if (err) return res.status(500).send({status:'error', err})
            if (result.length>0) {
                return res.status(200).send({status:"error", nessage:"nama sudah ada"})
            }else{
                var hashpassword = cryptogenerate(password)
                var datauser = {
                    nama,
                    password:hashpassword,
                    email,
                    status:'unverified'
                }
                sql = `INSERT INTO user SET ?`;
                mysql.query(sql, datauser, (err1,res1)=>{
                    if(err1) return res.status(500).send({status:'error', err:err1})

                    var LinkVerifikasi = `http://localhost:3000/verified?nama=${nama}&password=${hashpassword}`

                    var mailOptions = {
                        from : 'bebas <tikasilalahi.test@gmail.com>',
                        to : email,
                        subject : 'verifikasi sekarang',
                        html:`klik verifikasi : <a href=${LinkVerifikasi}>Join apps ini</a>`
                    }

                    transporter.sendMail(mailOptions, (err2,res2)=>{
                        if(err2) return res.status(500).send({status:'error', err:err2})

                        console.log('sukses kirim linkemail')
                        res.status(200).send({nama,email,status:'unverified'})
                        
                    })
                })
            }
        })
    },
    emailverifikasi:(req,res)=>{
        var {nama,password}=req.body
        var sql=`select * from user where nama='${nama}'`
        mysql.query(sql,(err,results)=>{
            if(err) return res.status(500).send({status:'error',err})

            if(results.length===0){
                return res.status(500).send({status:'error',err1:'user not found'})
            }
            sql=`update user set status='verified' where nama='${nama}' and password='${password}'`
            mysql.query(sql,(err,results2)=>{
                if(err){
                    return res.status(500).send({status:'error',err})
                }
                return res.status(200).send({nama:results[0].nama,email:results[0].email,status:'verified'})
            })
        })
    },
    resendEmailVer:(req,res)=>{
        var {nama,email}=req.body
        var sql=`select nama,password,email from user where nama='${nama}' and email='${email}'`
        mysql.query(sql,(err,results)=>{
            if(err) return res.status(500).send({status:'error',err})
            if(results.length===0){
                return res.status(500).send({status:'error',err:'user not found'})
            }
            var LinkVerifikasi=`http://localhost:3000/verified?nama=${results[0].nama}&password=${results[0].password}`
            var mailoptions={
                from : 'bebas <tikasilalahi.test@gmail.com>',
                to:results[0].email,
                subject : 'verifikasi kuy',
                html:`tolong klik link ini untuk verifikasi :
                    <a href=${LinkVerifikasi}>Join instagrin</a>`
            }
            transporter.sendMail(mailoptions,(err2,res2)=>{
                if(err2){
                    console.log(err2)
                    return res.status(500).send({status:'error',err:err2})
                }
                console.log(`success`)
                return res.status(200).send({nama,email,status:'unverified'})
            })
        })
    }
}