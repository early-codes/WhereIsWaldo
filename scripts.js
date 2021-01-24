const image = document.getElementById("picWaldo");
const buttonPopUp = document.getElementsByClassName("buttonPopUp")[0];
const nameButton = document.getElementsByClassName("nameButton");
const nameText = document.getElementById("nameText");
const durationText = document.getElementById("durationText");
const scoreSaveButton = document.getElementById("scoreSaveButton");
const scorePopUp = document.getElementById("scorePopUp");
const highScorePopUp = document.getElementById("highScorePopUp");
let answers = null;
let clickX = null;
let clickY = null;
let startTime = null;
let endTime = null;
let foundCount = 0;

for (let i = 0; i < nameButton.length; i++) {
  nameButton[i].addEventListener("click", (event) => {
    checkTry(event);
  });
}

checkTry = (event) => {
  if (
    answers[event.target.id].x - 20 < clickX &&
    answers[event.target.id].x + 20 > clickX &&
    answers[event.target.id].y - 20 < clickY &&
    answers[event.target.id].y + 20 > clickY
  ) {
    if (foundCount < 3) {
      foundCount += 1;
    } else {
      endTime = new Date().getTime();
      gameDuration = Math.floor((endTime - startTime) / 1000);
      alert(gameDuration + " seconds");
      scoreSaver(gameDuration);
    }
    document.getElementById(event.target.id).remove();
  } else {
    alert("nope, try again!");
  }
  buttonPopUp.style.display = "none";
};

scoreSaver = (gameDuration) => {
  durationText.value = gameDuration;
  durationText.disabled = true;
  scorePopUp.style.display = "block";
  scoreSaveButton.addEventListener("click", saveScore);
};

saveScore = async () => {
  await fetch(
    "https://whereiswaldo-49253-default-rtdb.europe-west1.firebasedatabase.app/scores.json",
    {
      method: "PATCH",
      body: JSON.stringify({
        [nameText.value.slice(0, 17)]: durationText.value,
      }),
    }
  ).then(async () => {
    const _scores = await fetch(
      "https://whereiswaldo-49253-default-rtdb.europe-west1.firebasedatabase.app/scores.json?&print=pretty"
    );
    const scores = await _scores.json();
    scoresArray = Array(Object.entries(scores));
    for (let i = 0; i < scoresArray[0].length; i++) {
      for (let j = 0; j < scoresArray[0].length - i - 1; j++) {
        if (Number(scoresArray[0][j][1]) > Number(scoresArray[0][j + 1][1])) {
          let temp = scoresArray[0][j];
          scoresArray[0][j] = scoresArray[0][j + 1];
          scoresArray[0][j + 1] = temp;
        }
      }
    }
    scoresArray = scoresArray[0].slice(0, 5);
    for (const element of scoresArray) {
      console.log(element[0], element[1]);
      highScorePopUp.appendChild(document.createElement("br"));
      const name = document.createElement("label");
      name.innerHTML = element[0].slice(0, 17) + "  ";
      highScorePopUp.appendChild(name);
      const duration = document.createElement("label");
      duration.style.float = "right";
      duration.innerHTML = element[1];
      highScorePopUp.appendChild(duration);
    }
    scorePopUp.style.display = "none";
    durationText.value = null;
    nameText.value = null;
    highScorePopUp.style.display = "block";
  });
};

async function answerGetter() {
  const _answers = await fetch(
    "https://whereiswaldo-49253-default-rtdb.europe-west1.firebasedatabase.app/persona.json"
  );
  answers = await _answers.json();
}

const imgClickGetter = (event) => {
  clickX = event.pageX;
  clickY = event.pageY;
  showButtons(clickX, clickY);
  if (!startTime) {
    timerStart();
  }
};

timerStart = () => {
  startTime = new Date().getTime();
};

showButtons = (clickX, clickY) => {
  buttonPopUp.style.left =
    clickX + document.body.getBoundingClientRect().left + "px";
  buttonPopUp.style.top =
    clickY + document.body.getBoundingClientRect().top + "px";
  buttonPopUp.style.display = "block";
};

answerGetter().then(() => {
  image.addEventListener("click", imgClickGetter);
});
