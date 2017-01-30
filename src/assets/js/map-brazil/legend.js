import * as d3 from 'd3';

export function createLegend(ufsData) {
  let legendContainer = d3.select('.header-legend')
                          .append('svg')
                          .attr('width', 115);
  let regions = d3.set(ufsData, uf => uf.properties.region).values();

  let legendItem = legendContainer.selectAll('.legend-item')
                                  .data(regions)
                                  .enter()
                                  .append('g')
                                  .attr('class', 'legend-item')
                                  .attr('transform', (d, i) => `translate(0, ${20 * i})`);

  legendItem.append('rect')
            .attr('width', 10)
            .attr('class', d => `region-${d.toLowerCase()}`)
            .attr('height', 10)
            .attr('fill', 'black');

  legendItem.append('text')
            .text(d => d)
            .attr('y', d => 10)
            .attr('x', 20);
}
