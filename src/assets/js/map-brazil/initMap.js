import * as d3 from 'd3';
import * as topojson from 'topojson';
import State from './states';
import {setupMainSvg, setupSvgGroup} from './mainSvg';
import {createZoomBehaviour, mapDimensionConfig, pathFromProjection} from './mapConfig';

let config = mapDimensionConfig;
let svg;
let svgGroup;
let zoomListener = createZoomBehaviour();

export default function renderMap() {
  let noMapContainer = !document.querySelector('#chart-brazil-map');
  if (noMapContainer) {
    return;
  }
  svg = setupMainSvg(config, zoomListener);
  svgGroup = setupSvgGroup(svg, config);
  let mapData = require('./../../data/br-simplified.json');
  makeMap(mapData);
  d3.select('.bt-reset-map').on('click', resetMap);
}

function resetMap() {
  d3.select('.svg-container-map-brazil')
    .transition()
    .duration(750)
    .call(zoomListener.transform, d3.zoomIdentity.translate(30, 30).scale(1));
}

function makeMap(data) {
  let ufs = topojson.feature(data, data.objects.states).features;
  let state = State.createState(ufs, svgGroup);
  State.addEventListeners(state);

  let stateInPath = pathFromProjection(config);
  let labelsData = State.generateLabelsData(ufs, stateInPath);
  State.addStateLabels(svgGroup, labelsData);
  state.append('path').attr('d', stateInPath);
}
