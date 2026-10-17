// popup.js
const t = (clave) => chrome.i18n.getMessage(clave);

document.querySelectorAll("[data-i18n]").forEach((el) => {
  el.textContent = t(el.dataset.i18n);
});

const checkbox = document.getElementById("activo");
const estado = document.getElementById("estado");

function pintar(activo) {
  checkbox.checked = activo;
  estado.textContent = t(activo ? "statusOn" : "statusOff");
}

chrome.storage.sync.get({ activo: true }, ({ activo }) => {
  pintar(activo);
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add("listo")));
});
checkbox.addEventListener("change", () => {
  chrome.storage.sync.set({ activo: checkbox.checked });
  pintar(checkbox.checked);
});
