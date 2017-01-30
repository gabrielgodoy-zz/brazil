import 'bootstrap/dist/js/bootstrap.min';
import '../style/main.styl';
import setupBarba from './routes/setupBarba';
import createMap from './map-brazil/initMap';

document.addEventListener('DOMContentLoaded', function() {
  setupBarba(createMap);
  setTimeout(() => {
    createMap();
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
