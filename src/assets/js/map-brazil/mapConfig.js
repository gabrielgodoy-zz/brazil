import * as d3 from 'd3';

export function createZoomBehaviour() {
  return d3.zoom().on("zoom", zoomed);
}

function zoomed() {
  d3.select('.innerGroup').attr("transform", d3.event.transform);
}

export const dimensionConfig = {
  width: 800,
  height: 900
};

export function pathFromProjection(config) {
  /*
   Create a new projection using Mercator (geoMercator)
   and center it (translate)
   and zoom in a certain amount (scale)
   */
  let projection = d3.geoMercator()
                     .translate([config.width + 640, 120])
                     .scale(1100);

  // Create a path (geoPath) using the projection
  return d3.geoPath().projection(projection);
}
