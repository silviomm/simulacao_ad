const Charts = require('./charts');

//Classe responsavel por criacao da tabela com metricas
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

    // Retorna o valor dos inputs do html. Caso tenha algum erro, retorna valores padrao [FCFS, 0.2, 3200, 1000].
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

    // Limpa conteudo da tabela indicada.
    static clearTable(tableId) {
        document.getElementById(tableId).getElementsByTagName('tbody')[0].innerHTML = "";
    }
  

    //Preenche tabela de metricas por rodada
    //Nessa funcao foi estabelecido um teto para elementos na tabela, para que nao se perdesse
    //muito tempo renderizando muitos dados. O limite de dados na tabela e 100 linhas.
    static fillMetricasTable(stats, numeroRodadas) {
	let limiteRodadasBase = 50;
	let passo = numeroRodadas <= limiteRodadasBase*2 ? 1 : Math.trunc(numeroRodadas/limiteRodadasBase);
	console.log(passo);
        for (let i = 0; i < stats.perRound.length; i+=passo) {
            const s = stats.perRound[i];
            // ordem no html: round, (avg e var)(x, w, t, nq)
            let statsValues = [s.round, s.X.avg, s.X.var, s.W.avg, s.W.var, s.T.avg, s.T.var, s.Nq.avg, s.Nq.var];
            this.addTableRow('metricas-table', statsValues);
        }
    }

    // Cria grafico canvas com parte transiente
    static createLineChart(nTotal, dataPerTime, transientDataPerTime, nPoints, chartId, chartAreaId, tooltipTitle) {
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

        const transientPoints = transientDataPerTime.length;

        Charts.createLineChart(
            labelArray, {
                // 'transient': dataPerTime.slice(0, transientPoints),
                'transient': transientDataPerTime,
                'normal': Array(transientPoints).fill(null).concat(dataPerTime),
                //'normal': dataPerTime
            },
            chartId,
            tooltipTitle
        );
    }

    // Preenche tabela de Intervalo de confianca
    // ordem no html: parametro, tipo, precisao, centro, [ic]
    static fillICTable(stats) {
        // E[W]
        let ictEW = stats.W.getTStudentConfidenceInterval();
        this.addTableRow('ic-table',
            [
                'E[W]',
                't-student',
                `${(ictEW.precision).toFixed(2)}%`,
                `${(ictEW.high+ictEW.low)/2}`,
                `Entre <b>${ictEW.high}</b> e <b>${ictEW.low}</b>`,
            ],
        )
        // Var[W] tstudent
        let ictVW = stats.vW.getTStudentConfidenceInterval();
        this.addTableRow('ic-table',
            [
                'Var[W]',
                't-student',
                `${(ictVW.precision).toFixed(2)}%`,
                `${(ictVW.high+ictVW.low)/2}`,
                `Entre <b>${ictVW.high}</b> e <b>${ictVW.low}<b>`,
            ],
        )
        // Var[W] chi2
        let icc2VW = stats.vW.getChi2ConfidenceInterval();
        this.addTableRow('ic-table',
            [
                'Var[W]',
                'chi²',
                `${(icc2VW.precision).toFixed(2)}%`,
                `${(icc2VW.high+icc2VW.low)/2}`,
                `Entre <b>${icc2VW.high}</b> e <b>${icc2VW.low}</b>`,
            ],
        )
        // E[Nq]
        let ictENq = stats.Nq.getTStudentConfidenceInterval();
        this.addTableRow('ic-table',
            [
                'E[Nq]',
                't-student',
                `${(ictENq.precision).toFixed(2)}%`,
                `${(ictENq.high+ictENq.low)/2}`,
                `Entre <b>${ictENq.high}</b> e <b>${ictENq.low}</b>`,
            ],
        )
        // Var[Nq] tstudent
        let ictVNq = stats.vNq.getTStudentConfidenceInterval();
        this.addTableRow('ic-table',
            [
                'Var[Nq]',
                't-student',
                `${(ictVNq.precision).toFixed(2)}%`,
                `${(ictVNq.high+ictVNq.low)/2}`,
                `Entre <b>${ictVNq.high}</b> e <b>${ictVNq.low}</b>`,
            ],
        )
        // Var[Nq] chi2
        let icc2VNq = stats.vNq.getChi2ConfidenceInterval();
        this.addTableRow('ic-table',
            [
                'Var[Nq]',
                'chi²',
                `${icc2VNq.precision.toFixed(2)}%`,
                `${(icc2VNq.high+icc2VNq.low)/2}`,
                `Entre <b>${icc2VNq.high}</b> e <b>${icc2VNq.low}</b>`,
            ],
        )
    }
}

module.exports = Interface;
