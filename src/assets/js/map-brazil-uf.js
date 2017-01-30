import * as topojson from 'topojson';
import * as d3 from 'd3';
import getStatesData from './api';
import addDots from './helpers';

let mapData = require('./../data/br-simplified.json');
let margin = {
  top: 30,
  right: 20,
  bottom: 60,
  left: 30,
};

// With responsivefy the height and width
// will always follow his aspect ratio of 400 / 565

let width = 800 - margin.left - margin.right;
let height = 900 - margin.top - margin.bottom;
let svg;
let svgGroup;

export default function renderMap() {
  if (!document.querySelector('#chart-brazil-map')) {
    return;
  }

  let zoomListener = d3.zoom().on("zoom", zoomed);

  function zoomed() {
    d3.select('.innerGroup').attr("transform", d3.event.transform);
  }

  d3.select('.bt-reset-map').on('click', resetMap);
  function resetMap() {
    d3.select('.svg-container-map-brazil')
      .transition()
      .duration(750)
      .call(zoomListener.transform, d3.zoomIdentity.translate(30, 30).scale(1));
  }

  svg = d3.select('.chart-brazil-map')
          .append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .attr('class', 'svg-container-map-brazil')
          .call(responsivefy)
          .call(zoomListener)
          .on("wheel.zoom", null);

  svgGroup = svg.append('g')
                .attr('class', 'innerGroup')
                .attr('transform', `translate(${margin.left}, ${margin.top})`);

  makeMap(mapData);
}

/*
 Create a new projection using Mercator (geoMercator)
 and center it (translate)
 and zoom in a certain amount (scale)
 */
let projection = d3.geoMercator()
                   .translate([width + 670, 80])
                   .scale(1100);

// Create a path (geoPath) using the projection
let path = d3.geoPath().projection(projection);

function makeMap(data) {
  /*
   topojson.feature converts RAW geodata into usable geo data
   Always pass it data, then data.objects.SOMETHING
   then get .features out of it
   */
  // Extract estados from topojson
  let ufs = topojson.feature(data, data.objects.states).features;

  let labelsData = [];
  // Store the projected coordinates of the places for the labels
  ufs.forEach((d) => {
    // Projection function receives array with 2 elements
    labelsData.push({
      x: path.centroid(d)[0],
      y: path.centroid(d)[1],
      label: d.properties.name,
      initials: d.id
    });
  });

  function getTextDimension() {
    return d3.select('#tooltip .info').node().getBBox().width;
  }

  // Add a path for each state
  // Shapes -> Path
  let state = svgGroup.selectAll('.uf')
                      .data(ufs)
                      .enter()
                      .append('g')
                      .attr('class', d => {
                        let stateName = `uf-${d.id.toLowerCase()}`;
                        let regionName = d.properties.region.toLowerCase();
                        return `${stateName} ${regionName} uf`;
                      });

  // State events
  state.on("mouseover", stateMouseOver)
       .on("mousemove", stateMouseMove)
       .on("click", stateClick)
       .on("mouseout", stateMouseOut);

  let statesData;

  function stateClick(d) {
    document.querySelector('.sidebar-right-side').innerHTML =
      '<p class="loading-data">Carregando dados...</p>';
    if (!statesData) {
      getStatesData().then(response => {
        let {data: statesData} = response;
        displayStateData(d, statesData);
      });
    } else {
      displayStateData(d, statesData);
    }
  }

  /**
   * @param {String} state
   * @param {Object} state.properties
   * @param {String} state.properties.name
   * @param {String} state.properties.capital
   * @param {String} statesData
   * @param {Array} statesData.geonames
   * @param {Number} statesData.population
   */
  function displayStateData(state, statesData) {
    let lowerCaseState = state.properties.name.toLowerCase();
    let stateDetails = statesData.geonames
                                 .find(stateDetails => {
                                   return lowerCaseState === stateDetails.adminName1.toLowerCase()
                                 });

    let stateObject = getStateDetails(stateDetails, statesData);

    let stateName = state.properties.name;
    document.querySelector('.sidebar-right-side').innerHTML = `
      <h3 class="title-sidebar">${stateName}</h3>
      <p>Capital: ${state.properties.capital}</p>
      <p>População: ${addDots(stateObject.population)}</p>
    `
  }

  function getStateDetails(stateDetails = undefined, statesData) {
    if (stateDetails) {
      return stateDetails;
    } else {
      let brasilia = 'Federal District';
      return statesData.geonames
                       .find(stateDetails => stateDetails.adminName1 === brasilia);
    }
  }

  function stateMouseOver(d) {
    let tooltipBox = svg.append("g").attr("id", "tooltip");
    tooltipBox.append("text")
              .attr("class", "info")
              .attr("y", 17)
              .attr("x", 5)
              .text(d.properties.name);

    tooltipBox.insert('rect', '.info')
              .attr('width', getTextDimension() + 10)
              .attr('height', 24)
              .attr('rx', 5)
              .attr('ry', 5)
              .attr("class", "tooltip-box");
    d3.select(this).classed("selected", true);
  }

  function stateMouseOut() {
    d3.select("#tooltip").remove();
    d3.select(this)
      .classed("selected", false)
      .transition()
      .duration(250)
  }

  function stateMouseMove(d) {
    let labelCenter = getTextDimension() / 2;
    let xPosition = d3.mouse(this)[0] - labelCenter;
    let yPosition = d3.mouse(this)[1] - 30;
    d3.select('#tooltip').attr('transform', `translate(${xPosition}, ${yPosition})`)
  }

  state.append('path').attr('d', path);

  let ufLabels = svgGroup.selectAll('.uf-initial')
                         .data(labelsData)
                         .enter().append('g')
                         .attr('class', 'uf-initial');

  ufLabels.append('text')
          .attr('text-anchor', 'middle')
          .attr('class', d => `uf-initial-text state-${d.initials.toLowerCase()}`)
          .attr('x', d => d.x)
          .attr('y', d => d.y)
          .text(d => d.initials)
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
