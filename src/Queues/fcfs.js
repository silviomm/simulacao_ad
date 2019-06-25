class FCFSQueue {
    constructor() {
        this.queue = [];
    }

    put(elt) {
        return this.queue.unshift(elt);
    }

    peek() {
        return this.queue[this.queue.length - 1];
    }

    get() {
        return this.queue.pop();
    }

    length() {
        return this.queue.length;
    }
}

module.exports = FCFSQueue;