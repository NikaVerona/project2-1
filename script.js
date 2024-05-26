const movements = [];
let idEdit = "";

document.addEventListener("DOMContentLoaded", function () {
  const formIncome = document.getElementById("formIncome");
  const formOutcome = document.getElementById("formOutcome");
  const formEdit = document.getElementById("formEdit");

  formIncome.addEventListener("submit", function (event) {
    event.preventDefault();
    addRow("Income");
  });

  formOutcome.addEventListener("submit", function (event) {
    event.preventDefault();
    addRow("Outcome");
  });

  formEdit.addEventListener("submit", function (event) {
    event.preventDefault();
    modifyRow();
  });
});

function addRow(category) {
  const txtDescription = document.getElementById(`txt${category}Description`);
  const txtAmount = document.getElementById(`txt${category}Value`);

  if (txtDescription.value === "" || txtAmount.value === "" || isNaN(txtAmount.value) || parseFloat(txtAmount.value) < 0) {
    alert("Please fill out all fields with valid values.");
    return;
  }

  const mov = {
    description: txtDescription.value,
    amount: parseFloat(txtAmount.value),
    id: Date.now(),
    category: category,
  };

  movements.push(mov);
  refreshTable(category);
  emptyValues(category);
  totalHeader();
}

function emptyValues(category) {
  const txtDescription = document.getElementById(`txt${category}Description`);
  const txtAmount = document.getElementById(`txt${category}Value`);

  txtDescription.value = "";
  txtAmount.value = "";
  idEdit = "";
}

function modifyRow() {
  const mov = movements.find((movimiento) => movimiento.id === idEdit);
  const txtDescription = document.getElementById("txtEditDescription");
  const txtAmount = document.getElementById("txtEditValue");

  if (txtDescription.value === "" || txtAmount.value === "" || isNaN(txtAmount.value) || parseFloat(txtAmount.value) < 0) {
    alert("Please fill out all fields with valid values.");
    return;
  }

  mov.description = txtDescription.value;
  mov.amount = parseFloat(txtAmount.value);
  refreshTable(mov.category);
  emptyValues(mov.category);
  totalHeader();

  const modal = document.getElementById("myModal");
  modal.style.display = "none";
}

function editRow(id) {
  const mov = movements.find((movimiento) => movimiento.id === id);
  const txtDescription = document.getElementById("txtEditDescription");
  const txtAmount = document.getElementById("txtEditValue");

  txtDescription.value = mov.description;
  txtAmount.value = mov.amount;
  idEdit = mov.id;

  const modal = document.getElementById("myModal");
  modal.style.display = "block";

  const span = document.getElementsByClassName("close")[0];
  span.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}

function deleteRow(id) {
  const movIndex = movements.findIndex((movimiento) => movimiento.id === id);
  if (movIndex !== -1) {
    movements.splice(movIndex, 1);
  }
  refreshTable();
  totalHeader();
}

function refreshTable(category) {
  const tbl = document.getElementById(`tbl${category}`);
  tbl.innerHTML = "";
  movements
    .filter((movimiento) => movimiento.category === category)
    .forEach((movimiento) => {
      const row = tbl.insertRow();
      row.insertCell().appendChild(document.createTextNode(movimiento.description));
      row.insertCell().appendChild(document.createTextNode(movimiento.amount.toFixed(2)));

      const cell = row.insertCell();
      const btnEdit = document.createElement("button");
      btnEdit.innerHTML = "Edit";
      btnEdit.onclick = function () {
        editRow(movimiento.id);
      };

      const btnDelete = document.createElement("button");
      btnDelete.innerHTML = "Delete";
      btnDelete.onclick = function () {
        deleteRow(movimiento.id);
      };

      cell.appendChild(btnEdit);
      cell.appendChild(btnDelete);
    });

  const sum = movements
    .filter((movimiento) => movimiento.category === category)
    .reduce((acc, cur) => acc + cur.amount, 0);

  document.getElementById(`Sum${category}`).textContent = sum.toFixed(2);
}

function totalHeader() {
  const totalIncome = movements
    .filter((movimiento) => movimiento.category === "Income")
    .reduce((acc, cur) => acc + cur.amount, 0);

  const totalOutcome = movements
    .filter((movimiento) => movimiento.category === "Outcome")
    .reduce((acc, cur) => acc + cur.amount, 0);

  const totalBalance = totalIncome - totalOutcome;
  const balanceMessage = document.getElementById("balance-message");

  balanceMessage.innerHTML = `Income: <span style="color:green">$${totalIncome.toFixed(2)}</span><br/>Outcome: <span style="color:red">$${totalOutcome.toFixed(2)}</span><br/>Balance: $${totalBalance.toFixed(2)}`;
}
