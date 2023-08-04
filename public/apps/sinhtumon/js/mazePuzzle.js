function findWay(matrix, position, end) {
  var queue = [];
  let collision = new Array(matrix.length);
  for (let i = 0; i < matrix.length; i++) {
    collision[i] = [...matrix[i]];
  }

  collision[position[0]][position[1]] = 1;
  queue.push([position]); // store a path, not just a position

  while (queue.length > 0) {
    let path = queue.shift(); // get the path out of the queue
    let pos = path[path.length - 1]; // ... and then the last position from it
    let direction = [
      [pos[0] + 1, pos[1]],
      [pos[0], pos[1] + 1],
      [pos[0] - 1, pos[1]],
      [pos[0], pos[1] - 1],
    ];

    for (let i = 0; i < direction.length; i++) {
      // Perform this check first:
      if (direction[i][0] == end[0] && direction[i][1] == end[1]) {
        // return the path that led to the find
        return path.concat([end]);
      }

      if (
        direction[i][0] < 0 ||
        direction[i][0] >= collision[0].length ||
        direction[i][1] < 0 ||
        direction[i][1] >= collision[0].length ||
        collision[direction[i][0]][direction[i][1]] != 0
      ) {
        continue;
      }

      collision[direction[i][0]][direction[i][1]] = 1;
      // extend and push the path on the queue
      queue.push(path.concat([direction[i]]));
    }
  }

  // Can't solve
  return null;
}
