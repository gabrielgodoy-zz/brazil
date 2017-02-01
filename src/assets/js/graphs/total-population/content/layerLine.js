import * as d3 from 'd3';

export default function createLayerLine(svgGroup, data, scales, reusableTransition) {
  let lineGenerator = d3.line()
                        .x(d => scales.xScale(d.year))
                        .y(d => scales.yScale(d.population));

  // Data Join
  let layerLine = svgGroup.selectAll('path.line')
                          .data(data);

  // 1 EXIT selection | When data leaves
  layerLine.exit()
           .transition(reusableTransition)
           .remove();

  // 2 UPDATE selection | Existing elements being updated
  layerLine.transition(reusableTransition)
           .attr('d', d => lineGenerator(d.years)); // Dynamic subject

  // 3 ENTER selection | When data enters
  layerLine.enter()
           .append('path')
           .attr('class', d => `age-group-${d.ageGroup.toLowerCase()} line`)
           .attr('d', d => lineGenerator(d.years))
           .style('stroke', 'steelblue')
           .style('stroke-width', 2)
           .style('fill', 'none');
}
