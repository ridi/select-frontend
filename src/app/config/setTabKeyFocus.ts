const focusFreeClass = 'focus-free';

function addFocusOnTabKeyup(element: HTMLElement) {
  window.addEventListener('keyup', event => {
    const code = event.keyCode || event.which;
    if (Number(code) === 9) {
      element.classList.remove(focusFreeClass);
    }
  });
}

function removeFocusOnMouseDown(element: HTMLElement) {
  window.addEventListener('mousedown', event => {
    element.classList.add(focusFreeClass);
  });
}

export default function setTabKeyFocus() {
  window.addEventListener('DOMContentLoaded', () => {
    const body = document.querySelector('body');
    if (!body) {
      return;
    }
    body.classList.add(focusFreeClass);
    addFocusOnTabKeyup(body);
    removeFocusOnMouseDown(body);
  });
}
