
document.addEventListener('DOMContentLoaded', () => {
  const addBtnEl = document.querySelector('button');
  addBtnEl.addEventListener('click', () => {
    const templateContent = document.querySelector('template#cell-template').content;
    const clone = document.importNode(templateContent, true);
    const btnContainer = document.querySelector('div.button-container');
    document.querySelector('section#main').insertBefore(clone, btnContainer);
  });
  addBtnEl.click();
});
