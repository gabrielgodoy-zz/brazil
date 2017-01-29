import 'bootstrap/dist/js/bootstrap.min';
import '../style/main.styl';
import setupBarba from './setupBarba';
import renderMap from './map-brazil-uf';

document.addEventListener('DOMContentLoaded', function() {
  setupBarba(renderMap);
  setTimeout(() => {
    renderMap();
  }, 300);
  preventClickIfHrefIsCurrentPage();
});

function preventClickIfHrefIsCurrentPage() {
  let links = document.querySelectorAll('a[href]');
  let clickFunction = (e) => {
    let linkHrefIsCurrentPage = e.currentTarget.href === window.location.href;
    if (linkHrefIsCurrentPage) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  links.forEach(link => link.addEventListener('click', clickFunction));
}
