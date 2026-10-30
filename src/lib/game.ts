export const GRID_SIZE = 4;
export const TARGET_TILE = 2048;

export type Tile = {
  value: number;
  position: { row: number; col: number };
  id: string;
};

export type GameState = {
  grid: (Tile | null)[][];
  score: number;
  bestScore: number;
  status: "playing" | "won" | "gameover";
  hasWon: boolean;
};

export const INITIAL_GAME_STATE: GameState = {
  grid: Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => null)
  ),
  score: 0,
  bestScore: 0,
  status: "playing",
  hasWon: false,
};

const nextId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

const randomValue = () => (Math.random() < 0.9 ? 2 : 4);

const emptyCells = (grid: (Tile | null)[][]): { row: number; col: number }[] => {
  const cells: { row: number; col: number }[] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (!grid[row][col]) cells.push({ row, col });
    }
  }
  return cells;
};

export const createInitialBoard = (): (Tile | null)[][] => {
  const grid: (Tile | null)[][] = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => null)
  );
  return spawnTile(spawnTile(grid));
};

const spawnTile = (grid: (Tile | null)[][]): (Tile | null)[][] => {
  const empties = emptyCells(grid);
  if (empties.length === 0) return grid;
  const { row, col } = empties[Math.floor(Math.random() * empties.length)];
  const newGrid = grid.map((rowArr) => rowArr.slice());
  newGrid[row][col] = {
    value: randomValue(),
    position: { row, col },
    id: nextId(),
  };
  return newGrid;
};

export const newGame = (): GameState => {
  const grid = createInitialBoard();
  return {
    grid,
    score: 0,
    bestScore: 0,
    status: "playing",
    hasWon: false,
  };
};

export const loadGame = (): GameState => {
  if (typeof window === "undefined") return INITIAL_GAME_STATE;
  try {
    const raw = localStorage.getItem("game-2048-state");
    if (!raw) return newGame();
    const parsed = JSON.parse(raw) as Partial<GameState>;
    const grid: (Tile | null)[][] = (parsed.grid ?? []).map((row) =>
      (row ?? []).map((cell) => (cell ? ({ ...cell } as Tile) : null))
    );
    return {
      grid,
      score: typeof parsed.score === "number" ? parsed.score : 0,
      bestScore: typeof parsed.bestScore === "number" ? parsed.bestScore : 0,
      status: ["playing", "won", "gameover"].includes(parsed.status ?? "")
        ? (parsed.status as GameState["status"])
        : "playing",
      hasWon: !!parsed.hasWon,
    };
  } catch {
    return newGame();
  }
};

export const saveGame = (state: GameState): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("game-2048-state", JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
};

const slideRow = (
  row: (Tile | null)[]
): { tiles: (Tile | null)[]; score: number; moved: boolean } => {
  const nonEmpty = row.filter(Boolean) as Tile[];
  const merged: (Tile | null)[] = [];
  let score = 0;
  let mergedAny = false;

  for (let i = 0; i < nonEmpty.length; i++) {
    const current = nonEmpty[i];
    if (i + 1 < nonEmpty.length && nonEmpty[i + 1].value === current.value) {
      const mergedTile: Tile = {
        value: current.value * 2,
        position: current.position,
        id: current.id,
      };
      merged.push(mergedTile);
      score += mergedTile.value;
      i++;
      mergedAny = true;
    } else {
      merged.push(current);
    }
  }

  while (merged.length < GRID_SIZE) merged.push(null);

  const moved =
    mergedAny ||
    merged.some((tile, i) => {
      const original = row[i];
      if (!tile && !original) return false;
      if (tile && original) return tile.id !== original.id || tile.value !== original.value;
      return true;
    });

  return { tiles: merged, score, moved };
};

const transpose = (grid: (Tile | null)[][]): (Tile | null)[][] =>
  grid[0].map((_, colIndex) => grid.map((row) => row[colIndex]));

const reverseRows = (grid: (Tile | null)[][]): (Tile | null)[][] =>
  grid.map((row) => [...row].reverse());

export const move = (
  grid: (Tile | null)[][],
  direction: "up" | "down" | "left" | "right"
): { grid: (Tile | null)[][]; score: number; moved: boolean } => {
  let working = grid.map((row) => row.slice());

  if (direction === "right") working = reverseRows(working);
  if (direction === "up") working = transpose(working);
  if (direction === "down") working = reverseRows(transpose(working));

  let totalScore = 0;
  let moved = false;
  const newGrid = working.map((row) => {
    const { tiles, score, moved: rowMoved } = slideRow(row);
    totalScore += score;
    if (rowMoved) moved = true;
    return tiles;
  });

  let result = newGrid;
  if (direction === "right") result = reverseRows(newGrid);
  if (direction === "up") result = transpose(newGrid);
  if (direction === "down") result = transpose(reverseRows(newGrid));

  return { grid: result, score: totalScore, moved };
};

export const applyMove = (
  state: GameState,
  direction: "up" | "down" | "left" | "right"
): GameState => {
  if (state.status === "gameover") return state;

  const { grid: movedGrid, score: moveScore, moved } = move(state.grid, direction);
  if (!moved) return state;

  const gridAfterSpawn = spawnTile(movedGrid);
  const newScore = state.score + moveScore;
  const bestScore = Math.max(state.bestScore, newScore);
  const hasWon = state.hasWon || gridAfterSpawn.some((row) =>
    row.some((cell) => cell !== null && cell.value >= TARGET_TILE)
  );

  let status: GameState["status"] = "playing";
  if (hasWon && !state.hasWon) status = "won";
  else if (!canMove(gridAfterSpawn)) status = "gameover";
  else status = "playing";

  const nextState: GameState = {
    grid: gridAfterSpawn,
    score: newScore,
    bestScore,
    status,
    hasWon,
  };
  saveGame(nextState);
  return nextState;
};

export const canMove = (grid: (Tile | null)[][]): boolean => {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const cell = grid[row][col];
      if (!cell) return true;
      if (col + 1 < GRID_SIZE && grid[row][col + 1]?.value === cell.value)
        return true;
      if (row + 1 < GRID_SIZE && grid[row + 1][col]?.value === cell.value)
        return true;
    }
  }
  return false;
};

export const undoMove = (
  state: GameState,
  previous: GameState | null
): GameState => {
  if (!previous) return state;
  const nextState: GameState = {
    ...previous,
    bestScore: Math.max(previous.bestScore, state.bestScore),
  };
  saveGame(nextState);
  return nextState;
};
