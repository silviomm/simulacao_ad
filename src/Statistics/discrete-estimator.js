const Utils = require('../Helpers/utils')

class DiscreteEstimator {
    constructor() {
        this.sum = 0;
        this.squareSum = 0;
        this.n = 0;
    }

    sample(value) {
        this.sum += value;
        this.squareSum += value ** 2;
        this.n += 1;
    }

    getAverage() {
        if (this.n < 1) {
            return Infinity;
        }
        return this.sum / this.n;
    }

    getVariance() {
        if (this.n < 2) {
            return Infinity;
        }
        return (this.squareSum / (this.n - 1)) -
            (this.sum ** 2) / (this.n * (this.n - 1));
    }

    getStdDev() {
        return Math.sqrt(this.getVariance());
    }

    getTStudentConfidenceInterval() {
        let diff = (1.96 * this.getStdDev()) / Math.sqrt(this.n);

        return {
            high: this.getAverage() + diff,
            low: this.getAverage() - diff,
            precision: (diff/this.getAverage())*100,
        }
    }

    getChi2ConfidenceInterval() {
        const alpha = 0.05;
        let chi2Low = Utils.getInverseChiSquaredCDF(1 - (alpha / 2), this.n - 1);
        let chi2Up = Utils.getInverseChiSquaredCDF(alpha / 2, this.n - 1);

        return {
            high: (this.n - 1) * this.getAverage() / chi2Up,
            low: (this.n - 1) * this.getAverage() / chi2Low
        }
    }
}

module.exports = DiscreteEstimator;