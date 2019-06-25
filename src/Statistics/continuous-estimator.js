class ContinuousEstimator {
    constructor(startTime = 0) {
        this.sum = 0;
        this.squareSum = 0;
        this.startTime = startTime;
        this.lastTime = startTime;
    }

    sample(time, value) {
        this.sum += value * (time - this.lastTime);
        this.squareSum += (value ** 2) * (time - this.lastTime);
        this.lastTime = time;
    }

    getAverage(time) {
        if (this.startTime === time) {
            return Infinity;
        }
        return this.sum / (time - this.startTime);
    }

    getVariance(time) {
        if (this.startTime === time) {
            return Infinity;
        }
        return (this.squareSum / (time - this.startTime))
            - (this.sum ** 2) / ((time - this.startTime) ** 2);
    }

    getStdDev() {
        return Math.sqrt(this.getVariance());
    }
}

module.exports = ContinuousEstimator;