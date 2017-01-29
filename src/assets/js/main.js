import 'bootstrap/dist/js/bootstrap.min';
import '../style/main.styl';
import setupBarba from './setupBarba';
import renderMap from './map-brazil-uf';

document.addEventListener('DOMContentLoaded', function() {
  setupBarba();
  renderMap();
});
