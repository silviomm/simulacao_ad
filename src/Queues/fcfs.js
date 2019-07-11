//Classe representando uma First Come First Served
class FCFSQueue {

    //Fila inicializada vazia
    constructor() {
        this.queue = [];
    }

    //Coloca um fregues na fila
    put(elt) {
        return this.queue.unshift(elt);
    }

    //Olha o ultimo fregues da fila.
    peek() {
        return this.queue[this.queue.length - 1];
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

module.exports = FCFSQueue;