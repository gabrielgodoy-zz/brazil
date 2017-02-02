import createSvg from './svgContainer';
import createScales from './content/axes';
import getData from './data';
import renderContent from './content/content';

let graphPopulation = (() => {
  function init() {
    let svgGroup = createSvg();
    let data = getData();
    let scales = createScales(svgGroup, data.slice(0, 1));
    renderContent(svgGroup, data.slice(0, 1), scales);
    createEventListeners(svgGroup, data, scales, '.update-graph-buttons .update-graph');
  }

  return {init};
})();

function createEventListeners(svgGroup, data, scales, selector) {
  let buttons = document.querySelectorAll(selector);
  [].forEach.call(buttons, function(button, i, array) {
    button.addEventListener('click', function() {
      [].forEach.call(buttons, function(button, i, array) {
        button.classList.remove('active');
      });
      this.classList.add('active');
      let buttonIndex = [].indexOf.call(array, this);
      scales.updateScales(data.slice(buttonIndex, buttonIndex + 1));
      renderContent(svgGroup, data.slice(buttonIndex, buttonIndex + 1), scales);
    });
  });
}

export default graphPopulation;
