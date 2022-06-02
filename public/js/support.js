const modal = document.querySelector(".modal");
const btn_chat = document.querySelector("#chat");
const btn_submit = document.querySelector("#msg-send");
const message = document.querySelector("#text");
const btn_close_chat = document.querySelector(".modal .top button");
const btn_every = document.querySelectorAll('a');
let textshow = document.querySelector("#textshow");
const circle = document.querySelector(".modal .top .circle");


socket = io();

socket.on('online', () => {
  circle.style = 'background-color: green;';
  console.log('online');
})

socket.on('offline', () => {
  circle.style = 'background-color: #808080;';
  console.log('offline');
})

socket.on('bring_msg', (msg, time, user) => {
  var elem = document.createElement("li");
  var msg_time = document.createElement("li");
  elem.innerText = msg;
  time = new Date(time);
  console.log(time.getDate());
  time = time.toLocaleString();
  //time = time.split('-')[2].split('T')[1].split(':')[0] + ':' + time.split('-')[2].split('T')[1].split(':')[1];
  /* if(time.split(':')[0] > 12){
    time = time.split(':')[0] - 12 + time.split(':')[1];
    time += ' PM';
  } else {
    time += ' AM';
  } */

  //console.log(time);

  if(time.search('오전') != -1){
    time = time.replace('오전', '');
    time = time.replace('  ', ' ');
    time = time.split(' ')[3].split(':')[0] + ':' +time.split(' ')[3].split(':')[1];
    time += 'AM';
  } else {
    time = time.replace('오후', '');
    time = time.replace('  ', ' ');
    time = time.split(' ')[3].split(':')[0] + ':' +time.split(' ')[3].split(':')[1];
    time += 'PM'
  }
  console.log(time);

  msg_time.innerText = time;
  if(user == 'me'){
    elem.style = 'float: right;';
    msg_time.style = "float: right;";
  }
  elem.setAttribute('class', 'chat');
  textshow.appendChild(elem);
  msg_time.setAttribute('class', 'time');
  textshow.appendChild(msg_time);
  textshow.scrollTo(0, 100000000);
});

socket.on('msg', (msg, user) => {
  var elem = document.createElement("li");
  var msg_time = document.createElement("li");
  var now = new Date();
  if(now.getHours() > 12){
    time = now.getHours() - 12 + ':' + now.getMinutes();
    time += ' PM';
    msg_time.innerText = time;
    elem.innerText = msg;
  } else {
    time = now.getHours() + ':' + now.getMinutes();
    time += ' AM';
    msg_time.innerText = time;
    elem.innerText = msg;
  }
  console.log(now)

  if(user == 'me'){
    elem.style = 'float: right;';
    msg_time.style = "float: right;";
  }
  elem.setAttribute('class', 'chat');
  textshow.appendChild(elem);
  msg_time.setAttribute('class', 'time');
  textshow.appendChild(msg_time);
  textshow.scrollTo(0, 100000000);
})

socket.on('admin-online', () => {
  console.log('admin')
})

btn_chat.addEventListener('click', () => {
  socket.connect({reconnection: false});
  socket.emit('join', socket.id)
  modal.style = "display: block;";
  socket.emit("start_bring")
})

btn_submit.addEventListener('click', () => {
  var msg = message.value;
  socket.emit('message', socket.id, msg);
  message.value = "";
})

btn_close_chat.addEventListener('click', () => {
  modal.style = "display: none;";
  var textLi = document.querySelectorAll('#textshow li');
  for(var i = 0; i < textLi.length; i++){
    textLi[i].remove()
  }
  socket.emit("Fdisconnect");
})


//window.open("youtube.com", "ong", "width = 500px, height = 100px;");
// 메시지 수신시 HTML에 메시지 내용 작성
/* socket.on('message', (msg) => {
    var messageList = document.getElementById('messages');
    var messageTag = document.createElement("li");
    messageTag.innerText = msg;
    messageList.appendChild(messageTag);
});

msgform.onsubmit = (e) => {
    e.preventDefault();
    var msginput = document.getElementById('msginput');

    // socket.emit으로 서버에 신호를 전달
    socket.emit('message', msginput.value);

    msginput.value = "";
}; */