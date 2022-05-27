const modal = document.querySelector(".modal");
const btn_chat = document.querySelector("#chat");
const btn_submit = document.querySelector("form i");
const message = document.querySelector("#text");
const btn_close_chat = document.querySelector(".modal .top button i");
const form = document.querySelector("#form");
const btn_every = document.querySelectorAll('a');
let textshow = document.querySelector("#textshow");

btn_chat.addEventListener('click', () => {

  modal.style = "display: block;";

  socket = io();
  socket.connect({reconnection: false});
  socket.on('bring_msg', (msg) => {
    var elem = document.createElement("li");
    elem.innerText = msg
    textshow.appendChild(elem);
  });


  socket.on('admin-online', () => {
    console.log('admin')
  })

  btn_submit.addEventListener('click', () => {
    console.log(socket.id)
    var msg = message.value;
    socket.emit('message', socket.id, msg);
    var elem = document.createElement("li");
    elem.innerText = msg
    textshow.appendChild(elem);
    console.log(msg);
  })

  btn_close_chat.addEventListener('click', () => {
    modal.style = "display: none;";
    var textLi = document.querySelectorAll('#textshow li');
    for(var i = 0; i < textLi.length; i++){
      textLi[i].remove()
    }
    socket.emit("Fdisconnect");
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