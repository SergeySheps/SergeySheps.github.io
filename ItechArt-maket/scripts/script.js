const menu__popUp = document.body.querySelector(".menu__pop-up");
const menu__popUp_open = document.body.querySelector(".menu__pop-up-open");

menu__popUp.addEventListener("mousedown",popUpMenuActs);
window.addEventListener("resize", resizeWindow);

function popUpMenuActs(e){
    e.preventDefault();
    menu__popUp_open.classList.toggle("visibleDisplay");
}
function resizeWindow(){
    menu__popUp_open.classList.remove("visibleDisplay");
}