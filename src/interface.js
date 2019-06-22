module.exports = {

    // Adiciona uma linha ao final da tabela indicada.
    addTableRow: (tableId, obj) => {
        let table = document.getElementById(tableId);
        let newRow = table.insertRow(-1);
        let dataRow = '';
        for(const prop in obj) {
            dataRow += `<td>${obj[prop]}</td>`
        }
        newRow.innerHTML = dataRow;
    },

    // Retorna o valor dos inputs do html. Caso tenha algum erro, retorna valores padrão [FCFS, 0.2, 3200].
    getInputValues: () => {
        const inputDisciplina = document.getElementById('input-disciplina');
        const inputDisciplinaValue = inputDisciplina.options[inputDisciplina.selectedIndex].value;
        const inputRhoValue = document.getElementById('input-rho').value;
        const inputRodadasValue = document.getElementById('input-rodadas').value;

        return {
            'disciplina': inputDisciplinaValue || 'FCFS',
            'rho': inputRhoValue || 0.2,
            'rodadas': inputRodadasValue || 3200
        }
    },

    clearTable: (tableId) => {
        let tbody = document.getElementById(tableId+'-tbody');
        tbody.parentNode.removeChild(tbody);
        // tbody.innerHTML = '';
    }


}