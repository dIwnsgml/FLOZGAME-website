const modal = document.querySelector(".modal");
const btn_chat = document.querySelector("#chat");
const btn_submit = document.querySelector("#msg-send");
const message = document.querySelector("#text");
const btn_close_chat = document.querySelector(".modal .top button");
const btn_every = document.querySelectorAll('a');
let textshow = document.querySelector("#textshow");

var user_info = document.querySelector('#user-lists');
var user_info_o = document.querySelector('#user-lists-o');
console.log(user_info.innerHTML.split('},').length)
var user_info_length = user_info.innerHTML.split('},').length;
for(var i = 0; user_info_length > i; i++){
  user_info_o.innerHTML += user_info.innerHTML.split('},')[i].split(',')[1] + user_info.innerHTML.split('},')[i].split(',')[3] + user_info.innerHTML.split('},')[i].split(',')[6] + "<br>";
};


var socket = io();

socket.emit('admin_online');

socket.on('disconnect', () => {
  socket.emit('admin_offline')
})

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
  if(user != 'me'){
    elem.style = 'float: right;';
    msg_time.style = "float: right;";
  }
  elem.setAttribute('class', 'chat');
  textshow.appendChild(elem);
  msg_time.setAttribute('class', 'time');
  textshow.appendChild(msg_time);
  textshow.scrollTo(0, 100000000);
})

socket.on('admin_bring_msg', (msg, time, user) => {
  var elem = document.createElement("li");
  var msg_time = document.createElement("li");
  elem.innerText = msg;
  time = new Date(time).toLocaleString();
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


let chat_textarea = document.querySelector('#chat');

let chat_submit = document.querySelector('#name-submit')

chat_submit.addEventListener('click', () => {
  socket.connect();
  socket.emit('admin_online');
  var room = chat.value;
  socket.emit('join', room)
  socket.emit('admin_start_bring', room)

  modal.style = "display: block;";
})

btn_submit.addEventListener('click', () => {
  console.log(socket.id)
  var msg = message.value;
  var room = chat_textarea.value;
  socket.emit('message', room, msg);
  message.value = "";
})

btn_close_chat.addEventListener('click', () => {
  modal.style = "display: none;"
  var textLi = document.querySelectorAll('#textshow li');
  for(var i = 0; i < textLi.length; i++){
    textLi[i].remove()
  }
  socket.emit('admin_offline')
  socket.emit('Fdisconnect');
})