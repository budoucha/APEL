
document.addEventListener('DOMContentLoaded', () => {
  let buttonNum = 0;
  const addBtnEl = document.querySelector('button');
  addBtnEl.addEventListener('click', () => {
    const templateContent = document.querySelector('template#cell-template').content;
    const clone = document.importNode(templateContent, true);
    clone.querySelector("div.cell").id = `cell-${buttonNum}`;
    const btnContainer = document.querySelector('div.button-container');
    document.querySelector('section#main').insertBefore(clone, btnContainer);
    buttonNum++;
  });
  addBtnEl.click();
});
