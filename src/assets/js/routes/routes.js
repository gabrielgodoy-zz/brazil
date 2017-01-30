/**
 * @param {Object} currentStatus Object with the url of the page
 */
export function setupNewPage(currentStatus) {
  const page = currentStatus.url.split(window.location.origin)[1].substring(1);
  setMenuActive(page)
}

/**
 * @param {String} page Current page
 */
function setMenuActive(page) {
  const navigation = document.querySelector('.main-menu');
  const navigationLinks = navigation.querySelectorAll('.main-menu-list-item a');
  if (page.length) {
    const navigationLinkIsActive = navigation.querySelector(`[href="${page}"]`);
    navigationLinks.forEach(navigationLink => navigationLink.classList.remove('is-active'));
    navigationLinkIsActive.classList.add('is-active');
  } else {
    navigationLinks[0].classList.add('is-active');
  }
}

export function changeBodyClass(currentStatus) {
  const page = currentStatus.url.split(window.location.origin)[1].substring(1);
  const body = document.querySelector('body');
  if (page.length) {
    const pageName = page.replace('.html', '');
    body.classList.add(`page-${pageName}`);
  } else {
    body.classList.add('page-index');
  }
  resetOnPageChange(page);
}

function resetOnPageChange(page) {
  document.querySelector('body').className = '';
  let rightSideBar = document.querySelector('.sidebar-right-side');
  let isHomePage = page.length && page === 'index.html' || !page.length;
  rightSideBar.innerHTML = isHomePage ? '<div class="state-details"></div>' : '';
}
