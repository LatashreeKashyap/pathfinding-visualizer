import { getUnvisitedNeighbors } from '../utils';

export function dfs(grid, startNode, endNode) {
  const visitedNodesInOrder = [];
  const stack = [];
  stack.push(startNode);

  while (stack.length) {
    const currentNode = stack.pop();

    if (currentNode.isWall || currentNode.isVisited) continue;

    currentNode.isVisited = true;
    visitedNodesInOrder.push(currentNode);

    if (currentNode === endNode) return visitedNodesInOrder;

    const neighbors = getUnvisitedNeighbors(currentNode, grid);
    // Push neighbors in reverse order to maintain order similar to recursive DFS
    for (let i = neighbors.length - 1; i >= 0; i--) {
      neighbors[i].previousNode = currentNode;
      stack.push(neighbors[i]);
    }
  }
  return visitedNodesInOrder;
}

export default dfs;
