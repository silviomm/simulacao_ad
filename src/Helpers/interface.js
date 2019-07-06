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

    // Retorna o valor dos inputs do html. Caso tenha algum erro, retorna valores padrão [FCFS, 0.2, 3200, 1000].
    static getInputValues() {
        const inputDisciplina = document.getElementById('input-disciplina');
        const inputDisciplinaValue = inputDisciplina.options[inputDisciplina.selectedIndex].value;
        const inputRhoValue = document.getElementById('input-rho').value;
        const inputRodadasValue = document.getElementById('input-rodadas').value;
        const inputFreguesesValue = document.getElementById('input-fregueses').value;
        const inputTransienteValue = document.getElementById('input-transiente').value;
        

        return {
            'disciplina': inputDisciplinaValue || 'FCFS',
            'rho': inputRhoValue || 0.2,
            'rodadas': inputRodadasValue || 3200,
            'fregueses': inputFreguesesValue || 1000,
            'transiente': inputTransienteValue || 15000
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

        console.log(dataPerTime)

        Charts.createLineChart(
            labelArray, {
                // 'transient': dataPerTime.slice(0, transientPoints),
                'transient': null,
                // 'normal': Array(transientPoints - 1).fill(null).concat(dataPerTime.slice(transientPoints, nPoints))
                'normal': dataPerTime
            },
            chartId
        );
    }


    // Preenche tabela de IC
    // ordem no html: parâmetro, ic, precisão
    static fillICTable(stats) {
        this.clearTable('ic-table');
        // E[W]
        let ictEW = stats.W.getTStudentConfidenceInterval();
        this.addTableRow('ic-table',
            [
                'E[W]',
                `Entre <b>${ictEW.high}</b> e <b>${ictEW.low}</b>`,
                `${(ictEW.precision).toFixed(5)}%`
            ],
        )
        // Var[W] tstudent
        let ictVW = stats.vW.getTStudentConfidenceInterval();
        this.addTableRow('ic-table',
            [
                'Var[W] t-student',
                `Entre <b>${ictVW.high}</b> e <b>${ictVW.low}<b>`,
                `${(ictVW.precision).toFixed(5)}%`
            ],
        )
        // Var[W] chi2
        let icc2VW = stats.vW.getChi2ConfidenceInterval();
        this.addTableRow('ic-table',
            [
                'Var[W] chi2',
                `Entre <b>${icc2VW.high}</b> e <b>${icc2VW.low}</b>`,
                `${(icc2VW.precision).toFixed(5)}%`
            ],
        )
        // E[Nq]
        let ictENq = stats.Nq.getTStudentConfidenceInterval();
        this.addTableRow('ic-table',
            [
                'E[Nq]',
                `Entre <b>${ictENq.high}</b> e <b>${ictENq.low}</b>`,
                `${(ictENq.precision).toFixed(5)}%`
            ],
        )
        // Var[Nq] tstudent
        let ictVNq = stats.vNq.getTStudentConfidenceInterval();
        this.addTableRow('ic-table',
            [
                'Var[Nq] t-student',
                `Entre <b>${ictVNq.high}</b> e <b>${ictVNq.low}</b>`,
                `${(ictVNq.precision).toFixed(5)}%`
            ],
        )
        // Var[Nq] chi2
        let icc2VNq = stats.vNq.getChi2ConfidenceInterval();
        this.addTableRow('ic-table',
            [
                'Var[Nq] chi2',
                `Entre <b>${icc2VNq.high}</b> e <b>${icc2VNq.low}</b>`,
                `${icc2VNq.precision.toFixed(5)}`
            ],
        )
    }
}

module.exports = Interface;