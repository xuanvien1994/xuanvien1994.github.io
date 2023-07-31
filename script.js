const names = [
  "Vien",
  "Toan",
  "Quang",
  "Ánh",
  "Chuong",
  "Uyen",
  "Long",
  "Thuong",
  "Tin",
  "Hong",
  "Minh",
];

document.addEventListener("DOMContentLoaded", () => {
  renderNameTable();
});

function renderNameTable() {
  circleTable.innerHTML = "";

  const radius = 120;
  const centerX = circleTable.clientWidth / 2;
  const centerY = circleTable.clientHeight / 2;
  const angleIncrement = (2 * Math.PI) / names.length;

  for (let i = 0; i < names.length; i++) {
    const angle = i * angleIncrement;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    const personDiv = document.createElement("div");
    personDiv.className = "person";
    personDiv.style.left = `${x - 20}px`;
    personDiv.style.top = `${y - 20}px`;
    personDiv.textContent = names[i];

    circleTable.appendChild(personDiv);
  }
  const nameTableBody = document.querySelector("#nameTable tbody");
  nameTableBody.innerHTML = "";

  names.forEach((name) => {
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
    names.push(newName);
    newNameInput.value = "";
    renderNameTable();
  }
}

function removeName(name) {
  const nameIndex = names.indexOf(name);
  if (nameIndex !== -1) {
    names.splice(nameIndex, 1);
    renderNameTable();
  }
}

function arrangeRandomly() {
  shuffleArray(names);
  renderNameTable();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function addNameOnEnter(event) {
  if (event.key === "Enter") {
    addName();
  }
}
