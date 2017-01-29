import * as Barba from 'barba.js';
import renderMap from './map-brazil-uf';

export default function setupBarba() {
  let transitionTime = 500;
  let FadeTransition = Barba.BaseTransition.extend({
    // Call start when transition begins
    start: function() {
      Promise.all([this.newContainerLoading, this.fadeOut()])
             .then(this.fadeIn.bind(this));
    },
    fadeOut: function() {
      this.oldContainer.classList.toggle('fade-out');
      return new Promise(resolve => {
        window.setTimeout(function() {
          resolve();
        }, transitionTime);
      });
    },
    fadeIn: function() {
      renderMap();
      console.log('Render');
      this.newContainer.classList.toggle('fade-in');
      this.done();
    }
  });

  Barba.Pjax.getTransition = () => FadeTransition;
  Barba.Pjax.start();
}
