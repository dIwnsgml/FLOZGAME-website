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
const mysql = require("mysql");
const connection = require("./model/db");
const helmet = require("helmet");
const secret = '123456cat';
const http = require('http');
var server = http.createServer(app);
var io = require('socket.io')(server);
const fileStore = require('session-file-store')(session);



app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
//app.use(helmet.noSniff());
//app.use(helmet.contentSecurityPolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());


const mainRouter = require("./Router/main");
const accountRouter = require("./Router/account");
const gameRouter = require("./Router/games");
const supportRouter = require("./Router/support")(io);
const adminRouter = require("./Router/admin")(io);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('socketio', io);


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(secret));
app.use(express.static(path.join(__dirname, '/public')));

app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    maxAge: 1000 * 60 * 10,
    secure: false,
    httpOnly: false,
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

/* io.on('connection', (socket) => {
  //var room = req.session.name;
  socket.on('discconect', () => {
    console.log("disconnected");
  })
  socket.emit('usercount', io.engine.clientsCount);
  // on 함수로 이벤트를 정의해 신호를 수신할 수 있다.
  socket.on('message', (msg) => {
    var room = msg.room;
      io.emit('message', msg);
      console.log(msg);
      console.log(room);
  });

  socket.on('join', (requsetData) => {
    socket.join(room)
  })
}); */


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
  // 로컬에서만 에러
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // 에러 보여줌
  res.status(err.status || 500);
  res.render(err);
});

//172.31.13.110
server.listen(port, "127.0.0.1", () => {
  console.log(`Server running ${port}`);
});

module.exports = app;