
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
    // add cell
    const btnContainer = document.querySelector('div.button-container');
    document.querySelector('section#main').insertBefore(clone, btnContainer);
    g.cellNum++;
  });
  addBtnEl.click();
});
