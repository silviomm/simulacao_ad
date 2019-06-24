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
        return (this.squareSum / (this.n - 1))
            - (this.sum ** 2) / (this.n * (this.n - 1));
    }

    getStdDev() {
        return Math.sqrt(this.getVariance());
    }

    getTStudentConfidenceInterval() {
        let diff = 1.96 * this.getStdDev() / sqrt(this.n);
        return { 
            high: this.getAverage() + diff,
            low: this.getAverage() - diff
        } 
    }
}

module.exports = DiscreteEstimator;