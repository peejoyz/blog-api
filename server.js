if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors')
const app = express()

//connecting to mongodb database
mongoose.connect(process.env.MONGO_URI).then(() =>{
    console.log('Mongodb connected')
}).catch((err) => {
    console.log(err)
})

app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json());
app.use(cors());

//base route
app.use('/', require('./routes/index'))

const PORT = process.env.PORT || 5050

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
