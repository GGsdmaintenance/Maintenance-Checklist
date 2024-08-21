const weekColumns = [
    2, 3, 4,  // January
    5, 6, 7,  // February
    8, 9, 10, // March
    11, 12, 13, // April
    14, 15, 16, // May
    17, 18, 19, // June
    20, 21, 22, // July
    23, 24, 25, // August
    26, 27, 28, // September
    29, 30, 31, // October
    32, 33, 34, // November
    35, 36, 37  // December
];

document.addEventListener("DOMContentLoaded", function() {
    const table = document.getElementById("scheduleTable");

    // Load saved table data from local storage
    loadTableData();

    // Event delegation to handle checkmark toggling
    table.addEventListener("click", function(event) {
        const target = event.target;
        if (target.tagName === "TD" && weekColumns.includes(target.cellIndex)) {
            target.textContent = target.textContent === "✔" ? "" : "✔";
            saveTableData();
        }
    });
});

function saveTableData() {
    const table = document.getElementById("scheduleTable");
    const rows = table.rows;
    const data = [];

    // Loop through rows and cells to store content
    for (let i = 0; i < rows.length; i++) {
        const row = [];
        for (let j = 0; j < rows[i].cells.length - 1; j++) { // -1 to skip the delete button column
            row.push(rows[i].cells[j].textContent);
        }
        data.push(row);
    }

    // Save the data array to local storage
    localStorage.setItem("tableData", JSON.stringify(data));
}

function loadTableData() {
    const table = document.getElementById("scheduleTable");
    const data = JSON.parse(localStorage.getItem("tableData"));

    if (data) {
        for (let i = 0; i < data.length; i++) {
            if (table.rows[i]) {
                for (let j = 0; j < data[i].length; j++) {
                    table.rows[i].cells[j].textContent = data[i][j];
                }
            } else {
                addRow(data[i]);
            }
        }
    }
}

function addRow(rowData = []) {
    const table = document.getElementById("scheduleTable");
    const newRow = table.insertRow(-1);
    const colCount = table.rows[0].cells.length;

    for (let i = 0; i < colCount; i++) {
        const newCell = newRow.insertCell(i);
        newCell.contentEditable = "true";
        newCell.textContent = rowData[i] || "";

        if (weekColumns.includes(i)) {
            newCell.addEventListener("click", function() {
                this.textContent = this.textContent === "✔" ? "" : "✔";
                saveTableData();
            });
        }
    }

    const deleteCell = newRow.insertCell(-1);
    deleteCell.innerHTML = '<button class="deleteRowButton">Delete</button>';
    deleteCell.firstChild.addEventListener("click", function() {
        deleteRow(this);
    });
}

function deleteRow(button) {
    const row = button.closest("tr");
    row.remove();
    saveTableData();
}
