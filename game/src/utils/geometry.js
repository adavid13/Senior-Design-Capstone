export function scaleHexagonAtCenter(points, factor) {
  const centerCoordinate = {
    x: points[2].x,
    y: points[2].y - (points[2].y - points[5].y) / 2
  };
  const scalePoints = points.map(point => ({
    x: point.x * factor,
    y: point.y * factor
  }));

  const newCenter = {
    x: scalePoints[2].x,
    y: scalePoints[2].y - (scalePoints[2].y - scalePoints[5].y) / 2
  };

  return scalePoints.map(point => ({
    x: point.x + (centerCoordinate.x - newCenter.x),
    y: point.y + (centerCoordinate.y - newCenter.y)
  }));
}

export function hexagonRadius(points) {
  return Math.sqrt(
    Math.pow(points[1].x - points[2].x, 2) + Math.pow(points[1].y - points[2].y, 2)
  );
}