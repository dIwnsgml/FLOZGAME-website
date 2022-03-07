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
