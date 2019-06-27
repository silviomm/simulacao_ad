const Charts = require('./charts');

class Interface {

    // Adiciona uma linha ao final da tabela indicada.
    static addTableRow(tableId, obj) {
        let table = document.getElementById(tableId).getElementsByTagName('tbody')[0];
        let newRow = table.insertRow(-1);
        let dataRow = '';
        for (const prop in obj) {
            dataRow += `<td style="text-align: center">${obj[prop]}</td>`
        }
        newRow.innerHTML = dataRow;
    }

    // Retorna o valor dos inputs do html. Caso tenha algum erro, retorna valores padrão [FCFS, 0.2, 3200].
    static getInputValues() {
        const inputDisciplina = document.getElementById('input-disciplina');
        const inputDisciplinaValue = inputDisciplina.options[inputDisciplina.selectedIndex].value;
        const inputRhoValue = document.getElementById('input-rho').value;
        const inputRodadasValue = document.getElementById('input-rodadas').value;

        return {
            'disciplina': inputDisciplinaValue || 'FCFS',
            'rho': inputRhoValue || 0.2,
            'rodadas': inputRodadasValue || 3200
        }
    }

    // Limpa conteúdo da tabela indicada.
    static clearTable(tableId) {
        document.getElementById(tableId).getElementsByTagName('tbody')[0].innerHTML = "";
    }

    // Preenche tabela de métricas por rodada
    static fillMetricasTable(stats) {
        this.clearTable('metricas-table');
        for (let i = 0; i < stats.perRound.length; i++) {
            const s = stats.perRound[i];
            // ordem no html: round, (avg e var)(x, w, t, nq)
            let statsValues = [s.round, s.X.avg, s.X.var, s.W.avg, s.W.var, s.T.avg, s.T.var, s.Nq.avg, s.Nq.var];
            this.addTableRow('metricas-table', statsValues);
        }
    }

    // Cria grafico canvas com parte transient
    static createLineChart(nTotal, dataPerTime, nPoints, chartId, chartAreaId) {
        
        // remove canvas antigo
        let oldcanv = document.getElementById(chartId);
        let canvarea = document.getElementById(chartAreaId);
        canvarea.removeChild(oldcanv);

        // cria canvas novo
        let newcanv = document.createElement('canvas');
        newcanv.id = chartId;
        canvarea.appendChild(newcanv);

        let labelArray = [];
        let interval = nTotal / nPoints;

        for (let i = 0; i < nPoints; i++) {
            labelArray[i] = i * interval;
        }

        const transientPoints = Math.round(nPoints / 7);

        Charts.createLineChart(
            labelArray, {
                'transient': dataPerTime.slice(0, transientPoints),
                'normal': Array(transientPoints - 1).fill(null).concat(dataPerTime.slice(transientPoints, nPoints))
            },
            chartId
        );
    }


    // Preenche tabela de IC
    static fillICTable(stats) {
        this.clearTable('ic-table');
        // ordem no html: parâmetro, ic, precisão
        // E[W]
        this.addTableRow('ic-table',
            [
                'E[W]',
                `Entre ${stats.W.getTStudentConfidenceInterval().high} e ${stats.W.getTStudentConfidenceInterval().low}`,
                '2do'
            ],
        )
        // Var[W] tstudent
        this.addTableRow('ic-table',
            [
                'Var[W] t-student',
                `Entre 2do e 2do`,
                '2do'
            ],
        )
        // Var[W] chi2
        this.addTableRow('ic-table',
            [
                'Var[W] chi2',
                `Entre 2do e 2do`,
                '2do'
            ],
        )
        // E[Nq]
        this.addTableRow('ic-table',
            [
                'E[Nq]',
                `Entre ${stats.Nq.getTStudentConfidenceInterval().high} e ${stats.Nq.getTStudentConfidenceInterval().low}`,
                '2do'
            ],
        )
        // Var[Nq] tstudent
        this.addTableRow('ic-table',
            [
                'Var[Nq] t-student',
                `Entre 2do e 2do`,
                '2do'
            ],
        )
        // Var[Nq] chi2
        this.addTableRow('ic-table',
            [
                'Var[Nq] chi2',
                `Entre 2do e 2do`,
                '2do'
            ],
        )
    }
}

module.exports = Interface;