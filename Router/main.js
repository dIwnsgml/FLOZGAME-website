const express = require("express");
const app = express();
var Router = express.Router();
/* Router.get('/', (req, res) => {
  res.render("index");
}); */

Router.get('/', function (req, res, next) {
  if (req.session.loggedin) {
    res.render('index', {
      button: "Logout",
      name: req.session.name,
      path: "account/logout"
    });
  } else {
    res.render('index', {
      button: "Login",
      name: req.session.name,
      path: "account/login"
    });
  }
});

Router.get('/robots.txt', (req, res) => {
  res.render("robots.txt");
});

Router.get('/sitemap.xmal', (req, res) => {
  res.render('sitemap.xml');
});

Router.get('/community', function (req, res, next) {
  if (req.session.loggedin) {
    res.render('community/main', {
      button: "Logout",
      //name: req.session.name,
      path: "account/logout"
    });
  } else {
    res.write("<script>alert('Login First')</script>");
    res.write("<script>window.location=\"/account/login\"</script>");
  }
});
/* io.on('connect', (socket) => {   //연결이 들어오면 실행되는 이벤트
  // socket 변수에는 실행 시점에 연결한 상대와 연결된 소켓의 객체가 들어있다.
  console.log(socket);
  //socket.emit으로 현재 연결한 상대에게 신호를 보낼 수 있다.
  socket.emit('usercount', io.engine.clientsCount);

  // on 함수로 이벤트를 정의해 신호를 수신할 수 있다.
  socket.on('message', (msg) => {
      //msg에는 클라이언트에서 전송한 매개변수가 들어온다. 이러한 매개변수의 수에는 제한이 없다.
      console.log('Message received: ' + msg);

      // io.emit으로 연결된 모든 소켓들에 신호를 보낼 수 있다.
      io.emit('message', msg);
  });
}); */

module.exports = Router;