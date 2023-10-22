/**
 * Code derived from:
 * https://eloquentjavascript.net/appendix2.html
 * https://github.com/bgrins/javascript-astar
 */
export default class BinaryHeap {

    constructor(scorer) {
        this.content = [];
        this.scorer = scorer;
    }

    push(element) {
        // Add to array and sink to position 0.
        // Lowest index entry is the lowest score.
        this.content.push(element);
        this.sink(this.content.length - 1);
    }

    pop() {
        // Get last element (index 0) and update entries accordingly.
        const result = this.content[0];
        const end = this.content.pop();
        if (this.content.length > 0) {
            this.content[0] = end;
            this.bubbleUp(0);
        }

        return result;
    }

    remove(node) {
        const i = this.content.indexOf(node);
        // When it is found, the process seen in 'pop' is repeatedto fill up the hole.
        const end = this.content.pop();
    
        if (i !== this.content.length - 1) {
            this.content[i] = end;
            if (this.scorer(end) < this.scorer(node)) {
                this.sink(i);
            } else {
                this.bubbleUp(i);
            }
        }
    }

    size() {
        return this.content.length;
    }

    rescoreElement(node) {
        this.sink(this.content.indexOf(node));
    }

    sink(n) {
        // Fetch the element that has to be sunk.
        const element = this.content[n];
    
        // When at 0, an element can not sink any further.
        while (n > 0) {
            // Compute and fetch the parent element's index.
            const parentN = ((n + 1) >> 1) - 1;
            const parent = this.content[parentN];
            // Swap the elements if the parent is greater.
            if (this.scorer(element) < this.scorer(parent)) {
                this.content[parentN] = element;
                this.content[n] = parent;
                // Update 'n' to continue at the new position.
                n = parentN;
            } else {
                // Found a parent with less score, no need to sink any further.
                break;
            }
        }
    }

    bubbleUp(n) {
        // Look up the target element and its score.
        const length = this.content.length;
        const element = this.content[n];
        const elemScore = this.scorer(element);
    
        while (true) {
            // Compute the indices of the child elements.
            const child2N = (n + 1) << 1;
            const child1N = child2N - 1;

            // This is used to store the new position of the element, if any.
            let swap = null;
            let child1Score;

            // If the first child exists, look it up and compute its score.
            if (child1N < length) {
                const child1 = this.content[child1N];
                child1Score = this.scorer(child1);

                // If the score is less than our element's, we need to swap.
                if (child1Score < elemScore) {
                    swap = child1N;
                }
            }
    
            // Do the same checks for the other child.
            if (child2N < length) {
                const child2 = this.content[child2N];
                const child2Score = this.scorer(child2);
                if (child2Score < (swap === null ? elemScore : child1Score)) {
                    swap = child2N;
                }
            }

            // If the element needs to be moved, swap it, and continue.
            if (swap !== null) {
                this.content[n] = this.content[swap];
                this.content[swap] = element;
                n = swap;
            } else {
                // Otherwise we are done.
                break;
            }
        }
    }
}
