import {addDots} from '../../../helpers';

export default function createLayerTooltip(svgGroup, data, scales) {
// Data Join
  let layerTooltip = svgGroup.selectAll('.layer-tooltip')
                             .data(data[0].years);

  // 1 EXIT selection | When data leaves
  layerTooltip.exit()
              .remove();

  // 2 UPDATE selection | Existing elements being updated
  layerTooltip.attr('transform', d => `translate(${scales.xScale(d.year)}, \
                                                 ${scales.yScale(d.population) - 35})`)
              .select('.layer-tooltip-population')
              .text(d => addDots(d.population));

  // 3 ENTER
  let enterLayerTooltip = layerTooltip.enter()
                                      .append('g')
                                      .attr('class', 'layer-tooltip')
                                      .attr('transform', d => `translate(${scales.xScale(d.year)}, \
                                                   ${scales.yScale(d.population) - 35})`);

  enterLayerTooltip.append('rect')
                   .attr('width', 80)
                   .attr('height', 40)
                   .attr('x', -40)
                   .attr('y', -18)
                   .attr('rx', 5)
                   .attr('ry', 5)
                   .attr('filter', 'url(#drop-shadow)')
                   .attr('class', 'layer-tooltip-box');

  enterLayerTooltip.append('text')
                   .attr('text-anchor', 'middle')
                   .attr('class', 'layer-tooltip-year')
                   .text(d => d.year.getFullYear());

  enterLayerTooltip.append('text')
                   .attr('text-anchor', 'middle')
                   .attr('class', 'layer-tooltip-population')
                   .attr('y', 15)
                   .text(d => addDots(d.population));
}
