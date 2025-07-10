import React, { useState, useEffect } from 'react';
import './App.css';
import dijkstra from './algorithms/dijkstra';
import bfs from './algorithms/bfs';
import dfs from './algorithms/dfs';
import { getUnvisitedNeighbors } from './utils';

const numRows = 40;
const numCols = 50;

const createNode = (row, col) => ({
  row,
  col,
  isStart: row === 10 && col === 5,
  isEnd: row === 10 && col === 45,
  distance: Infinity,
  isVisited: false,
  isWall: false,
  isWeighted: false,
  weight: 1,
  previousNode: null,
});

const initialGrid = () => {
  const grid = [];
  for (let row = 0; row < numRows; row++) {
    const currentRow = [];
    for (let col = 0; col < numCols; col++) {
      currentRow.push(createNode(row, col));
    }
    grid.push(currentRow);
  }
  return grid;
};

function App() {
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [movingStart, setMovingStart] = useState(false);
  const [movingEnd, setMovingEnd] = useState(false);
  const [startNode, setStartNode] = useState({ row: 10, col: 5 });
  const [endNode, setEndNode] = useState({ row: 10, col: 45 });
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    setGrid(initialGrid());
  }, []);

  const handleMouseDown = (row, col, e) => {
    e.preventDefault();
    const node = grid[row][col];
    if (node.isStart) {
      setMovingStart(true);
    } else if (node.isEnd) {
      setMovingEnd(true);
    } else if (e.button === 0) {
      toggleWall(row, col);
    } else if (e.button === 2) {
      toggleWeight(row, col);
    }
    setMouseIsPressed(true);
  };

  const handleMouseEnter = (row, col, e) => {
    if (!mouseIsPressed) return;
    if (movingStart) {
      moveStart(row, col);
    } else if (movingEnd) {
      moveEnd(row, col);
    } else if (e.buttons === 1) {
      toggleWall(row, col);
    } else if (e.buttons === 2) {
      toggleWeight(row, col);
    }
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
    setMovingStart(false);
    setMovingEnd(false);
  };

  const toggleWall = (row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    if (node.isStart || node.isEnd) return;
    node.isWall = !node.isWall;
    node.isWeighted = false;
    node.weight = 1;
    setGrid(newGrid);
  };

  const toggleWeight = (row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    if (node.isStart || node.isEnd) return;
    if (!node.isWall && !node.isWeighted) {
      node.isWeighted = true;
      node.weight = 5;
    } else if (node.isWeighted) {
      node.isWeighted = false;
      node.weight = 1;
    }
    node.isWall = false;
    setGrid(newGrid);
  };

  const moveStart = (row, col) => {
    if (grid[row][col].isEnd || grid[row][col].isWall) return;
    const newGrid = grid.slice();
    newGrid[startNode.row][startNode.col].isStart = false;
    newGrid[row][col].isStart = true;
    setStartNode({ row, col });
    setGrid(newGrid);
  };

  const moveEnd = (row, col) => {
    if (grid[row][col].isStart || grid[row][col].isWall) return;
    const newGrid = grid.slice();
    newGrid[endNode.row][endNode.col].isEnd = false;
    newGrid[row][col].isEnd = true;
    setEndNode({ row, col });
    setGrid(newGrid);
  };

  const animate = (visitedNodes, freshGrid) => {
    for (let i = 0; i <= visitedNodes.length; i++) {
      if (i === visitedNodes.length) {
        setTimeout(() => {
          animatePath(freshGrid);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodes[i];
        if (!node.isStart && !node.isEnd) {
          const el = document.getElementById(`node-${node.row}-${node.col}`);
          if (el && !el.classList.contains('node-path')) {
            el.classList.add('node-visited');
          }
        }
      }, 10 * i);
    }
  };

  const animatePath = (freshGrid) => {
    let curr = freshGrid[endNode.row][endNode.col];
    const nodesInPath = [];
    while (curr !== null) {
      nodesInPath.unshift(curr);
      curr = curr.previousNode;
    }
    for (let i = 0; i < nodesInPath.length; i++) {
      setTimeout(() => {
        const node = nodesInPath[i];
        if (!node.isStart && !node.isEnd) {
          const el = document.getElementById(`node-${node.row}-${node.col}`);
          if (el) el.classList.add('node-path');
        }
      }, 50 * i);
    }
  };

  const visualizeDijkstra = () => {
    const freshGrid = grid.map(row => row.map(n => ({ ...n })));
    const start = freshGrid[startNode.row][startNode.col];
    const end = freshGrid[endNode.row][endNode.col];
    const visitedNodes = dijkstra(freshGrid, start, end);
    animate(visitedNodes, freshGrid);
  };

  const visualizeBFS = () => {
    const freshGrid = grid.map(row => row.map(n => ({ ...n })));
    const start = freshGrid[startNode.row][startNode.col];
    const end = freshGrid[endNode.row][endNode.col];
    const visitedNodes = bfs(freshGrid, start, end);
    animate(visitedNodes, freshGrid);
  };

  const visualizeDFS = () => {
    const freshGrid = grid.map(row => row.map(n => ({ ...n })));
    const start = freshGrid[startNode.row][startNode.col];
    const end = freshGrid[endNode.row][endNode.col];
    const visitedNodes = dfs(freshGrid, start, end);
    animate(visitedNodes, freshGrid);
  };

  const clearPaths = () => {
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const el = document.getElementById(`node-${row}-${col}`);
        if (el) {
          el.classList.remove('node-visited');
          el.classList.remove('node-path');
        }
      }
    }
  };

  const resetGrid = () => {
    const newGrid = initialGrid();
    setGrid(newGrid);
    setStartNode({ row: 10, col: 5 });
    setEndNode({ row: 10, col: 45 });
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div
      className={`App ${theme}`}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* 🟢 ADDING HEADER */}
      <header>
        <h1 style={{ textAlign: 'center', marginTop: '20px' }}>
          Pathway Manual
        </h1>
      </header>

      <div className="controls">
        <button onClick={visualizeDijkstra}>Dijkstra</button>
        <button onClick={visualizeBFS}>BFS</button>
        <button onClick={visualizeDFS}>DFS</button>
        <button onClick={clearPaths}>Clear Paths</button>
        <button onClick={resetGrid}>Reset Grid</button>
        <button onClick={toggleTheme}>Toggle Theme</button>
      </div>

      <div className="grid">
        {grid.map((row, rowIdx) => (
          <div key={rowIdx} className="row">
            {row.map((node, nodeIdx) => (
              <div
                key={nodeIdx}
                id={`node-${node.row}-${node.col}`}
                className={`node
                  ${node.isStart ? 'node-start' : ''}
                  ${node.isEnd ? 'node-end' : ''}
                  ${node.isWall ? 'node-wall' : ''}
                  ${node.isWeighted ? 'node-weighted' : ''}
                `}
                onMouseDown={(e) => handleMouseDown(node.row, node.col, e)}
                onMouseEnter={(e) => handleMouseEnter(node.row, node.col, e)}
                onMouseUp={handleMouseUp}
              ></div>
            ))}
          </div>
        ))}
      </div>

      <div className="instructions">
        💡 Left-click to toggle walls, Right-click to toggle weight <br />
        🟢 Drag Start/End nodes <br />
        🍩 Toggle between light/dark themes
      </div>
    </div>
  );
}

export default App;
