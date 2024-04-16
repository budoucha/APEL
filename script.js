import showConfirm from './showConfirm/showConfirm.js';

document.addEventListener('DOMContentLoaded', () => {
  const g = {
    // global variables
  };

  const remapCellElIndex = () => {
    const cells = document.querySelectorAll('div.cell.card-cell');
    cells.forEach((cell, index) => {
      cell.id = `cell-${index + 1}`;
      const headerEl = cell.querySelector('input.header p');
    });
  }

  // add-cell button
  const addBtnEl = document.querySelector('button.add-cell');
  addBtnEl.addEventListener('click', () => {
    const templateContent = document.querySelector('template#cell-template').content;
    const clone = document.importNode(templateContent, true);
    const cellIndex = document.querySelectorAll('div.cell.card-cell').length + 1;
    clone.querySelector("div.cell").id = `cell-${cellIndex}`;

    // header click-to-edit
    const headerEl = clone.querySelector('.cell .header p');
    headerEl.addEventListener('click', () => {
      const inputEl = document.createElement('input');
      inputEl.value = headerEl.textContent;
      headerEl.replaceWith(inputEl);
      inputEl.focus();
      inputEl.select();
      inputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          headerEl.innerText = inputEl.value;
          inputEl.replaceWith(headerEl);
        }
      });
      inputEl.addEventListener('blur', (e) => {
        headerEl.innerText = inputEl.value;
        inputEl.replaceWith(headerEl);
      });
    });
    headerEl.textContent = `${cellIndex}`;

    // content click-to-edit
    const contentEl = clone.querySelector('.content');
    contentEl.addEventListener('click', () => {
      const inputEl = document.createElement('textarea');
      inputEl.value = contentEl.textContent;
      contentEl.replaceWith(inputEl);
      inputEl.focus();
      inputEl.select();
      inputEl.addEventListener('blur', (e) => {
        contentEl.innerText = inputEl.value;
        inputEl.replaceWith(contentEl);
      });
    });

    //delete-cell-button
    const deleteBtnEl = clone.querySelector('button.delete-cell');
    deleteBtnEl.addEventListener('click', () => {
      const cellEl = deleteBtnEl.closest('div.cell');
      cellEl.remove();
      remapCellElIndex();
    });

    // move cell before button
    const moveBeforeBtnEl = clone.querySelector('button.move-cell.before');
    moveBeforeBtnEl.addEventListener('click', () => {
      const cellEl = moveBeforeBtnEl.closest('div.cell');
      const previousCellEl = cellEl.previousElementSibling;
      if (previousCellEl) {
        cellEl.parentNode.insertBefore(cellEl, previousCellEl);
        remapCellElIndex();
      }
    });
    // move cell after button
    const moveAfterBtnEl = clone.querySelector('button.move-cell.after');
    moveAfterBtnEl.addEventListener('click', () => {
      const cellEl = moveAfterBtnEl.closest('div.cell');
      const nextCellEl = cellEl.nextElementSibling;
      if (nextCellEl) {
        cellEl.parentNode.insertBefore(cellEl, nextCellEl.nextElementSibling);
        remapCellElIndex();
      }
    });

    // add cell
    const btnContainer = document.querySelector('div.button-container');
    document.querySelector('section#main').insertBefore(clone, btnContainer);
    remapCellElIndex();
  });
  addBtnEl.click();

  // clear button
  const clearBtnEl = document.querySelector('button.clear');
  clearBtnEl.addEventListener('click', () => {
    const cells = document.querySelectorAll('section#main div.cell:not(.meta-cell)');
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
