import showConfirm from './showConfirm/showConfirm.js';

document.addEventListener('DOMContentLoaded', () => {
  const g = {
    // global variables
  };

  // add-cell button
  const addBtnEl = document.querySelector('button.add-cell');
  addBtnEl.addEventListener('click', () => {
    const templateContent = document.querySelector('template#cell-template').content;
    const clone = document.importNode(templateContent, true);
    const cellIndex = document.querySelectorAll('div.cell.card-cell').length + 1;
    clone.querySelector("div.cell").id = `cell-${cellIndex}`;

    //delete-cell-button
    const deleteBtnEl = clone.querySelector('button.delete-cell');
    deleteBtnEl.addEventListener('click', () => {
      const cellEl = deleteBtnEl.closest('div.cell');
      cellEl.remove();
      // reindex
      const cells = document.querySelectorAll('div.cell.card-cell');
      cells.forEach((cell, index) => {
        cell.id = `cell-${index + 1}`;
        const headerEl = cell.querySelector('input.header p');
      });
    });

    //update-button
    const updateBtnEl = clone.querySelector('button.update-cell');
    updateBtnEl.addEventListener('click', () => {
      const cellEl = updateBtnEl.closest('div.cell');
      const inputEl = cellEl.querySelector('input');
      const contentEl = cellEl.querySelector('.content');
      contentEl.textContent = inputEl.value;
    });

    // add cell
    const btnContainer = document.querySelector('div.button-container');
    document.querySelector('section#main').insertBefore(clone, btnContainer);
  });
  addBtnEl.click();

  // clear button
  const clearBtnEl = document.querySelector('button.clear');
  clearBtnEl.addEventListener('click', () => {
    const cells = document.querySelectorAll('div.cell:not(.meta-cell)');
    const callbacks = [
      {
        name: "ok", function: () => {
          cells.forEach(cell => {
            cell.remove();
          });
        }
      },
      { name: "cancel", function: null },
    ];
    showConfirm('clear all cells?', callbacks);
  });

  // hover-to-show mode
  const hideModeEl = document.querySelector('#hover-to-show-mode input');
  hideModeEl.addEventListener('change', () => {
    const mainSection = document.querySelector('section#main');
    mainSection.classList.toggle('hover-to-show');
  });
});
