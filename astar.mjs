/**
 * Code derived from:
 * https://en.wikipedia.org/wiki/A*_search_algorithm
 * https://en.wikipedia.org/wiki/Taxicab_geometry
 * https://en.wikipedia.org/wiki/Chebyshev_distance
 * https://github.com/bgrins/javascript-astar/
 */
import BinaryHeap from "./binary-heap.mjs"
import { SquareType } from "./square.mjs"

export const Heuristic = {
    MANHATTAN: (pos0, pos1) => {
        const d1 = Math.abs(pos1.x - pos0.x);
        const d2 = Math.abs(pos1.y - pos0.y);
        return d1 + d2;
    },
    CHEBYSHEV: (pos0, pos1) => {
        const D = 1;
        const D2 = Math.sqrt(2);
        const d1 = Math.abs(pos1.x - pos0.x);
        const d2 = Math.abs(pos1.y - pos0.y);
        return (D * (d1 + d2)) + ((D2 - (2 * D)) * Math.min(d1, d2));
    },
}

export function graphFromMap(game) {
    const floor = game.floor;
    const graph = [];
    for (let i = 0; i < floor.length; i++) {
        graph.push([]);
        for (let j = 0; j < floor[i].length; j++) {
            const weight = floor[i][j] === SquareType.EMPTY || floor[i][j] === SquareType.EXIT ? 1 : 0
            graph[i].push({
                x: i,
                y: j,
                weight: weight,
                f: 0,
                g: 0,
                h: 0,
                visited: false,
                closed: false,
                parent: null,
            })
        }
    }

    // Mark alive enemy positions as walls.
    for (const enemy of game.enemies) {
        if (enemy.hp <= 0) {
            continue;
        }
        graph[enemy.pos.x][enemy.pos.y].weight = 0;
        graph[enemy.pos.x][enemy.pos.y].closed = true;
    }

    return graph;
}

function gridNodeNeighbours(grid, node, diagonal=false) {
    const ret = [];
    const x = node.x;
    const y = node.y;

    if (grid[x - 1] && grid[x - 1][y]) {
        ret.push(grid[x - 1][y]);
    }
    if (grid[x + 1] && grid[x + 1][y]) {
        ret.push(grid[x + 1][y]);
    }
    if (grid[x]) {
        if (grid[x][y - 1]) {
            ret.push(grid[x][y - 1]);
        }
        if (grid[x][y + 1]) {
            ret.push(grid[x][y + 1]);
        }
    }

    if (diagonal) {
        if (grid[x - 1] && grid[x - 1][y - 1]) {
            ret.push(grid[x - 1][y - 1]);
        }
        if (grid[x + 1] && grid[x + 1][y - 1]) {
            ret.push(grid[x + 1][y - 1]);
        }
        if (grid[x - 1] && grid[x - 1][y + 1]) {
            ret.push(grid[x - 1][y + 1]);
        }
        if (grid[x + 1] && grid[x + 1][y + 1]) {
            ret.push(grid[x + 1][y + 1]);
        }
    }

    return ret;
}

function getCost(node, fromNeighbor) {
    // Take diagonal weight into consideration.
    if (fromNeighbor && fromNeighbor.x != node.x && fromNeighbor.y != node.y) {
        return node.weight * 1.41421;
    }
    return node.weight;
};

function pathTo(node) {
    let curr = node;
    const path = [];
    while (curr.parent) {
        path.unshift(curr);
        curr = curr.parent;
    }
    return path;
}

export function astar(graph, start, end, closest=true, heuristic=Heuristic.MANHATTAN) {
    // Heap and visited node data.
    const heap = new BinaryHeap((node) => node.f);
    let closestNode = start;
    start.h = heuristic(start, end);
    heap.push(start);

    while (heap.size() > 0) {
        const currentNode = heap.pop();
        if (currentNode === end) {
            return pathTo(currentNode);
        }

        // Mark the current node as visited, then process each of its neighbours.
        currentNode.closed = true;

        // Find all neighbours for the current node.
        const neighbours = gridNodeNeighbours(graph, currentNode, false);
        for (let i = 0; i < neighbours.length; ++i) {
            const neighbour = neighbours[i];

            if (neighbour.closed || neighbour.weight <= 0) {
                // Not a valid node, skip to next.
                continue;
            }

            // The g score is the shortest distance from start to current node.
            // We need to check if the path we have arrived at this neighbour is the shortest one we have seen yet.
            const gScore = currentNode.g + getCost(neighbour, currentNode);
            const beenVisited = neighbour.visited;

            if (!beenVisited || gScore < neighbour.g) {
                // Found an optimal (so far) path to this node. Take score for node to see how good it is.
                neighbour.visited = true;
                neighbour.parent = currentNode;
                neighbour.h = neighbour.h || heuristic(neighbour, end);
                neighbour.g = gScore;
                neighbour.f = neighbour.g + neighbour.h;

                if (closest) {
                    // If the neighbour is closer than the current closestNode or if it's equally close but has
                    // a cheaper path than the current closest node then it becomes the closest node.
                    if (neighbour.h < closestNode.h || (neighbour.h === closestNode.h && neighbour.g < closestNode.g)) {
                        closestNode = neighbour;
                    }
                }

                if (!beenVisited) {
                    // Pushing to heap will put it in proper place based on the 'f' value.
                    heap.push(neighbour);
                } else {
                    // Already seen the node, but since it has been rescored we need to reorder it in the heap.
                    heap.rescoreElement(neighbour);
                }
            }
        }
    }

    if (closest) {
        return pathTo(closestNode);
    }

    // No result was found - empty array signifies failure to find path.
    return [];
}
