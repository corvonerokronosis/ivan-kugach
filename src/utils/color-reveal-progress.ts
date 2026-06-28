export interface CoverageGridOptions {
  width: number;
  height: number;
  cellSize: number;
}

export interface CoverageStamp {
  x: number;
  y: number;
  radius: number;
}

export interface CoverageProgress {
  rawPercent: number;
  displayPercent: number;
  revealedCells: number;
  totalCells: number;
}

export interface CoverageGrid {
  width: number;
  height: number;
  cellSize: number;
  columns: number;
  rows: number;
  totalCells: number;
  revealedCells: number;
  cells: Uint8Array;
}

export function createCoverageGrid(options: CoverageGridOptions): CoverageGrid {
  const width = requirePositiveFiniteNumber(options.width, "width");
  const height = requirePositiveFiniteNumber(options.height, "height");
  const cellSize = requirePositiveFiniteNumber(options.cellSize, "cellSize");
  const columns = Math.max(1, Math.ceil(width / cellSize));
  const rows = Math.max(1, Math.ceil(height / cellSize));
  const totalCells = columns * rows;

  return {
    width,
    height,
    cellSize,
    columns,
    rows,
    totalCells,
    revealedCells: 0,
    cells: new Uint8Array(totalCells),
  };
}

export function resetCoverageGrid(grid: CoverageGrid): CoverageProgress {
  grid.cells.fill(0);
  grid.revealedCells = 0;

  return getCoverageProgress(grid);
}

export function revealAllCoverageGrid(grid: CoverageGrid): CoverageProgress {
  grid.cells.fill(1);
  grid.revealedCells = grid.totalCells;

  return getCoverageProgress(grid);
}

export function stampCoverageGrid(
  grid: CoverageGrid,
  stamp: CoverageStamp,
): CoverageProgress {
  if (stamp.radius <= 0 || grid.totalCells === 0) {
    return getCoverageProgress(grid);
  }

  const minColumn = Math.max(
    0,
    Math.floor((stamp.x - stamp.radius) / grid.cellSize),
  );
  const maxColumn = Math.min(
    grid.columns - 1,
    Math.floor((stamp.x + stamp.radius) / grid.cellSize),
  );
  const minRow = Math.max(
    0,
    Math.floor((stamp.y - stamp.radius) / grid.cellSize),
  );
  const maxRow = Math.min(
    grid.rows - 1,
    Math.floor((stamp.y + stamp.radius) / grid.cellSize),
  );

  for (let row = minRow; row <= maxRow; row += 1) {
    for (let column = minColumn; column <= maxColumn; column += 1) {
      const centerX = column * grid.cellSize + grid.cellSize / 2;
      const centerY = row * grid.cellSize + grid.cellSize / 2;

      if (Math.hypot(centerX - stamp.x, centerY - stamp.y) > stamp.radius) {
        continue;
      }

      const index = row * grid.columns + column;
      if (grid.cells[index] === 0) {
        grid.cells[index] = 1;
        grid.revealedCells += 1;
      }
    }
  }

  return getCoverageProgress(grid);
}

export function getCoverageProgress(grid: CoverageGrid): CoverageProgress {
  const rawPercent =
    grid.totalCells > 0 ? (grid.revealedCells / grid.totalCells) * 100 : 0;

  return {
    rawPercent: Math.min(100, rawPercent),
    displayPercent: Math.min(100, Math.round(rawPercent)),
    revealedCells: grid.revealedCells,
    totalCells: grid.totalCells,
  };
}

export function isCoverageComplete(
  progress: CoverageProgress | number,
  completionTarget: number,
): boolean {
  const rawPercent =
    typeof progress === "number" ? progress : progress.rawPercent;

  return rawPercent >= completionTarget;
}

function requirePositiveFiniteNumber(value: number, name: string): number {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`Color reveal coverage grid: ${name} must be positive`);
  }

  return value;
}
