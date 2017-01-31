import createSvg from './svgContainer';
import createScales from './axes';
import getData from './data';
import createContent from './content';

let graphPopulation = (() => {
  function init() {
    let svgGroup = createSvg();
    let data = getData();
    let dataTotalPopulation = data.slice(0, 1);
    let scales = createScales(svgGroup, dataTotalPopulation);
    createContent(svgGroup, dataTotalPopulation, scales);
  }

  return {init};
})();

export default graphPopulation;
