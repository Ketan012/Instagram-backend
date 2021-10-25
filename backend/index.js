const express = require('express')
const mongoose = require('mongoose');
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');
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

app.use(bodyParser.json());
app.use(cors());
app.use('/api/v1/auth', route.authRoute);
app.use('/api/v1/user', route.userRoute);
app.listen(process.env.PORT, ()=>{
    console.log(`App is running on port ${process.env.PORT}`);
})