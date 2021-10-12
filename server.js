require('dotenv').config()
const express = require('express');
const app= express()
const ejs = require('ejs')
const path= require('path')
const expressLayout= require('express-ejs-layouts')
const PORT = process.env.PORT || 3000
const mongoose= require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore= require('connect-mongodb-session')(session)

//Database connection
const url ='mongodb://localhost/roomDecor';
mongoose.connect(url, {useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology: true, useFindAndModify:true
});
const connection = mongoose.connection;
//connection.on('error', console.error.bind(console,'connection failed'));
connection.once('open', () => {
    console.log('Database connected successfully...');
}).on('error', function (err) {
    console.log(err);
  });

//Session store
let mongoStore = new MongoDbStore({
                  mongooseConnection: connection,
                  collection: 'sessions'
})

//Session config (acts as a middleware)
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24} //24 hours
}))

app.use(flash())  //use as a middleware
//Assets
app.use(express.static('public'))
app.use(express.json())

//Global Middleware
app.use((req, res, next) => {
    res.locals.session = req.session
    next()
})

//set Template engine
app.use(expressLayout)
app.set('views', path.join(__dirname,'/resources/views'))
app.set('view engine', 'ejs')


require('./routes/web.js')(app)

app.listen(PORT, ()=> {
    console.log(`Listening on port ${PORT}`)
})