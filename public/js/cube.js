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
console.log("d");
const cube_img_height = document.querySelector('.floating-area').offsetHeight;
const float_height = document.querySelector('.floating-area');
const middle = document.querySelector('.middle');
console.log(float_height);
middle.style = `top: 100px`;
const height = document.querySelector('body').scrollHeight;
console.log(height);
//height = height - 100;
const footer =  document.querySelector('footer');
let ssibal = height - footer.offsetHeight;
if(footer.offsetHeight > 400){
  ssibal += 300;
}
document.querySelector("footer").style.top = `${ssibal}px`;
console.log(footer.offsetHeight)