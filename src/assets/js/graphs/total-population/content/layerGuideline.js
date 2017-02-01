import {config} from '../config';

export default function createLayerGuideline(svgGroup, data, scales, reusableTransition) {
  // Data Join
  let layerGuidelines = svgGroup.selectAll('.layer-guideline')
                                .data(data[0].years);

  // 1 EXIT selection | When data leaves
  layerGuidelines.exit()
                 .transition(reusableTransition)
                 .remove();

  // 2 UPDATE selection | Existing elements being updated
  layerGuidelines.transition(reusableTransition)
                 .select('.guideline-vertical')
                 .attr('x1', d => scales.xScale(d.year))
                 .attr('x2', d => scales.xScale(d.year))
                 .attr('y1', d => config.height)
                 .attr('y2', d => scales.yScale(d.population));
  layerGuidelines.transition(reusableTransition)
                 .select('.guideline-horizontal')
                 .attr('x2', d => scales.xScale(d.year))
                 .attr('y1', d => scales.yScale(d.population))
                 .attr('y2', d => scales.yScale(d.population));

  // 3 ENTER selection | When data enters
  let enterLayerGuidelines = layerGuidelines.enter()
                                            .append('g')
                                            .attr('class', 'layer-guideline');
  enterLayerGuidelines.append('line')
                      .attr('class', 'guideline guideline-horizontal')
                      .attr('x1', 0)
                      .attr('x2', d => scales.xScale(d.year))
                      .attr('y1', d => scales.yScale(d.population))
                      .attr('y2', d => scales.yScale(d.population));
  enterLayerGuidelines.append('line')
                      .attr('class', 'guideline guideline-vertical')
                      .attr('x1', d => scales.xScale(d.year))
                      .attr('x2', d => scales.xScale(d.year))
                      .attr('y1', d => config.height)
                      .attr('y2', d => scales.yScale(d.population));
}
