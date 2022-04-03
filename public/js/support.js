const modal = document.querySelector(".modal");
const btn_chat = document.querySelector("#chat");
const btn_submit = document.querySelector("form i");
const message = document.querySelector("#text");
const btn_close_chat = document.querySelector(".modal .top button i");
const form = document.querySelector("#form");

let check = 0;

btn_close_chat.addEventListener('click', () => {
    modal.style = "display: none;";
    check --;
})

btn_chat.addEventListener('click', () => {
  var socket = io();
  socket.on('usercount', (count) => {
  console.log(count);
  });
  
    if(check == 0){
      modal.style = "display: block;";
      check ++;
    } else {
      modal.style = "display: none;";
      check --;
    }
    btn_submit.addEventListener('click', () => {
      socket.emit('message', message.value);
      socket.on('message', (res) => {
      });
    })
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