export default async function showConfirm(message, callbacks = []) {
  /* callback: {name:"",function:(),[label=""]} */

  // set paths
  const moduleUrl = new URL(import.meta.url);
  const basePath = new URL('.', moduleUrl).href;
  const htmlPath = new URL('./showConfirm.html', basePath).href;
  const cssPath = new URL('./showConfirm.css', basePath).href;

  // load html
  const htmlResponse = await fetch(htmlPath);
  const htmlText = await htmlResponse.text();
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlText;
  const templateContent = tempDiv.querySelector('template#alert-template').content;
  const clone = templateContent.cloneNode(true);

  // load css
  const cssResponse = await fetch(cssPath);
  const cssText = await cssResponse.text();
  const style = document.createElement('style');
  style.textContent = cssText;
  document.head.appendChild(style);

  const alertEl = clone.querySelector('div.alert-container');

  // fill message
  const messageEl = alertEl.querySelector('div.message');
  messageEl.textContent = message ?? 'Alert';

  // button functions
  //// ok button
  const okBtnEl = alertEl.querySelector('button.ok');

  let okCallback = callbacks.find(c => c.name === "ok");
  if (!okCallback) { // default
    okBtnEl.addEventListener('click', () => {
      alertEl.remove();
    });
  } else if (okCallback.function === null) {
    // don't show ok button if ok is overriden by null
    okBtnEl.remove();
  } else {
    okBtnEl.textContent = okCallback.label ?? 'OK';
    okBtnEl.addEventListener('click', () => {
      okCallback.function();
      alertEl.remove();
    });
  }

  //// other buttons
  const otherCallbacks = callbacks.filter(c => c.name !== "ok");
  otherCallbacks.forEach(callback => {
    const buttonEl = document.createElement('button');
    buttonEl.textContent = callback.label ?? callback.name;
    buttonEl.addEventListener('click', () => {
      callback.function?.();
      alertEl.remove();
    });
    alertEl.querySelector('div.buttons').appendChild(buttonEl);
  });

  // if no button is created any click will close the alert
  const buttonEls = alertEl.querySelectorAll('button');
  if (buttonEls.length === 0) {
    alertEl.querySelector('div.buttons').remove();
    alertEl.addEventListener('click', () => {
      console.log('click');
      alertEl.remove();
    });
  }

  const alertContainer = document.querySelector('body');
  alertContainer.appendChild(alertEl);
}
