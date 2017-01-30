import * as Barba from 'barba.js';
import {setupNewPage, changeBodyClass} from './routes';

export default function setupBarba(callback = undefined) {
  let FadeTransition = Barba.BaseTransition.extend({
    start() { // Call start when transition begins
      // newContainerLoading	=> Promise that indicates the next container loading
      Promise.all([this.newContainerLoading, this.fadeOutOldContainer()])
             .then(this.fadeInNewContainer.bind(this));
    },
    fadeOutOldContainer() {
      let transitionTime = 500;
      this.oldContainer.classList.toggle('fade-out');
      return new Promise(resolve => window.setTimeout(() => resolve(), transitionTime));
    },
    fadeInNewContainer() {
      // newContainer - Undefined until newContainerLoading is resolved
      this.newContainer.classList.toggle('fade-in');
      if (callback) {
        callback();
      }
      document.body.scrollTop = 0;
      this.done(); // Transition finished
    }
  });
  Barba.Pjax.getTransition = () => FadeTransition;
  Barba.Dispatcher.on('newPageReady', currentStatus => {
    setupNewPage(currentStatus);
  });
  Barba.Dispatcher.on('transitionCompleted', currentStatus => {
    changeBodyClass(currentStatus);
  });
  Barba.Pjax.start();
}
