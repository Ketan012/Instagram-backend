const express = require('express')
const mongoose = require('mongoose');
const app = express();

const route = require('./Routes');

require('dotenv').config();
mongoose.connect(process.env.DB, {
    useNewUrlParser : true,
    useUnifiedTopology: true
}).then(()=> {
    console.log("DB is Connected!");
}).catch((error)=>{
    console.log(`error while connecting DB: ${error}` );
})

app.use('/api/v1/auth', route.authRoute);
app.listen(process.env.PORT, ()=>{
    console.log(`App is running on port ${process.env.PORT}`);
})