import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  createCoverageGrid,
  getCoverageProgress,
  isCoverageComplete,
  resetCoverageGrid,
  stampCoverageGrid,
} from "../.tmp/unit-tests/utils/color-reveal-progress.js";

describe("color reveal coverage grid", () => {
  it("creates a fixed cell grid and reports initial zero progress", () => {
    const grid = createCoverageGrid({ width: 100, height: 80, cellSize: 20 });

    assert.equal(grid.columns, 5);
    assert.equal(grid.rows, 4);
    assert.equal(grid.totalCells, 20);
    assert.deepEqual(getCoverageProgress(grid), {
      rawPercent: 0,
      displayPercent: 0,
      revealedCells: 0,
      totalCells: 20,
    });
  });

  it("stamps a brush once per covered cell", () => {
    const grid = createCoverageGrid({ width: 40, height: 40, cellSize: 10 });

    const firstStamp = stampCoverageGrid(grid, { x: 15, y: 15, radius: 12 });
    const secondStamp = stampCoverageGrid(grid, { x: 15, y: 15, radius: 12 });

    assert.equal(firstStamp.revealedCells, 5);
    assert.equal(secondStamp.revealedCells, 5);
    assert.equal(secondStamp.rawPercent, 31.25);
    assert.equal(secondStamp.displayPercent, 31);
  });

  it("resets revealed cells without changing grid geometry", () => {
    const grid = createCoverageGrid({ width: 40, height: 40, cellSize: 10 });

    stampCoverageGrid(grid, { x: 15, y: 15, radius: 12 });
    const progress = resetCoverageGrid(grid);

    assert.equal(grid.columns, 4);
    assert.equal(grid.rows, 4);
    assert.equal(progress.revealedCells, 0);
    assert.equal(progress.rawPercent, 0);
    assert.equal(
      grid.cells.some((cell) => cell !== 0),
      false,
    );
  });

  it("checks completion threshold from raw progress", () => {
    assert.equal(isCoverageComplete(81.99, 82), false);
    assert.equal(isCoverageComplete(82, 82), true);
    assert.equal(
      isCoverageComplete(
        {
          rawPercent: 83.2,
          displayPercent: 83,
          revealedCells: 832,
          totalCells: 1000,
        },
        82,
      ),
      true,
    );
  });

  it("clamps brush stamps to canvas boundaries", () => {
    const grid = createCoverageGrid({ width: 100, height: 100, cellSize: 10 });

    const topLeft = stampCoverageGrid(grid, { x: 0, y: 0, radius: 16 });
    const bottomRight = stampCoverageGrid(grid, {
      x: 100,
      y: 100,
      radius: 16,
    });
    const outside = stampCoverageGrid(grid, { x: -20, y: -20, radius: 5 });

    assert.equal(topLeft.revealedCells, 3);
    assert.equal(bottomRight.revealedCells, 6);
    assert.equal(outside.revealedCells, 6);
  });
});
