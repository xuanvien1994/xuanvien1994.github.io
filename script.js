const names = [
  { name: "Vien", rate: 0 },
  { name: "Toan", rate: 0 },
  { name: "Quang", rate: 0 },
  { name: "Ánh", rate: 0 },
  { name: "Chuong", rate: 0 },
  { name: "Uyen", rate: 0 },
  { name: "Long", rate: 0 },
  { name: "Thuong", rate: 0 },
  { name: "Tin", rate: 0 },
  { name: "Hong", rate: 0 },
  { name: "Minh", rate: 0 },
];

let includeRateNumber = false;

function toggleRateNumber(event) {
  includeRateNumber = event.target.checked;
  renderNameTable();
}

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
    if (maxRate === rate && maxRate !== 0) {
      className += " rate-max";
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
  shuffleArray(names);
  renderNameTable();
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
    for (let i = array.length - 1; i > 0; i--) {
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
