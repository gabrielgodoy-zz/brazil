import * as d3 from 'd3';

export default function createLayerDot(svgGroup, data, scales, reusableTransition) {
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

  // Data Join
  let layerDot = svgGroup.selectAll('.layer-dot')
                         .data(data[0].years);

  // 1 EXIT selection | When data leaves
  layerDot.exit()
          .transition(reusableTransition)
          .remove();

  // 2 UPDATE selection | Existing elements being updated
  layerDot.transition(reusableTransition)
          .select('circle')
          .attr('cx', d => scales.xScale(d.year))
          .attr('cy', d => scales.yScale(d.population));

  // 3 ENTER selection | When data enters
  layerDot.enter()
          .append('g')
          .attr('class', 'layer-dot')
          .append('circle')
          .attr('class', 'dot-item')
          .attr('r', 4)
          .attr('cx', d => scales.xScale(d.year))
          .attr('cy', d => scales.yScale(d.population))
          .on('mouseover', function(d, i) {
            setLayerActive(i, '.layer-guideline');
            setLayerActive(i, '.layer-tooltip');
          })
          .on('mouseout', function() {
            disableLayer('.layer-guideline');
            disableLayer('.layer-tooltip');
          });
}
