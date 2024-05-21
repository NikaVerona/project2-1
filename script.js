const movements = [];
idEdit = "";

document.addEventListener("DOMContentLoaded", function () {
  const inBtn = document.getElementById("btnAdd");
  const outBtn = document.getElementById("btnRest");
  const formEdit = document.getElementById("formEdit");

  outBtn.addEventListener("click", function () {
    addRow("Outcome");
  });
  inBtn.addEventListener("click", function () {
    addRow("Income");
  });
  formEdit.addEventListener("submit", function (event) {
    event.preventDefault();

    modifyRow();
  });
});

function addRow(category) {
  const txtDescription = document.getElementById(`txt${category}Description`);
  const txtAmount = document.getElementById(`txt${category}Value`);

  if (txtDescription.value === "") {
    alert("Please fill the Description");
    return false;
  }
  if (txtAmount.value === "") {
    alert("Please fill the field Amount");
    return false;
  }
  if (isNaN(txtAmount.value) || parseFloat(txtAmount.value) < 0) {
    alert("Please only positive values");
    return false;
  }

  var mov = {
    description: txtDescription.value,
    amount: txtAmount.value,
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
function isValid(category) {
  const txtDescription = document.getElementById(`txt${category}Description`);
  const txtAmount = document.getElementById(`txt${category}Value`);

  if (txtDescription.value === "") {
    alert("Please fill the Description");
    return false;
  }
  if (txtAmount.value === "") {
    alert("Please fill the field Amount");
    return false;
  }
  return true;
}
function modifyRow() {
  const mov = movements.find((movimiento) => movimiento.id === idEdit);
  const txtDescription = document.getElementById(`txtEditDescription`);
  const txtAmount = document.getElementById(`txtEditValue`);

  if (txtDescription.value === "") {
    alert("Please fill the Description");
    return false;
  }
  if (txtAmount.value === "") {
    alert("Please fill the field Amount");
    return false;
  }
  if (isNaN(txtAmount.value) || parseFloat(txtAmount.value) < 0) {
    alert("Please only positive values");
    return false;
  }

  mov.description = txtDescription.value;
  mov.amount = txtAmount.value;
  refreshTable(mov.category);
  emptyValues(mov.category);
  totalHeader();

  var modal = document.getElementById("myModal");

  var btn = document.getElementById("openModal");

  var span = document.getElementsByClassName("close")[0];

  modal.style.display = "none";
}

function editRow(id) {
  const mov = movements.find((movimiento) => movimiento.id === id);

  const txtDescription = document.getElementById(`txtEditDescription`);
  const txtAmount = document.getElementById(`txtEditValue`);

  txtDescription.value = mov.description;
  txtAmount.value = mov.amount;
  idEdit = mov.id;

  var modal = document.getElementById("myModal");

  var btn = document.getElementById("openModal");

  var span = document.getElementsByClassName("close")[0];

  modal.style.display = "block";

  span.onclick = function () {
    modal.style.display = "none";
  };
}
function deleteRow(id) {
  const category = movements.find((mov) => mov.id === id).category;
  const index = movements.findIndex((mov) => mov.id === id);
  const confirmation = confirm(
    "¿Are you sure that you want to delete the register?"
  );

  if (index !== -1 && confirmation) {
    movements.splice(index, 1);
    refreshTable(category);
    emptyValues(category);
    totalHeader();
  } else {
    console.log("We cannot find any register with that ID");
  }
}

function refreshTable(category) {
  const tblValues = document.getElementById(`tbl${category}`);
  const sumaSpan = document.getElementById(`Sum${category}`);

  var total = 0;
  tblValues.textContent = "";
  sumaSpan.textContent = "";

  movements
    .filter((mov) => mov.category === category)
    .forEach((mov) => {
      total = total + parseFloat(mov.amount);
      const newRow = document.createElement("tr");
      const descriptionCell = document.createElement("td");
      descriptionCell.textContent = mov.description;
      const amountCell = document.createElement("td");
      amountCell.textContent = mov.amount;
      const actionsCell = document.createElement("td");
      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.addEventListener("click", () => editRow(mov.id, category));

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => deleteRow(mov.id));

      actionsCell.appendChild(editButton);
      actionsCell.appendChild(deleteButton);

      newRow.appendChild(descriptionCell);
      newRow.appendChild(amountCell);
      newRow.appendChild(actionsCell);
      tblValues.appendChild(newRow);
    });
  sumaSpan.textContent = total;
}
function totalHeader() {
  const pSum = document.getElementById(`balance-message`);
  var totalSum = 0;
  pSum.textContent = "";
  var myClass = "";
  movements.forEach((mov) => {
    if (mov.category === "Income") {
      totalSum = totalSum + parseFloat(mov.amount);
    }
    if (mov.category === "Outcome") {
      totalSum = totalSum - parseFloat(mov.amount);
    }
  });
  if (totalSum > 0) {
    pSum.textContent = `You can still spend  ${totalSum.toFixed(2)} PLN`;
    myClass = "green";
  }
  if (totalSum === 0) {
    pSum.textContent = `Balance is zero`;
  }
  if (totalSum < 0) {
    pSum.textContent = `The balance is negative. You lost ${Math.abs(
      totalSum.toFixed(2)
    )} PLN`;
    myClass = "red";
  }
  pSum.classList.remove("red");
  pSum.classList.remove("green");
  if (myClass.length > 0) {
    pSum.classList.add(myClass);
  }
}
