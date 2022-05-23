var socket = io();
socket.connect();

var user_info = document.querySelector('#user-lists');
var user_info_o = document.querySelector('#user-lists-o');
console.log(user_info.innerHTML.split('},').length)
var user_info_length = user_info.innerHTML.split('},').length;
for(var i = 0; user_info_length > i; i++){
  user_info_o.innerHTML += user_info.innerHTML.split('},')[i].split(',')[1] + user_info.innerHTML.split('},')[i].split(',')[3] + user_info.innerHTML.split('},')[i].split(',')[6] + "<br>";
};

const btn_chat = document.querySelector('#btn-chat');

let btn_chat_check = 0;

btn_chat.addEventListener('click', () => {
  if (btn_chat_check == 0 ){
    
  }
})