const express = require('express');
const connectDB =require('./Config/db')
const app = express();
//connecting DB
connectDB();
 app.use(express.json({extended:false}))
app.get('/',(req,res)=> res.send('API Running TEST'))

const Port = process.env.Port || 5000

app.use('/user',require('./Routes/user'))

app.listen(Port, ()=>console.log(`Server Started on ${Port}`))