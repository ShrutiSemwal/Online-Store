require('dotenv').config() //to access variables in env
const express = require('express');
const app= express()
const ejs = require('ejs')
const path= require('path')
const expressLayout= require('express-ejs-layouts')
const PORT = process.env.PORT || 3000
const mongoose= require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore= require('connect-mongo')
const passport = require('passport')
const Emitter = require('events')

//Database connection
const url = process.env.MONGO_CONNECTION_URL;
mongoose.connect(url, {useUnifiedTopology: true
});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
}).on('error', function (err) {
    console.log(err);
 });


//Session store
//let mongoStore = new MongoDbStore({
                  //mongooseConnection: connection,
                  //collection: 'sessions'
//})

//Event Emitter
const eventEmitter = new Emitter() 
app.set('eventEmitter', eventEmitter)

//Session config (acts as a middleware)
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoDbStore.create({
        //client: connection.getClient()
        mongoUrl: process.env.MONGO_CONNECTION_URL
    }),
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24} //24 hours
}))

 //Passport config
 const passportInit = require('./app/config/passport')
 passportInit(passport)
 app.use(passport.initialize())
 app.use(passport.session())

app.use(flash())  //use as a middleware
//Assets
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())

//Global Middleware
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

//set Template engine
app.use(expressLayout)
app.set('views', path.join(__dirname,'/resources/views'))
app.set('view engine', 'ejs')


require('./routes/web.js')(app)
app.use((req,res) => {
    res.status(404).render('errors/error')
})

const server = app.listen(PORT, ()=> {
    console.log(`Listening on port ${PORT}`)
})

//Socket

const io = require('socket.io')(server)
io.on('connection', (socket) => {
    //Join 
    socket.on('join', (orderId)=> {
             socket.join(orderId)
    })
})

eventEmitter.on('orderUpdated', (data) => {
       io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data)
})

