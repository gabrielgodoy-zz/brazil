import * as d3 from 'd3';

export function createZoomBehaviour() {
  return d3.zoom().on("zoom", zoomed);
}

function zoomed() {
  d3.select('.innerGroup').attr("transform", d3.event.transform);
}

export const mapDimensionConfig = {
  margin: {
    top: 30,
    right: 20,
    bottom: 60,
    left: 30,
  },
  init() {
    this.width = 800 - this.margin.left - this.margin.right;
    this.height = 900 - this.margin.top - this.margin.bottom;
    return this;
  },
}.init();

export function pathFromProjection(config) {
  /*
   Create a new projection using Mercator (geoMercator)
   and center it (translate)
   and zoom in a certain amount (scale)
   */
  let projection = d3.geoMercator()
                     .translate([config.width + 670, 80])
                     .scale(1100);

  // Create a path (geoPath) using the projection
  return d3.geoPath().projection(projection);
}
