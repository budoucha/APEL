
document.addEventListener('DOMContentLoaded', () => {
  const g = {
    // global variables
    cellNum: 0,
  };

  // add-cell button
  const addBtnEl = document.querySelector('button.add-cell');
  addBtnEl.addEventListener('click', () => {
    const currentCell = g.cellNum;
    const templateContent = document.querySelector('template#cell-template').content;
    const clone = document.importNode(templateContent, true);
    clone.querySelector("div.cell").id = `cell-${currentCell}`;

    //delete-cell-button
    const deleteBtnEl = clone.querySelector('button.delete-cell');
    deleteBtnEl.addEventListener('click', () => {
      const cellId = `div#cell-${currentCell}`;
      const cellEl = document.querySelector(cellId);
      cellEl.remove();
    });

    //update-button
    const updateBtnEl = clone.querySelector('button.update-cell');
    updateBtnEl.addEventListener('click', () => {
      const cellId = `div#cell-${currentCell}`;
      const cellEl = document.querySelector(cellId);
      const inputEl = cellEl.querySelector('input');
      const contentEl = cellEl.querySelector('div.content');
      contentEl.textContent = inputEl.value;
    });

    // add cell
    const btnContainer = document.querySelector('div.button-container');
    document.querySelector('section#main').insertBefore(clone, btnContainer);
    g.cellNum++;
  });
  addBtnEl.click();

  // hover-to-show mode
  const hideModeEl = document.querySelector('#hover-to-show-mode input');
  hideModeEl.addEventListener('change', () => {
    const mainSection = document.querySelector('section#main');
    mainSection.classList.toggle('hover-to-show');
  });
});
