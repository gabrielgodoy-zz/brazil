import * as Barba from 'barba.js';

export default function setupBarba(callback = undefined) {
  let transitionTime = 500;
  let FadeTransition = Barba.BaseTransition.extend({
    // Call start when transition begins
    start: function() {
      // newContainerLoading	=> Promise that indicates the next container loading
      Promise.all([this.newContainerLoading, this.fadeOutOldContainer()])
             .then(this.fadeInNewContainer.bind(this));
    },
    fadeOutOldContainer: function() {
      this.oldContainer.classList.toggle('fade-out');
      return new Promise(resolve => window.setTimeout(() => resolve(), transitionTime));
    },
    fadeInNewContainer: function() {
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
    const link = currentStatus.url.split(window.location.origin)[1].substring(1);
    const body = document.querySelector('body');
    const navigation = document.querySelector('.main-menu');
    const navigationLinks = navigation.querySelectorAll('.main-menu-list-item a');
    body.className = '';
    document.querySelector('.sidebar-right-side').innerHTML = '';
    if (link.length) {
      const navigationLinkIsActive = navigation.querySelector(`[href="${link}"]`);
      const pageName = link.replace('.html', '');
      body.classList.add(`page-${pageName}`);
      navigationLinks.forEach(navigationLink => navigationLink.classList.remove('is-active'));
      navigationLinkIsActive.classList.add('is-active');
    } else {
      body.classList.add('page-index');
      navigationLinks[0].classList.add('is-active');
    }
  });
  Barba.Pjax.start();
}
