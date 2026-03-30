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

    for (let i = 0; i < directions.length; i++) {
      const dir = directions[i];
      if (dir[0] === end[0] && dir[1] === end[1]) {
        return path.concat([end]);
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
      queue.push(path.concat([dir]));
    }
  }

  return null;
}
