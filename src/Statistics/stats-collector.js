const DiscreteEstimator = require('./discrete-estimator');
const ContinuousEstimator = require('./continuous-estimator');

class StatsCollector {
    constructor() {
        this.round = 0;
        this.perRound = [];
        this.resetRoundEstimators(0);

        this.rNq = new ContinuousEstimator();
        this.rW = new DiscreteEstimator();
        this.X = new DiscreteEstimator();
        this.W = new DiscreteEstimator();
        this.T = new DiscreteEstimator();
        this.Nq = new DiscreteEstimator();
    }

    resetRoundEstimators(time) {
        // salvando as metricas de cada rodada antes de resetar(menos no tempo 0 que é a inicialização)
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

        this.rX = new DiscreteEstimator();
        //this.rW = new DiscreteEstimator();
        this.rT = new DiscreteEstimator();
        // this.rNq = new ContinuousEstimator(time);
    }

    fromElement(elt) {
        this.rX.sample(elt.exitTime - elt.entryTime);
        this.rW.sample(elt.entryTime - elt.arrivalTime);
        this.rT.sample(elt.exitTime - elt.arrivalTime);
    }

    updateQueue(time, nq) {
        this.rNq.sample(time, nq);
    }

    nextRound(time) {
        this.round += 1;

        this.X.sample(this.rX.getAverage());
        this.W.sample(this.rW.getAverage());
        this.T.sample(this.rT.getAverage());
        this.Nq.sample(this.rNq.getAverage(time));

        this.resetRoundEstimators(time);
    }
}

module.exports = StatsCollector;
