import * as topojson from 'topojson';
import * as d3 from 'd3';

let margin = {
  top: 30,
  right: 20,
  bottom: 60,
  left: 30,
};

// With responsivefy the height and width
// will always follow his aspect ratio of 400 / 565

let svg;
let width = 800 - margin.left - margin.right;
let height = 900 - margin.top - margin.bottom;

export default function renderMap() {
  if (!document.querySelector('.chart-brazil-map')) {
    return;
  }

  svg = d3.select('.chart-brazil-map')
          .append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .attr('class', 'svg-container-map-brazil')
          .call(responsivefy)
          .append('g')
          .attr('transform', `translate(${margin.left}, ${margin.top})`);

  d3.queue()
    .defer(d3.json, '/src/assets/data/br-simplified.json')
    .await(ready);
}

/*
 Create a new projection using Mercator (geoMercator)
 and center it (translate)
 and zoom in a certain amount (scale)
 */
let projection = d3.geoMercator()
                   .translate([width + 450, 80])
                   .scale(900);

/*
 Create a path (geoPath)
 using the projection
 */
let path = d3.geoPath()
             .projection(projection);

function ready(error, data) {
  /*
   topojson.feature converts RAW geodata into usable geo data
   always pass it data, then data.objects.__something__
   then get .features out of it
   */
  // Extract countries from topojson
  let ufs = topojson.feature(data, data.objects.estados).features;

  // Add a path for each country
  // Shapes -> Path
  svg.selectAll('.uf')
     .data(ufs)
     .enter()
     .append('path')
     .attr('class', 'uf')
     .attr('class', d => `${d.properties.nome} uf`)
     .attr('d', path);
}

/**
 * This function add behaviour to svg to become responsive inside
 * the div element that is wrapping it
 * @param {Object} svg svg D3 selection
 */
function responsivefy(svg) {
  // get container + svg aspect ratio
  let container = d3.select(svg.node().parentNode),
    width = parseInt(svg.style('width')),
    height = parseInt(svg.style('height')),
    aspect = width / height;

  // add viewBox and preserveAspectRatio properties,
  // and call resize so that svg resizes on inital page load
  svg.attr('viewBox', '0 0 ' + width + ' ' + height)
     .attr('perserveAspectRatio', 'xMinYMid')
     .call(resize);

  // to register multiple listeners for same event type,
  // you need to add namespace, i.e., 'click.foo'
  // necessary if you call invoke this function for multiple svgs
  // api docs: https://github.com/mbostock/d3/wiki/Selections#on
  d3.select(window).on('resize.' + container.attr('id'), resize);

  // get width of container and resize svg to fit it
  function resize() {
    let targetWidth = parseInt(container.style('width'));
    // set svg width and height to the same dimension as its container
    svg.attr('width', targetWidth);
    svg.attr('height', Math.round(targetWidth / aspect));
  }
}
