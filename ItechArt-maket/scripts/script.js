const menu__popUp_toggle = document.body.querySelector(".menu__pop-up_toggle");
const menu__popUp_content = document.body.querySelector(".menu__pop-up-content");

menu__popUp_toggle.addEventListener("mousedown",popUpMenuActs);
window.addEventListener("resize", resizeWindow);

function popUpMenuActs(e){
    e.preventDefault();
    menu__popUp_content.classList.toggle("visibleDisplay");
}
function resizeWindow(){
    menu__popUp_content.classList.remove("visibleDisplay");
}