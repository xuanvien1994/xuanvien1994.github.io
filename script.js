const names = [
  { name: "Viên", rate: 0, attrs: ' (tính toán, lạc quan như pi thủ)' },
  { name: "Toàn", rate: 0, attrs: ' (trùm UNO, đại gia, vui vẻ)' },
  { name: "Quang", rate: 0, attrs: ' (chơi cho vui, cống hiến)' },
  { name: "Ánh", rate: 0, attrs: ' (designer, thánh cãi ngang, hay giận)' },
  { name: "Chương", rate: 0, attrs: ' (nói nhiều, thích đâm chọt)' },
  { name: "Uyên", rate: 0, attrs: ' (tester, nhỏ nhất, ngáo ngơ)' },
  { name: "Long", rate: 0, attrs: ' (vip)' },
  { name: "Thương", rate: 0, attrs: ' (đẹp, vô hại, khó hiểu)' },
  { name: "Tín", rate: 0, attrs: ' (bí ẩn, ít nói)' },
  { name: "Hồng", rate: 0, attrs: ' (tester, thích ăn chay)' },
  // { name: "Minh", rate: 0 },
];

var result = {
  dealer: '',
  names: [],
  lockResult: function () {
    this.names = [...names];
  },
  speak: async function () {
    // speak('Thứ tự ngồi: ' . names.join(', ') );
    // convert names to list
    //
    // if (this.dealer !== '') {
    //   speak('Xin chúc mừng người chia bài là: ' + this.dealer );
    // }
    try {
      const str = 'thứ tự chỗ ngồi game bài UNO là ' + this.names.map(x => x.name + x.attrs).join(', ') + '. Cho 1 thông báo ngắn gọn vị trí chỗ ngồi 1 cách hài hước và hấp dẫn';
      // send post request to https://appdev.spce.com/api/ai-talk/ with payload {text: str}
      let resp = await fetch('https://appdev.spce.com/api/ai-talk/', {
        method: 'POST',
        body: JSON.stringify({question: str}),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        return {requestId: data?.request_id, audioLink: data?.audio_link};
      });

      if (!resp.audioLink && resp.requestId) {
        resp.audioLink = await get_audio_link(resp.requestId);
      }
      
      if (resp.audioLink) {
        var audio = new Audio(resp.audioLink);
        audio.play();
      }
    } catch (error) {
      console.log(`result.speak(): ${error.message}`);
    }
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

function renderNameTable(defaultNames = names) {
  circleTable.innerHTML = "";

  const radius = 120;
  const centerX = circleTable.clientWidth / 2;
  const centerY = circleTable.clientHeight / 2;
  const angleIncrement = (2 * Math.PI) / defaultNames.length;
  const maxRate = Math.max(...defaultNames.map((x) => x.rate));

  for (let i = 0; i < defaultNames.length; i++) {
    const { name, rate } = defaultNames[i];
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

  defaultNames.forEach(({ name, rate }) => {
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

async function arrangeRandomly() {
  sound.play();
  const interval = setInterval(() => {
    shuffleArray(names);
    renderNameTable();
  }, 850);
  result.lockResult();
  await Promise.any([
    sleep(60),
    Promise.all([result.speak(), sleep(10)]),
  ]);
  clearInterval(interval);
  sound.pause();
  renderNameTable(result.names);
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

function sleep(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

function get_audio_link(request_id) {
  return fetch('https://appdev.spce.com/api/ai-talk/audio/' + request_id)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    return data?.audio_link;
  });
}