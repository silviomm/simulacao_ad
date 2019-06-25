/* 
    Trabalho de AD - MAB515 2019/1
    Leonardo Dagnino
    Silvio Mançano
    Daniel Artine
*/

// Nossas funções de interação com a interface
const interface = require('./interface');

// Lógica principal do simulador
const acontece = require('./simulador');

// Adiciona evento de 'click' no botão de play.
document.getElementById('run-button').addEventListener('click', () => {
    executa();
});

function executa() {
    interface.clearTable('metricas-table');
    const inputs = interface.getInputValues();
    let stats = acontece.run(inputs);

    // preenche tabela de métricas por rodada
    for (let i = 0; i < stats.perRound.length; i++) {
        const s = stats.perRound[i];
        // ordem no html: round, (avg e var)(x, w, t, nq)
        let statsValues = [s.round, s.X.avg, s.X.var, s.W.avg, s.W.var, s.T.avg, s.T.var, s.Nq.avg, s.Nq.var];
        interface.addTableRow('metricas-table', statsValues);
    }

    // preenche tabela de IC
    // ordem no html: parâmetro, ic, precisão

    // E[W]
    interface.addTableRow('ic-table',
        [
            'E[W]',
            `Entre ${stats.W.getTStudentConfidenceInterval().high} e ${stats.W.getTStudentConfidenceInterval().low}`,
            '2do'
        ],
    )
    // Var[W] tstudent
    interface.addTableRow('ic-table',
        [
            'Var[W] t-student',
            `Entre 2do e 2do`,
            '2do'
        ],
    )
    // Var[W] chi2
    interface.addTableRow('ic-table',
        [
            'Var[W] chi2',
            `Entre 2do e 2do`,
            '2do'
        ],
    )
    // E[Nq]
    interface.addTableRow('ic-table',
        [
            'E[Nq]',
            `Entre ${stats.Nq.getTStudentConfidenceInterval().high} e ${stats.Nq.getTStudentConfidenceInterval().low}`,
            '2do'
        ],
    )
    // Var[Nq] tstudent
    interface.addTableRow('ic-table',
        [
            'Var[Nq] t-student',
            `Entre 2do e 2do`,
            '2do'
        ],
    )
    // Var[Nq] chi2
    interface.addTableRow('ic-table',
        [
            'Var[Nq] chi2',
            `Entre 2do e 2do`,
            '2do'
        ],
    )

}