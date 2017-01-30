import * as d3 from 'd3';
import {responsivefy} from '../helpers';

/**
 *
 * @param {Object} config Object with margins and width
 * @param {Object} zoomListener Zoom behaviour
 */
export function setupMainSvg(config, zoomListener) {
  return d3.select('.chart-brazil-map')
           .append('svg')
           .attr('width', config.width + config.margin.left + config.margin.right)
           .attr('height', config.height + config.margin.top + config.margin.bottom)
           .attr('class', 'svg-container-map-brazil')
           .call(responsivefy)
           .call(zoomListener)
           .on("wheel.zoom", null);
}

export function setupSvgGroup(svg, config) {
  return svg.append('g')
            .attr('class', 'innerGroup')
            .attr('transform', `translate(${config.margin.left}, ${config.margin.top})`);
}
