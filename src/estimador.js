class Estimador {
    constructor() {
        this.estimadorMedia = 0
        this.estimadorVariancia = 0
        this.n = 0
    }

    acontece(n) {
        this.estimadorMedia += n
        this.estimadorVariancia += n ** 2
        this.n += 1
    }

    calculaMedia() {
        if (this.n < 1) {
            return Infinity
        }
        return this.estimadorMedia/this.n
    }

    calculaVariancia() {
        if (this.n < 2) {
            return Infinity
        }
        return (this.estimadorVariancia / (this.n - 1))
            - (this.estimadorMedia ** 2)/(this.n*(this.n-1))
    }

    calculaDesvioPadrao() {
        return Math.sqrt(this.calculaVariancia())
    }
}

module.exports = Estimador