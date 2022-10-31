const express = require("express");
const app = express();
const port = 80;
const ejs = require("ejs");
const createError = require("http-errors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const expressValidator = require('express-validator');
const session = require("express-session");
const flash = require("express-flash");
const bodyParser = require("body-parser");
const connection = require("./model/db");
const helmet = require("helmet");
const secret = require('./config/secret.json').place[0];
const http = require('http');
const crypto = require("crypto")
var server = http.createServer(app);
var io = require('socket.io')(server);



app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
//app.use(helmet.contentSecurityPolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use((req, res, next) => {
  res.locals.cspNonce = crypto.randomBytes(16).toString("hex");
  res.setHeader("X-XSS-protection", "1; mode=block");
  //console.log(res.locals.cspNonce)
  next();
});
app.use(helmet.frameguard({ action: 'SAMEORIGIN' }));

const cspOptions = {
  directives: {
    defaultSrc: ["'self'", "*.googleapis.com", "'unsafe-inline'", "*.fonts.gstatic.com", "*.googletagmanager.com", "*.fontawesome.com", "https://googleads.g.doubleclick.net", "https://pagead2.googlesyndication.com",  'https://tpc.googlesyndication.com/sodar/sodar2.js', ""],
    scriptSrc: ["'self'", "'unsafe-eval'", "*.swiper-bundle.min.js", "https://unpkg.com/swiper@6.8.4/swiper-bundle.min.js", "*.fontawesome.com", "https://pagead2.googlesyndication.com", "*.google.com", "partner.googleadservices.com", "https://tpc.googlesyndication.com", "*.googletagmanager.com"],
    frameSrc: ["'self'", "https://googleads.g.doubleclick.net", 'https://tpc.googlesyndication.com', "https://*.google.com", "*.googletagmanager.com"],
    "img-src": ["'self'", "data:", "https://pagead2.googlesyndication.com", "https://ad.doubleclick.net", "*.googletagmanager.com"],
  }
}

app.use(helmet.contentSecurityPolicy(cspOptions))

const mainRouter = require("./Router/main");
const accountRouter = require("./Router/account");
const gameRouter = require("./Router/games");
const supportRouter = require("./Router/support")(io);
const adminRouter = require("./Router/admin")(io);
const ourStoryRouter = require("./Router/our-story");

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('socketio', io);


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(secret.secretId));
app.use(express.static(path.join(__dirname, '/public')));

app.use(session({
  secret: secret.secretId,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    maxAge: 1000 * 60 * 10,
    secure: false,
    httpOnly: true,
    signed: true,
    authorized: true,
  },
  //store: new fileStore(),
}))

app.use(flash());
app.use(expressValidator());

app.use('/', mainRouter);
app.use('/account', accountRouter);
app.use('/games', gameRouter);
app.use('/support', supportRouter);
app.use('/admin', adminRouter);
app.use('/our-story', ourStoryRouter);

io.sockets.on('connection', async (socket) => {

  socket.onAny((event, args) => {
    console.log(event, args, io.sockets.adapter.rooms);
  });

  socket.on('admin_online', () => {
    socket.broadcast.emit('online');
    console.log('admin_online')
  })

  socket.on('admin_offline', () => {
    socket.broadcast.emit('offline');
    console.log('admin_offline')
  })

  socket.on('start_bring', () => {
    connection.query("SELECT * FROM chat WHERE room = ?", socket.id, (err, rows, fields) => {
      for(var i = 0; typeof rows[i] != 'undefined'; i++){
        if(socket.userId == rows[i].user){
          io.to(socket.id).emit('bring_msg', rows[i].msg, rows[i].time, 'me')
          console.log('me')
        } else {
          io.to(socket.id).emit('bring_msg', rows[i].msg, rows[i].time, rows[i].user)
        }
        console.log(rows[i].msg)
      }
    })
  })

  socket.on('admin_start_bring', (room) => {
    connection.query("SELECT * FROM chat WHERE room = ?", room, (err, rows, fields) => {
      for(var i = 0; typeof rows[i] != 'undefined'; i++){
        if(socket.userId == rows[i].user){
          io.to(socket.id).emit('admin_bring_msg', rows[i].msg, rows[i].time, 'me')
          console.log('me')
        } else {
          io.to(socket.id).emit('admin_bring_msg', rows[i].msg, rows[i].time, rows[i].user)
        }
        console.log(rows[i].msg)
      }
    })
  })

  socket.on('join', (room) => {
    socket.join(room);
    console.log(io.sockets.adapter.rooms)
  })
  
  socket.on('join-room', (room) => {
    socket.join(room);
  })

  socket.on('Fdisconnect', () => {
    console.log('disconnected');
    socket.disconnect();
  })

  socket.on("message", (room, msg) => {
    var info = {
      user: socket.userId,
      room: room,
      msg: msg,
    }
    connection.query("INSERT INTO chat SET ?", info);
    if(socket.id == room){
      io.to(room).emit('msg', msg, 'me');
    } else {
      io.to(room).emit('msg', msg, room);
    }
    console.log(msg, room)
  })
});


app.get('*',function(req,res){
  res.redirect('/');
});

// catch 404
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // error for local
  if(secret.place != 'dev'){
    err.message = {}
    res.render('error');
  }
  /* res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}; */

  // 에러 보여줌
  res.status(err.status || 500);
  res.render(err.message);
});

server.listen(port, secret.address, () => {
  console.log(`Server running ${port}`);
});

module.exports = app;