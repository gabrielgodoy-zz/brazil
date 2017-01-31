import 'bootstrap/dist/js/bootstrap.min';
import '../style/main.styl';
import setupBarba from './routes/setupBarba';
import createMap from './map-brazil/initMap';
import graphPopulation from './graphs/total-population/init';

document.addEventListener('DOMContentLoaded', function() {
  setupBarba(initGraphs);
  setTimeout(() => {
    initGraphs();
  }, 300);
  preventClickIfHrefIsCurrentPage();
});

function initGraphs() {
  createMap();
  graphPopulation.init();
}

function preventClickIfHrefIsCurrentPage() {
  let links = document.querySelectorAll('a[href]');
  let clickFunction = (e) => {
    let linkHrefIsCurrentPage = e.currentTarget.href === window.location.href;
    if (linkHrefIsCurrentPage) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  [].forEach.call(links, link => link.addEventListener('click', clickFunction));
}
