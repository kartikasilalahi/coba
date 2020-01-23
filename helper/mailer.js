const nodemailer=require('nodemailer')

const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: "tikasilalahi.test@gmail.com",
        pass: "ezcfixfklwviibob"
    },
    tls:{
        rejectUnauthorized:false
    }
})

module.exports=transporter