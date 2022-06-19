const modal = document.querySelector(".modal");
const btn_chat = document.querySelector("#chat");
const btn_submit = document.querySelector("#msg-send");
const message = document.querySelector("#text");
const btn_close_chat = document.querySelector(".modal .top button");
const btn_every = document.querySelectorAll('a');
let textshow = document.querySelector("#textshow");

let user_info = document.querySelector('#user-lists');
let user_info_o = document.querySelector('#user-lists-o');
console.log(user_info.innerHTML.split('},').length)
let user_info_length = user_info.innerHTML.split('},').length;
for(let i = 0; user_info_length > i; i++){
  user_info_o.innerHTML += user_info.innerHTML.split('},')[i].split(',')[1] + user_info.innerHTML.split('},')[i].split(',')[3] + user_info.innerHTML.split('},')[i].split(',')[6] + "<br>";
};


let socket = io();

socket.emit('admin_online');

socket.on('disconnect', () => {
  socket.emit('admin_offline')
})

socket.on('msg', (msg, user) => {
  let elem = document.createElement("li");
  let msg_time = document.createElement("li");
  let now = new Date();
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
  let elem = document.createElement("li");
  let msg_time = document.createElement("li");
  elem.innerText = msg;
  time = new Date(time).toLocaleString();

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
  let room = chat.value;
  socket.emit('join', room)
  socket.emit('admin_start_bring', room)

  modal.style = "display: block;";
})

btn_submit.addEventListener('click', () => {
  console.log(socket.id, socket.userId)
  let msg = message.value;
  let room = chat_textarea.value;
  socket.emit('message', room, msg);
  message.value = "";
})

btn_close_chat.addEventListener('click', () => {
  modal.style = "display: none;"
  socket.emit('admin_offline')
})