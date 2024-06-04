const movements = [];
idEdit = "";

document.addEventListener("DOMContentLoaded", function () {
  const formAdd = document.getElementById("formIncome");
  const formRest = document.getElementById("formOutcome");
  const formEdit = document.getElementById("formEdit");

  formAdd.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission
    addRow("Income");
  });
  formRest.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission
    addRow("Outcome");
  });
  formEdit.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    modifyRow();
    // return false;
  });
  document.querySelectorAll(".decimal-input").forEach(function (input) {
    input.addEventListener("input", function (e) {
      const value = e.target.value;
      const decimalRegex = /^\d*\.?\d{0,2}$/;

      if (!decimalRegex.test(value)) {
        // Remove invalid characters
        e.target.value = value.slice(0, -1);
      }
    });
  });
});

function addRow(category) {
  const txtDescription = document.getElementById(`txt${category}Description`);
  const txtAmount = document.getElementById(`txt${category}Value`);

  if (txtDescription.value.trim() === "") {
    alert("Please fill the Description");
    return false;
  }
  if (txtAmount.value === "") {
    alert("Please fill the field Amount");
    return false;
  }
  if (isNaN(txtAmount.value) || parseFloat(txtAmount.value) <= 0) {
    alert("Please only values greater than zero");
    return false;
  }

  let mov = {
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
function modifyRow() {
  const mov = movements.find((movimiento) => movimiento.id === idEdit);
  const txtDescription = document.getElementById(`txtEditDescription`);
  const txtAmount = document.getElementById(`txtEditValue`);

  if (txtDescription.value.trim() === "") {
    alert("Please fill the Description");
    return false;
  }
  if (txtAmount.value === "") {
    alert("Please fill the field Amount");
    return false;
  }
  if (isNaN(txtAmount.value) || parseFloat(txtAmount.value) <= 0) {
    alert("Please only values greater than zero");
    return false;
  }

  mov.description = txtDescription.value;
  mov.amount = txtAmount.value;
  refreshTable(mov.category);
  emptyValues(mov.category);
  totalHeader();

  // Get the modal
  const modal = document.getElementById("myModal");

  // Get the button that opens the modal
  const btn = document.getElementById("openModal");

  // Get the <span> element that closes the modal
  const span = document.getElementsByClassName("close")[0];

  modal.style.display = "none";
}

function editRow(id) {
  const mov = movements.find((movimiento) => movimiento.id === id);

  const txtDescription = document.getElementById(`txtEditDescription`);
  const txtAmount = document.getElementById(`txtEditValue`);

  txtDescription.value = mov.description;
  txtAmount.value = mov.amount;
  idEdit = mov.id;

  // Get the modal
  const modal = document.getElementById("myModal");

  // Get the button that opens the modal
  const btn = document.getElementById("openModal");

  // Get the <span> element that closes the modal
  const span = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal
  // btn.onclick = function () {
  modal.style.display = "block";
  // }

  // When the user clicks on <span> (x), close the modal
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

  let total = 0;
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
  let totalSum = 0;
  pSum.textContent = "";
  let myClass = "";
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
