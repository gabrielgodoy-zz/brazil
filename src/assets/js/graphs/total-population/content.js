import * as d3 from 'd3';
import {addDots, svgShadow} from '../../helpers';
import {config} from './config';

export default function createContent(svgGroup, data, scales) {
  let shadowConfig = {
    stdDeviation: 1,
    feOffsetDX: .85,
    feOffsetDY: .85,
    shadowColor: '#666'
  };
  svgShadow(svgGroup, shadowConfig);

  let line = d3.line()
               .x(d => scales.xScale(d.year))
               .y(d => scales.yScale(d.population));

  svgGroup.selectAll('path.line')
          .data(data)
          .enter()
          .append('path')
          .attr('class', d => `age-group-${d.ageGroup.toLowerCase()} line`)
          .attr('d', d => line(d.years))
          .style('stroke', 'steelblue')
          .style('stroke-width', 2)
          .style('fill', 'none');

  let layerGuidelines = svgGroup.selectAll('.layer-guideline')
                                .data(data[0].years)
                                .enter()
                                .append('g')
                                .attr('class', 'layer-guideline');

  layerGuidelines.append('line')
                 .attr('class', 'guideline guideline-horizontal')
                 .attr('x1', 0)
                 .attr('x2', d => scales.xScale(d.year))
                 .attr('y1', d => scales.yScale(d.population))
                 .attr('y2', d => scales.yScale(d.population));

  layerGuidelines.append('line')
                 .attr('class', 'guideline guideline-vertical')
                 .attr('x1', d => scales.xScale(d.year))
                 .attr('x2', d => scales.xScale(d.year))
                 .attr('y1', d => config.height)
                 .attr('y2', d => scales.yScale(d.population));

  function setLayerActive(index, selector) {
    d3.selectAll(selector)
      .each(function(d2, innerIndex) {
        d3.select(this).classed('layer-active', index === innerIndex);
      })
  }

  function disableLayer(selector) {
    d3.selectAll(selector)
      .each(function() {
        d3.select(this).classed('layer-active', false);
      })
  }

  let layerDot = svgGroup.selectAll('.layer-dot')
                         .data(data[0].years)
                         .enter()
                         .append('g')
                         .attr('class', 'layer-dot');

  layerDot.append('circle')
          .attr('r', 3)
          .attr('cx', d => scales.xScale(d.year))
          .attr('cy', d => scales.yScale(d.population));

  layerDot.on('mouseover', function(d, i) {
    setLayerActive(i, '.layer-guideline');
    setLayerActive(i, '.layer-tooltip');
  }).on('mouseout', function() {
    disableLayer('.layer-guideline');
    disableLayer('.layer-tooltip');
  });

  let layerTooltip = svgGroup.selectAll('.layer-tooltip')
                             .data(data[0].years)
                             .enter()
                             .append('g')
                             .attr('class', 'layer-tooltip')
                             .attr('transform', d => `translate(${scales.xScale(d.year)}, ${scales.yScale(d.population) - 35})`);

  layerTooltip.append('rect')
              .attr('width', 80)
              .attr('height', 40)
              .attr('x', -40)
              .attr('y', -18)
              .attr('rx', 5)
              .attr('ry', 5)
              .attr('filter', 'url(#drop-shadow)')
              .attr('class', 'layer-tooltip-box');

  layerTooltip.append('text')
              .attr('text-anchor', 'middle')
              .attr('class', 'layer-tooltip-year')
              .text(d => d.year.getFullYear());

  layerTooltip.append('text')
              .attr('text-anchor', 'middle')
              .attr('class', 'layer-tooltip-population')
              .attr('y', 15)
              .text(d => addDots(d.population));
}
