import * as d3 from 'd3';

export function addDots(numberToFormat) {
  numberToFormat += '';
  let x = numberToFormat.split('.');
  let x1 = x[0];
  let x2 = x.length > 1 ? '.' + x[1] : '';
  let rgx = /(\d+)(\d{3})/;

  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + '.' + '$2');
  }
  return x1 + x2;
}

export function svgShadow(svg, config) {
  let defs = svg.append("defs");

  // create filter with id #drop-shadow
  // height=130% so that the shadow is not clipped
  let filter = defs.append("filter")
                   .attr("id", "drop-shadow")
                   .attr("height", "130%");

  // SourceAlpha refers to opacity of graphic that this filter will be applied to
  // convolve that with a Gaussian with standard deviation 3 and store result in blur
  filter.append("feGaussianBlur")
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", config.stdDeviation)
        .attr("result", "blur");

  // translate output of Gaussian blur to the right and downwards with 2px
  // store result in offsetBlur
  filter.append("feOffset")
        .attr("in", "blur")
        .attr("dx", config.feOffsetDX)
        .attr("dy", config.feOffsetDY)
        .attr("result", "offsetBlur");

  filter.append("feFlood")
        .attr("flood-color", config.shadowColor)
        .attr("flood-opacity", .5)
        .attr("result", "offsetColor");

  let feComposite = filter.append("feComposite");
  feComposite.attr("in", "offsetColor")
             .attr("in2", "offsetBlur")
             .attr("operator", "in")
             .attr("result", "offsetBlur");

  // overlay original SourceGraphic over translated blurred opacity by using
  // feMerge filter. Order of specifying inputs is important!
  let feMerge = filter.append("feMerge");
  feMerge.append("feMergeNode")
         .attr("in", "offsetBlur");
  feMerge.append("feMergeNode")
         .attr("in", "SourceGraphic");
}

export function responsivefy(svg) {
  let container = d3.select(svg.node().parentNode),
    width = parseInt(svg.style('width')),
    height = parseInt(svg.style('height')),
    aspect = width / height;
  svg.attr('viewBox', '0 0 ' + width + ' ' + height)
     .attr('perserveAspectRatio', 'xMinYMid')
     .call(resize);
  d3.select(window).on('resize.' + container.attr('id'), resize);
  function resize() {
    let targetWidth = parseInt(container.style('width'));
    if (targetWidth) {
      svg.attr('width', targetWidth);
      svg.attr('height', Math.round(targetWidth / aspect));
    }
  }
}
