class Node {
    constructor() {
        this.next = null;
        this.value = null;
        this.flag = false;
    }
}

var hasCycle = function(head) {
    while(head) {
        if (head.flag) {
            return true;
        }
        head.flag = true;
        head = head.next;
    }
    return false;
}

