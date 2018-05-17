const startGameBut = document.body.querySelector(".startGame");
const restartGame = document.body.querySelectorAll(".restartGame");
const restartGameBut = restartGame[0];
const closeGameBut = restartGame[1];
const mainSector = document.body.querySelector(".main_content");
const curTime = document.body.querySelector(".watch");
startGameBut.addEventListener("click", GameStartHandler);
restartGameBut.addEventListener("click", Redirect);
closeGameBut.addEventListener("click", Redirect);

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

function ChosenNumFrontCard(img) {
    let rad = [...document.getElementsByName('frontCards')];
    rad.forEach((el, ind) => {
        if (el.checked) {
            img.src = el.value;
            sessionStorage.setItem('frontCardIndex', ind);
        }
    });
}
function ChosenComplexity() {
    const select = document.body.querySelector('.complexity select');
    const indexSelected = select.selectedIndex;
    const option = select.querySelectorAll('option')[indexSelected];
    const complexity = +option.value;
    sessionStorage.setItem('complexityIndex', indexSelected);
    return complexity;
}
function RandomInteger(array, min, max) {
    let value = min + Math.random() * (max + 1 - min);
    value = Math.floor(value);
    if (Find(array, value)) {
        return RandomInteger(array, min, max);
    }
    return value;
}
function Find(array, value) {
    if (array.indexOf(value) === -1) {
        return;
    }
    return true;
}
function CompareRandom(a, b) {
    return Math.random() - 0.5;
}
function AssemleArray() {
    let cardsArray = [];
    const complexity = ChosenComplexity();
    for (let i = 0; i < complexity / 2; i++) {
        let randomValue = RandomInteger(cardsArray, 1, 20);
        cardsArray.push(randomValue);
        cardsArray.push(randomValue);
    }
    cardsArray.sort(CompareRandom);
    return cardsArray;
}
function FixLookTimer(time) {
    return (time + "").length < 2 ? "0" + time : time;
}
function StartGameTime() {

    let timer;
    return function (isStart) {
        if (isStart) {
            let hours = 0;
            let minutes = 0;
            let seconds = 1;
            timer = setInterval(() => {
                curTime.textContent = `${FixLookTimer(hours)}:${FixLookTimer(minutes)}:${FixLookTimer(seconds)}`;
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
let StartGameTimeClosure;
let doingAfterCompareClosure;
function Redirect() {
    location.reload();
}
function GameStartHandler() {
    closeGameBut.style.display = "block";
    StartGameTimeClosure = StartGameTime();
    StartGameTimeClosure(true);
    startGameBut.style.display = "none";
    const cardsArray = AssemleArray();
    cardsArray.forEach(el => {
        const containerCard = document.createElement("div");
        containerCard.dataset.index = el;
        const contentCard = document.createElement("div");
        contentCard.classList.add("contentCard");
        containerCard.classList.add("containerCard");
        containerCard.addEventListener("click", RotateHandler);
        containerCard.appendChild(contentCard);
        const imgfront = document.createElement("img");
        ChosenNumFrontCard(imgfront);
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
function GetTimeInSeconds(time) {
    let arr = time.split(":");
    let result = 0;
    result += +arr[0] * 3600;
    result += +arr[1] * 60;
    result += +arr[2];
    return result;
}
function SetLocalStorage(record, obj) {
    const prevValue = localStorage.getItem(record);
    if (prevValue) {
        const prevTimeS = GetTimeInSeconds(JSON.parse(prevValue).time);
        const curTimeS = GetTimeInSeconds(obj.time);
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
    const complexity = ChosenComplexity();
    return function (isTheSame) {
        if (isTheSame) {
            currOpenedCards++;
            if (currOpenedCards === complexity / 2) {
                StartGameTimeClosure(false);
                let obj = {
                    complexity: complexity,
                    time: curTime.textContent,
                    name: ""
                }
                switch (complexity) {
                    case 10: {
                        SetLocalStorage('recordEasy', obj)
                        break;
                    }
                    case 20: {
                        SetLocalStorage("recordMedium", obj)
                        break;
                    }
                    case 40: {
                        SetLocalStorage("recordHard", obj)
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

function RotateHandler(event) {
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
}
function checkSameCards(containerCard) {
    return arrayOfOpeningCards[0].lastIndex === +containerCard.dataset.index;
}