const names = [
  { name: "Viên", rate: 0 },
  { name: "Toàn", rate: 0 },
  { name: "Quang", rate: 0 },
  { name: "Ánh", rate: 0 },
  { name: "Chương", rate: 0 },
  { name: "Uyên", rate: 0 },
  { name: "Long", rate: 0 },
  { name: "Thương", rate: 0 },
  { name: "Tín", rate: 0 },
  { name: "Hồng", rate: 0 },
  // { name: "Minh", rate: 0 },
];

var result = {
  dealer: '',
  speak: function () {
     // Thứ tự ngồi: Long Thương Toàn Tín, người chia bài là Thương
    // speak('Thứ tự ngồi: ' . names.join(', ') );
    // convert names to list
    //
    if (this.dealer !== '') {
      speak('Xin chúc mừng người chia bài là: ' + this.dealer );
    }
    speak('Thứ tự ngồi: ' + names.map(x => x.name).join(' '));
    // speak('Thứ tự ngồi: Long Thương Toàn Tín, người chia bài là Thương');
  }
};

let includeRateNumber = false;

function clearRateNumber() {
  names.forEach((x) => (x.rate = 0));
}
function toggleRateNumber(event) {
  includeRateNumber = event.target.checked;
  clearRateNumber();
  renderNameTable();
}

const sound = new Audio("./bgm.mp3");
sound.msAudioCategory = "SoundEffect";
sound.load(); //For pre-loading media

document.addEventListener("DOMContentLoaded", () => {
  renderNameTable();
});

function renderNameTable() {
  circleTable.innerHTML = "";

  const radius = 120;
  const centerX = circleTable.clientWidth / 2;
  const centerY = circleTable.clientHeight / 2;
  const angleIncrement = (2 * Math.PI) / names.length;
  const maxRate = Math.max(...names.map((x) => x.rate));

  for (let i = 0; i < names.length; i++) {
    const { name, rate } = names[i];
    let className = "person";
    if (includeRateNumber && maxRate === rate && maxRate !== 0) {
      className += " rate-max";
      result.dealer = name;
    }
    const angle = i * angleIncrement;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    const personDiv = document.createElement("div");
    personDiv.className = className;
    personDiv.style.left = `${x - 20}px`;
    personDiv.style.top = `${y - 20}px`;
    personDiv.textContent = name;
    if (includeRateNumber) {
      const rateDiv = document.createElement("span");
      rateDiv.className = "person-rate";
      rateDiv.textContent = rate;
      personDiv.appendChild(rateDiv);
    }

    circleTable.appendChild(personDiv);
  }
  const nameTableBody = document.querySelector("#nameTable tbody");
  nameTableBody.innerHTML = "";

  names.forEach(({ name, rate }) => {
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    nameCell.textContent = name;
    row.appendChild(nameCell);

    const actionsCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "add-name-button");
    deleteButton.textContent = "Remove";
    deleteButton.addEventListener("click", () => removeName(name));
    actionsCell.appendChild(deleteButton);
    row.appendChild(actionsCell);

    nameTableBody.appendChild(row);
  });
}

function addName() {
  const newNameInput = document.getElementById("newName");
  const newName = newNameInput.value.trim();

  if (newName) {
    names.push({ name: newName, rate: 0 });
    newNameInput.value = "";
    renderNameTable();
  }
}

function removeName(name) {
  const nameIndex = names.findIndex((x) => x.name === name);
  if (nameIndex !== -1) {
    names.splice(nameIndex, 1);
    renderNameTable();
  }
}

function arrangeRandomly() {
  sound.play();
  const interval = setInterval(() => {
    shuffleArray(names);
    renderNameTable();
  }, 850);
  setTimeout(() => {
    clearInterval(interval);
    sound.pause();
    result.speak();
  }, 10000);
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  if (includeRateNumber) {
    const usedNumbers = [];
    for (let i = 0; i < array.length; i++) {
      let rate = randomNumber(1, 100);
      while (usedNumbers.includes(rate)) {
        rate = randomNumber(1, 100);
      }
      usedNumbers.push(rate);
      array[i].rate = rate;
    }
  }
}

function addNameOnEnter(event) {
  if (event.key === "Enter") {
    addName();
  }
}

function speak(text) {
	var msg = new SpeechSynthesisUtterance();
	msg.text = text;
	msg.volume = 1
	msg.rate = 0.8;
	msg.pitch = 1;
	msg.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == 'Linh'; })[0];
	window.speechSynthesis.speak(msg);
}
