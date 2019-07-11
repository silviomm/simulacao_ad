const DiscreteEstimator = require('./discrete-estimator');
const ContinuousEstimator = require('./continuous-estimator');

//Classe responsavel por guardar instancias de estimadores e armazenar as metricas coletadas
class StatsCollector {
    constructor() {
        this.round = 0;
        this.perRound = [];
        this.resetRoundEstimators(0);

        this.rrNq = new ContinuousEstimator();
        this.rrW = new DiscreteEstimator();
        this.initEstimators();
    }

    initEstimators() {
        //Estimadores das medias de cada parametro
        this.X = new DiscreteEstimator();
        this.W = new DiscreteEstimator();
        this.T = new DiscreteEstimator();
        this.Nq = new DiscreteEstimator();

        //Estimadores das variancias de cada parametro
        this.vX = new DiscreteEstimator();
        this.vW = new DiscreteEstimator();
        this.vT = new DiscreteEstimator();
        this.vNq = new DiscreteEstimator();
    }

    saveRoundStats(time) {
        if (time != 0)
            this.perRound.push({
                'round': this.round,
                'X': {
                    'avg': this.rX.getAverage().toFixed(5),
                    'var': this.rX.getVariance().toFixed(5)
                },
                'W': {
                    'avg': this.rW.getAverage().toFixed(5),
                    'var': this.rW.getVariance().toFixed(5)
                },
                'T': {
                    'avg': this.rT.getAverage().toFixed(5),
                    'var': this.rT.getVariance().toFixed(5)
                },
                'Nq': {
                    'avg': this.rNq.getAverage(time).toFixed(5),
                    'var': this.rNq.getVariance(time).toFixed(5)
                }
            });
    }

    resetRoundEstimators(time) {
        //Salvando as metricas de cada rodada antes de resetar(menos no tempo 0 que e a inicializacao)
        this.saveRoundStats(time);

        //Reseta coletores de estatisticas dos rounds
        this.rX = new DiscreteEstimator();
        this.rW = new DiscreteEstimator();
        this.rT = new DiscreteEstimator();
        this.rNq = new ContinuousEstimator(time);
    }

    fromElement(elt, currentRound) {
        if(elt.round == currentRound) {
            this.rX.sample(elt.exitTime - elt.entryTime);
            this.rW.sample(elt.entryTime - elt.arrivalTime);
            this.rT.sample(elt.exitTime - elt.arrivalTime);
    
            this.rrW.sample(elt.entryTime - elt.arrivalTime);
        }
    }

    updateQueue(time, nq) {
        this.rNq.sample(time, nq);
        this.rrNq.sample(time, nq);
    }

    nextRound(time) {
        this.round += 1;

        //Amostras das medias da rodada
        this.X.sample(this.rX.getAverage());
        this.W.sample(this.rW.getAverage());
        this.T.sample(this.rT.getAverage());
        this.Nq.sample(this.rNq.getAverage(time));

        //Amostras das variancias da rodada
        this.vX.sample(this.rX.getVariance());
        this.vW.sample(this.rW.getVariance());
        this.vT.sample(this.rT.getVariance());
        this.vNq.sample(this.rNq.getVariance(time));

        this.resetRoundEstimators(time);
    }
}

module.exports = StatsCollector;
