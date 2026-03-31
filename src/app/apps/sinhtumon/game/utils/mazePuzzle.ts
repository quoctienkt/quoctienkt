/**
 * BFS pathfinding for the tower defense maze.
 * Returns the shortest path from `position` to `end` on `matrix`,
 * where 0 = walkable, 1 = blocked. Returns null if no path exists.
 */
export function findWay(
  matrix: number[][],
  position: [number, number],
  end: [number, number],
): [number, number][] | null {
  const queue: [number, number][][] = [];
  const collision: number[][] = matrix.map((row) => [...row]);

  collision[position[0]][position[1]] = 1;
  queue.push([position]);

  while (queue.length > 0) {
    const path = queue.shift()!;
    const pos = path[path.length - 1];

    const directions: [number, number][] = [
      [pos[0] + 1, pos[1]],
      [pos[0], pos[1] + 1],
      [pos[0] - 1, pos[1]],
      [pos[0], pos[1] - 1],
    ];

    for (const dir of directions) {
      if (dir[0] === end[0] && dir[1] === end[1]) {
        return [...path, end] as [number, number][];
      }

      if (
        dir[0] < 0 ||
        dir[0] >= collision.length ||
        dir[1] < 0 ||
        dir[1] >= collision[0].length ||
        collision[dir[0]][dir[1]] !== 0
      ) {
        continue;
      }

      collision[dir[0]][dir[1]] = 1;
      queue.push([...path, dir] as [number, number][]);
    }
  }

  return null;
}
