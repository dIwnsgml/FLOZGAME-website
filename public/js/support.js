const modal3 = document.querySelector(".modal3");
const btn_chat = document.querySelector("#chat");
const btn_submit = document.querySelector("#msg-send");
const message = document.querySelector("#text");
const btn_close_chat = document.querySelector(".modal3 .top button");
const btn_every = document.querySelectorAll('a');
let textshow = document.querySelector("#textshow");
const circle = document.querySelector(".modal3 .top .circle");


socket = io();
socket.emit("start_bring")
socket.on('online', () => {
  circle.style = 'background-color: green;';
  console.log('online');
})

socket.on('offline', () => {
  circle.style = 'background-color: #808080;';
  console.log('offline');
})
let all_msg = [];
let msg_n = 0;
socket.on('bring_msg', (msg, time, user) => {

  let elem = document.createElement("li");
  let msg_time = document.createElement("li");
  elem.innerText = msg;
  time = new Date(time);
  //store in arr
  all_msg[msg_n] = msg;
  all_msg[msg_n.time] = time;
  msg_n += 1;
  if(typeof all_msg[msg_n - 1] != 'undefined'){
    let past_time = new Date(all_msg[msg_n.time]);
    console.log(past_time.getDate())
    if(past_time.getDate() != time.getDate() && past_time.getMonth() != time.getMonth()){
      console.log("di")
    }
  }
  console.log(time.getDate());
  time = time.toLocaleString();

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
  modal3.style = "display: block;";
  textshow.scrollTo(0, 100000000);
})

btn_submit.addEventListener('click', () => {
  let msg = message.value;
  socket.emit('message', socket.id, msg);
  message.value = "";
})

btn_close_chat.addEventListener('click', () => {
  modal3.style = "display: none;";
})