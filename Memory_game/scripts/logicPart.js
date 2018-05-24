const startGameBut = document.body.querySelector(".startGame");
const restartGame = document.body.querySelectorAll(".restartGame");
const restartGameBut = restartGame[0];
const closeGameBut = restartGame[1];
const mainSector = document.body.querySelector(".main_content");
const curTime = document.body.querySelector(".watch");
startGameBut.addEventListener("click", gameStartHandler);
restartGameBut.addEventListener("click", redirect);
closeGameBut.addEventListener("click", redirect);

const select = document.body.querySelector('.complexity select');
const sessionCompIndex = sessionStorage.getItem("complexityIndex");
const sessionFrontCardIndex = sessionStorage.getItem('frontCardIndex');
if (sessionCompIndex) {
    const option = select.querySelectorAll('option')[+sessionCompIndex];
    option.selected = "selected";
}
if (sessionFrontCardIndex) {
    let rad = [...document.getElementsByName('frontCards')];
    rad[+sessionFrontCardIndex].checked = "checked";
}

function chosenNumFrontCard(img) {
    let rad = [...document.getElementsByName('frontCards')];
    rad.forEach((el, ind) => {
        if (el.checked) {
            img.src = el.value;
            sessionStorage.setItem('frontCardIndex', ind);
        }
    });
}
function chosenComplexity() {
    const select = document.body.querySelector('.complexity select');
    const indexSelected = select.selectedIndex;
    const option = select.querySelectorAll('option')[indexSelected];
    const complexity = +option.value;
    sessionStorage.setItem('complexityIndex', indexSelected);
    return complexity;
}
function randomInteger(array, min, max) {
    let value = min + Math.random() * (max + 1 - min);
    value = Math.floor(value);
    if (find(array, value)) {
        return randomInteger(array, min, max);
    }
    return value;
}
function find(array, value) {
    if (array.indexOf(value) === -1) {
        return;
    }
    return true;
}
function compareRandom(a, b) {
    return Math.random() - 0.5;
}
function assemleArray() {
    let cardsArray = [];
    const complexity = chosenComplexity();
    for (let i = 0; i < complexity / 2; i++) {
        let randomValue = randomInteger(cardsArray, 1, 20);
        cardsArray.push(randomValue);
        cardsArray.push(randomValue);
    }
    cardsArray.sort(compareRandom);
    return cardsArray;
}
function fixLookTimer(time) {
    return (time + "").length < 2 ? "0" + time : time;
}
function startGameTime() {

    let timer;
    return function (isStart) {
        if (isStart) {
            let hours = 0;
            let minutes = 0;
            let seconds = 1;
            timer = setInterval(() => {
                curTime.textContent = `${fixLookTimer(hours)}:${fixLookTimer(minutes)}:${fixLookTimer(seconds)}`;
                seconds++;
                if (seconds === 60) {
                    minutes++;
                    seconds = 0;
                }
                if (minutes === 60) {
                    minutes = 0;
                    hours++;
                }
            }, 1000);
        } else {
            clearInterval(timer);
        }
    }
}
let startGameTimeClosure;
let doingAfterCompareClosure;
function redirect() {
    location.reload();
}
const field = document.body.querySelector(".main_content");
field.addEventListener("mousedown",rotateHandler);

function gameStartHandler() {
    closeGameBut.style.display = "block";
    startGameTimeClosure = startGameTime();
    startGameTimeClosure(true);
    startGameBut.style.display = "none";
    const cardsArray = assemleArray();
    cardsArray.forEach(el => {
        const containerCard = document.createElement("div");
        containerCard.dataset.index = el;
        const contentCard = document.createElement("div");
        contentCard.classList.add("contentCard");
        containerCard.classList.add("containerCard");
        containerCard.appendChild(contentCard);
        const imgfront = document.createElement("img");
        chosenNumFrontCard(imgfront);
        imgfront.classList.add("stylesCard");
        containerCard.appendChild(imgfront);
        const imgback = document.createElement("img");
        imgback.classList.add("stylesCard");
        imgback.src = (imgfront.src).replace("front", `${el}`);
        contentCard.appendChild(imgback);
        mainSector.appendChild(containerCard);
        doingAfterCompareClosure = doingAfterCompare();
    });

}
let arrayOfOpeningCards = [];
function getTimeInSeconds(time) {
    let arr = time.split(":");
    let result = 0;
    result += +arr[0] * 3600;
    result += +arr[1] * 60;
    result += +arr[2];
    return result;
}
function setLocalStorage(record, obj) {
    const prevValue = localStorage.getItem(record);
    if (prevValue) {
        const prevTimeS = getTimeInSeconds(JSON.parse(prevValue).time);
        const curTimeS = getTimeInSeconds(obj.time);
        if (curTimeS < prevTimeS) {
            obj.name = prompt("Поздравляем! Вы установили новый рекорд по времени на этой сложности!\n Введите своё имя");
            localStorage.setItem(record, JSON.stringify(obj));

        }
    } else {
        obj.name = prompt("Поздравляем! Вы установили новый рекорд по времени на этой сложности!\n Введите своё имя");
        localStorage.setItem(record, JSON.stringify(obj));
    }
}
function doingAfterCompare() {
    let currOpenedCards = 0;
    const complexity = chosenComplexity();
    return function (isTheSame) {
        if (isTheSame) {
            currOpenedCards++;
            if (currOpenedCards === complexity / 2) {
                startGameTimeClosure(false);
                let obj = {
                    complexity: complexity,
                    time: curTime.textContent,
                    name: ""
                }
                switch (complexity) {
                    case 10: {
                        setLocalStorage('recordEasy', obj)
                        break;
                    }
                    case 20: {
                        setLocalStorage("recordMedium", obj)
                        break;
                    }
                    case 40: {
                        setLocalStorage("recordHard", obj)
                        break;
                    }
                }
                restartGameBut.style.display = "block";
                closeGameBut.style.display = "none";

            }
        }
        else {
            let arrForSimultaneouslyRotate = arrayOfOpeningCards.map((el) => {
                return () => {
                    setTimeout(() => { el.card.style.transform = "rotateY(0deg)" }, 450)
                }
            })

            arrForSimultaneouslyRotate.forEach(el => el());
        }
        arrayOfOpeningCards.length = 0;
    }
}

function rotateHandler(event) {
    const target = event.target;
    if (!target.classList.contains("stylesCard")){
        return;
    }
    const rotatedContainer = event.target.closest(".containerCard");
    rotatedContainer.style.transform = "rotateY(180deg)";

    let lastCard = {
        lastIndex: +rotatedContainer.dataset.index,
        card: rotatedContainer
    }
    arrayOfOpeningCards.push(lastCard);
    if (arrayOfOpeningCards.length === 2) {
        doingAfterCompareClosure(checkSameCards(rotatedContainer));
    }
    event.preventDefault();
}
function checkSameCards(containerCard) {
    return arrayOfOpeningCards[0].lastIndex === +containerCard.dataset.index;
}