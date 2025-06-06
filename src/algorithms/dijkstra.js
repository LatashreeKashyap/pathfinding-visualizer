import { getUnvisitedNeighbors } from '../utils';

export default function dijkstra(grid, startNode, endNode) {
  const visitedNodes = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);

  while (unvisitedNodes.length) {
    // Sort nodes by distance
    unvisitedNodes.sort((a, b) => a.distance - b.distance);
    const closestNode = unvisitedNodes.shift();

    // If wall, skip it
    if (closestNode.isWall) continue;
    // If distance is infinity, stop (remaining nodes are unreachable)
    if (closestNode.distance === Infinity) return visitedNodes;

    closestNode.isVisited = true;
    visitedNodes.push(closestNode);

    // If reached end node
    if (closestNode === endNode) return visitedNodes;

    updateUnvisitedNeighbors(closestNode, grid);
  }
  return visitedNodes;
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

function updateUnvisitedNeighbors(node, grid) {
  const neighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of neighbors) {
    const weight = neighbor.weight || 1;
    const newDist = node.distance + weight;
    if (newDist < neighbor.distance) {
      neighbor.distance = newDist;
      neighbor.previousNode = node;
    }
  }
}



