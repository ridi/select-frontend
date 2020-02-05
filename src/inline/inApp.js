function isLoginRequired() {
  return false;
}
function isExternalLink(url) {
  return new URL(url, location.href).hostname !== location.hostname;
}

document.addEventListener('DOMContentLoaded', () => {
  if (/ridibooks\/[0-9]+\.?[0-9]*/i.test(window.navigator.userAgent)) {
    if (/iphone|ipad|ipod/i.test(window.navigator.userAgent)) {
      document.body.classList.add('iosApp');
    } else {
      document.body.classList.add('androidApp');
    }
  }
});
