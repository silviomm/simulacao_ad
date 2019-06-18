module.exports = {
    addLineToTable: (tableId, obj) => {
        let table = document.getElementById(tableId);
        let newRow = table.insertRow(-1);
        let dataRow = '';
        for(const prop in obj) {
            dataRow += `<td>${obj[prop]}</td>`
        }
        newRow.innerHTML = dataRow;
    }
}