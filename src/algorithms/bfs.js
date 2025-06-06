import { getUnvisitedNeighbors } from '../utils';

export function bfs(grid, startNode, endNode) {
  const visitedNodesInOrder = [];
  const queue = [];
  startNode.isVisited = true;
  queue.push(startNode);

  while (queue.length) {
    const currentNode = queue.shift();
    visitedNodesInOrder.push(currentNode);

    if (currentNode === endNode) return visitedNodesInOrder;

    const neighbors = getUnvisitedNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      neighbor.isVisited = true;
      neighbor.previousNode = currentNode;
      queue.push(neighbor);
    }
  }
  return visitedNodesInOrder;
}

export default bfs;
