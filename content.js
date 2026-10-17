// content.js (sin la primera línea de prueba)
chrome.storage.sync.get({ activo: true }, ({ activo }) => {
  document.documentElement.classList.toggle("solo-gratis", activo);
});
chrome.storage.onChanged.addListener((cambios) => {
  if (cambios.activo) {
    document.documentElement.classList.toggle("solo-gratis", cambios.activo.newValue);
  }
});

const SEL = 'article[data-testid="post-preview"]';

function wrapper(art) {
  let el = art;
  for (let i = 0; i < 4; i++) {
    const parent = el.parentElement;
    if (!parent || parent.querySelectorAll(SEL).length > 1) break;
    el = parent;
  }
  return el;
}

function inspect() {
  document.querySelectorAll(SEL + ":not([data-msg-pago])").forEach((a) => {
    if (a.querySelector('button[aria-label*="Member-only" i]')) {
      a.dataset.msgPago = "1";
      wrapper(a).setAttribute("data-msg-oculta", "");
    }
  });
}

let espera;
new MutationObserver(() => {
  clearTimeout(espera);
  espera = setTimeout(inspect, 120);
}).observe(document.documentElement, { childList: true, subtree: true });