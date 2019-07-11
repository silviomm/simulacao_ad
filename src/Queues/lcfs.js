//Classe representando uma Last Come First Served
class LCFSQueue {

    //Fila inicializada vazia
    constructor() {
        this.queue = [];
    }

    //Coloca um fregues na fila
    put(elt) {
        return this.queue.push(elt);
    }

    //Olha o ultimo fregues da fila. No caso o proximo a ser atendido.
    peek() {
        return this.queue[0];
    }

    //Retira o proximo fregues a ser atendido.
    get() {
        return this.queue.pop();
    }

    //Retorna o tamanho da fila
    length() {
        return this.queue.length;
    }
}

module.exports = LCFSQueue;
