
const faceCards = document.body.querySelector(".chooseFaceText");
const choose_face = document.body.querySelector(".choose_face");
const closedArrow = document.body.querySelector(".closedArrow");
const openedArrow = document.body.querySelector(".openedArrow");
const statistics = document.body.querySelector(".statistics");
const containerTable = document.body.querySelector(".containerTable");
const labels = [...document.body.querySelectorAll("label")];



const closeBut = document.querySelector(".remove-button");
const closeBlock = document.querySelector(".containerTable");
closeBut.addEventListener("click", () => handlerClose(closeBlock));
function handlerClose(elem) {
    elem.style.display = "none";
}
containerTable.style.display = "none";
openedArrow.style.display = "none";
choose_face.style.display = "none";
faceCards.addEventListener("mousedown", ShowFaceCards);
statistics.addEventListener("click", ShowRecordsTable);
labels.forEach(el => {
    el.addEventListener("change", ShowFaceCards);
});
function SetTableValues(tds, record) {
    const valueEasy = localStorage.getItem(record);
    if (valueEasy) {
        let valueEasyObj = JSON.parse(valueEasy);
        tds[0].textContent = valueEasyObj.complexity + " карт";
        tds[1].textContent = valueEasyObj.time;
        tds[2].textContent = valueEasyObj.name;
    }
}
function ShowRecordsTable() {
    const tbodyTableRecords = document.body.querySelector(".tbodyTableRecords");
    const linesTable = [...tbodyTableRecords.querySelectorAll("tr")];
    const tds1 = [...linesTable[0].querySelectorAll("td")];
    const tds2 = [...linesTable[1].querySelectorAll("td")];
    const tds3 = [...linesTable[2].querySelectorAll("td")];
    SetTableValues(tds1, 'recordEasy');
    SetTableValues(tds2, 'recordMedium');
    SetTableValues(tds3, 'recordHard');
    containerTable.style.display = "block";

}
function ShowFaceCards(e) {
    if (choose_face.style.display === "none") {
        choose_face.style.display = "block";
        openedArrow.style.display = "inline";
        closedArrow.style.display = "none";
    } else {
        choose_face.style.display = "none";
        closedArrow.style.display = "inline";
        openedArrow.style.display = "none";
    }
    e.preventDefault();
}