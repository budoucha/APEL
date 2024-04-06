
document.addEventListener('DOMContentLoaded', () => {
  
  // add-cell button
  const addBtnEl = document.querySelector('button.add-cell');
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
