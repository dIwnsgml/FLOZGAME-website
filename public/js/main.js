const swiper = new Swiper('.swiper', {
  // Optional parameters
  loop: true,
  slidesPerView: 1,
  autoplay: { 
    delay: 3000 
  },
  centeredSlides: true,
  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  }

  // And if we need scrollbar

});

//
const width = document.clientWidth;
console.log(width);
const game_img = document.querySelector('.games .inner .container .box .game-img:nth-child(1)');
const button_more = document.querySelector('.games .inner .container .box .more');
const button_download = document.querySelector('.games .inner .container .box .download');
console.log(game_img);
console.log(button_more);
game_img.onmouseover = function(){
  button_more.style = 'opacity: 1; visibility: visible;'
  button_download.style = 'opacity: 1; visibility: visible;'
  this.style = 'opacity: 0.3;'
}
game_img.onmouseout = function(){
  button_more.style = 'opacity: 0; visibility: hidden;'
  button_download.style = 'opacity: 0; visibility: hidden;'
  this.style = 'opacity: 1;'
}
button_more.onmouseover = function(){
  this.style = 'opacity: 1; visibility: visible;'
  button_download.style = 'opacity: 1; visibility: visible;'
  game_img.style = 'opacity: 0.3;'
}
button_more.onmouseout = function(){
  this.style = 'opacity: 0; visibility: hidden;'
  button_download.style = 'opacity: 0; visibility: hidden;'
  game_img.style = 'opacity: 1;'
}
button_download.onmouseover = function(){
  this.style = 'opacity: 1; visibility: visible;'
  button_more.style = 'opacity: 1; visibility: visible;'
  game_img.style = 'opacity: 0.3;'
}
button_download.onmouseout = function(){
  this.style = 'opacity: 0; visibility: hidden;'
  button_more.style = 'opacity: 0; visibility: hidden;'
  game_img.style = 'opacity: 1;'
}
const button_download_a = document.querySelector('.games .inner .container .box .btn .more a');
const btn_da_h = button_download_a.offsetHeight;
const btn_dh = document.querySelector('.games .inner .container .box .btn .more');
console.log(btn_dh.offsetHeight);
if(btn_dh.offsetHeight > 20){
  btn_dh.style = 'top: -10px;'
}
