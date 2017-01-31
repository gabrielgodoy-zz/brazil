import * as d3 from 'd3';
import {responsivefy} from './../../helpers';
import {config} from './config';

export default function createSvg() {
  let svg = d3.select('.graph-container')
              .append('svg')
              .attr('width', config.width + config.margin.left + config.margin.right)
              .attr('height', config.height + config.margin.top + config.margin.bottom)
              .call(responsivefy);

  return svg.append('g')
            .attr('transform', `translate(${config.margin.left}, ${config.margin.top})`);
}
