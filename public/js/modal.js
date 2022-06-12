const btn_logo = document.querySelector("#btn-logo");
const btn_modal_close = document.querySelector(".modal #btn-modal-close");
const modal = document.querySelector(".modal");
const header = document.querySelector("header");

const btn_open_games = document.querySelector("#btn-open-games");
const games_hidden = document.querySelector(".modal #modal-games .hidden-area");

const btn_open_business = document.querySelector("#btn-open-business");
const business_hidden = document.querySelector(".modal #modal-business .hidden-area");

const caret = document.querySelectorAll(".modal #caret");

btn_logo.addEventListener('click', () => {
  modal.style = "display: block;";
  modal.classList.add("animation");
  console.log(document.body.scrollHeight, window.pageYOffset);
  document.querySelector("body").style.overflow = 'hidden-area';
})
window.onscroll = function(e) {
  if(window.pageYOffset != 0) {
    header.style = "background-color: black;";
  } else {
    header.style = "background-color: none;"
  }
}

btn_modal_close.addEventListener('click', () => {
  modal.classList.remove("animation");
  modal.style = "display: none;";
  document.querySelector("body").style.overflow = 'visible';
  btn_show_list_check = [0, 0];
  caret[0].classList.remove('fa-caret-up');
  caret[0].classList.add('fa-caret-down');

  caret[1].classList.remove('fa-caret-up');
  caret[1].classList.add('fa-caret-down');

  games_hidden.style = "display: none;";
  business_hidden.style = "display: none;";
})

let btn_show_list_check = [0, 0];

btn_open_games.addEventListener('click', () => {
  if(btn_show_list_check[0] == 0){
    games_hidden.style = "display: block;";
    business_hidden.style = "display: none;";
    btn_show_list_check = [1, 0];
    caret[0].classList.remove('fa-caret-down');
    caret[0].classList.add('fa-caret-up');

    caret[1].classList.remove('fa-caret-up');
    caret[1].classList.add('fa-caret-down');
  } else {
    games_hidden.style = "display: none;";
    btn_show_list_check[0] = 0;

    caret[0].classList.remove('fa-caret-up');
    caret[0].classList.add('fa-caret-down');
  }
})

btn_open_business.addEventListener('click', () => {
  if(btn_show_list_check[1] == 0 ){
    business_hidden.style = "display: block;";
    games_hidden.style = "display: none;";
    btn_show_list_check = [0, 1];
    caret[1].classList.remove('fa-caret-down');
    caret[1].classList.add('fa-caret-up');

    caret[0].classList.remove('fa-caret-up');
    caret[0].classList.add('fa-caret-down');
  } else {
    business_hidden.style = "display: none;";
    btn_show_list_check[1] = 0;

    caret[1].classList.remove('fa-caret-up');
    caret[1].classList.add('fa-caret-down');
  }
})

//modal-2
const btn_open_modal2 = document.querySelector("#modal2-open");
const btn_modal2_close = document.querySelector(".modal-2 #btn-modal-close");
const modal2 = document.querySelector(".modal-2");

const btn_open_who = document.querySelector("#btn-open-who");
const who_hidden = document.querySelector(".modal-2 #modal2-who .hidden-area");

const btn_open_work = document.querySelector("#btn-open-work");
const work_hidden = document.querySelector(".modal-2 #modal2-work .hidden-area");

const caret2 = document.querySelectorAll(".modal-2 #caret");

btn_open_modal2.addEventListener('click', () => {
  modal2.style = "display: block;";
  modal2.classList.add("animation");
  console.log(document.body.scrollHeight, window.pageYOffset);
  document.querySelector("body").style.overflow = 'hidden-area';
})
window.onscroll = function(e) {
  if(window.pageYOffset != 0) {
    header.style = "background-color: black;";
  } else {
    header.style = "background-color: none;"
  }
}

btn_modal2_close.addEventListener('click', () => {
  modal2.classList.remove("animation");
  modal2.style = "display: none;";
  document.querySelector("body").style.overflow = 'visible';
  btn_show_list_check2 = [0, 0];
  caret2[0].classList.remove('fa-caret-up');
  caret2[0].classList.add('fa-caret-down');

  caret2[1].classList.remove('fa-caret-up');
  caret2[1].classList.add('fa-caret-down');

  who_hidden.style = "display: none;";
  work_hidden.style = "display: none;";
})

let btn_show_list_check2 = [0, 0];

btn_open_who.addEventListener('click', () => {
  if(btn_show_list_check2[0] == 0){
    who_hidden.style = "display: block;";
    work_hidden.style = "display: none;";
    btn_show_list_check2 = [1, 0];
    caret2[0].classList.remove('fa-caret-down');
    caret2[0].classList.add('fa-caret-up');

    caret2[1].classList.remove('fa-caret-up');
    caret2[1].classList.add('fa-caret-down');
  } else {
    who_hidden.style = "display: none;";
    btn_show_list_check2[0] = 0;

    caret2[0].classList.remove('fa-caret-up');
    caret2[0].classList.add('fa-caret-down');
  }
})

btn_open_work.addEventListener('click', () => {
  if(btn_show_list_check2[1] == 0 ){
    work_hidden.style = "display: block;";
    who_hidden.style = "display: none;";
    btn_show_list_check2 = [0, 1];
    caret2[1].classList.remove('fa-caret-down');
    caret2[1].classList.add('fa-caret-up');

    caret2[0].classList.remove('fa-caret-up');
    caret2[0].classList.add('fa-caret-down');
  } else {
    work_hidden.style = "display: none;";
    btn_show_list_check2[1] = 0;

    caret2[1].classList.remove('fa-caret-up');
    caret2[1].classList.add('fa-caret-down');
  }
})