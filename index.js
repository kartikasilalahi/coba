const express = require('express')
const app = express()
const BodyParser = require("body-parser");
const cors = require('cors') // menghubungkan backend dan front end
const fs = require('fs')

const port = 9000

app.use(cors())
app.use(BodyParser.urlencoded({ extended: false }));
app.use(BodyParser.json()); // untuk client ngirim ke server
app.use(express.static('public'))

// const {userRouter, authRouter}=require('./router')
const { userRouter, authRouter } = require('./router')

app.use('/coba', userRouter)
app.use('/auth', authRouter)

app.get('/', (req, res) => {
    return res.status(200).send('<h1>Selamat Datang</h1>')
})



app.listen(port, () => console.log(`api aktif di ${port}`))