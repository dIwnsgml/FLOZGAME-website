const road = document.querySelector('.floating-area .float .road');
const cube = document.querySelector('.floating-area .float .cube');
console.log(road);
setTimeout(function(){
  road.style='opacity: 1;'
},
800);

setTimeout(function(){
  cube.style='opacity: 1'
},1600);
const comment = document.querySelector(".comments form");
const check = document.querySelector("header button a")
console.log(check.href)
if(check.href.search("login") == -1){
  comment.style = "display: block;"
} else {
  comment.style = "display: none;"
}