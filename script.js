import showConfirm from './showConfirm/showConfirm.js';

document.addEventListener('DOMContentLoaded', () => {
  const g = {
    // global variables
    dataSlot: {
      pageTitle: "",
      cells: [],
    }
  };

  const clickToEdit = (el, options = {}) => {
    if (!(el instanceof HTMLElement)) return;
    el.addEventListener('click', () => {
      const elType = options?.textArea ? 'textarea' : 'input';
      const inputEl = document.createElement(elType);
      el.classList.forEach(className => inputEl.classList.add(className));
      inputEl.value = el.innerHTML.replace(/<br\s*\/?>/gi, '\n');
      el.replaceWith(inputEl);
      inputEl.focus();
      inputEl.select();
      const handleKey = (e) => {
        if (e.key === 'Enter' && e.shiftKey) {
          const start = inputEl.selectionStart;
          const end = inputEl.selectionEnd;
          let value = inputEl.value.substring(0, start);
          value += '\n' + inputEl.value.substring(end);
        }
        else if (e.key === 'Enter') {
          completeEdit(e);
        }
      }
      const completeEdit = (e) => {
        el.innerText = inputEl.value;
        setTimeout(() => {
          inputEl.replaceWith(el);
        }, 0);
      }
      inputEl.addEventListener('keypress', handleKey);
      inputEl.addEventListener('blur', completeEdit);
    });
  };

  clickToEdit(document.querySelector('h1.page-title'));

  const remapCellElIndex = () => {
    const cells = document.querySelectorAll('div.cell.card-cell');
    cells.forEach((cell, index) => {
      cell.id = `cell-${index + 1}`;
      const headerEl = cell.querySelector('input.header p');
    });
  }

  const createCell = (cellInfo = {}) => {
    const templateContent = document.querySelector('template#cell-template').content;
    const clone = document.importNode(templateContent, true);
    const cellIndex = document.querySelectorAll('div.cell.card-cell').length + 1;
    clone.querySelector("div.cell").id = `cell-${cellIndex}`;

    // cell header
    const headerEl = clone.querySelector('.cell .header p');
    clickToEdit(headerEl);
    headerEl.textContent = `${cellIndex}`;

    // content click-to-edit
    const contentEl = clone.querySelector('.content');
    clickToEdit(contentEl, { textArea: true });

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

    // apply cellInfo
    headerEl.textContent = cellInfo.header || headerEl.textContent;
    contentEl.textContent = cellInfo.content || contentEl.textContent;
    contentEl.style.backgroundColor = cellInfo.color || contentEl.style.backgroundColor;

    // add cell
    const btnContainer = document.querySelector('#add-cell-button');
    document.querySelector('section#main').insertBefore(clone, btnContainer);
    remapCellElIndex();
  }

  // add-cell button
  const addBtnEl = document.querySelector('#add-cell-button button.add-cell');
  addBtnEl.addEventListener('click', () => {
    createCell();
  });
  // add-cell shortcut
  document.addEventListener('keydown', (e) => {
    // Ctrl + M
    if (e.ctrlKey && e.key === 'm') {
      createCell();
    }
  });
  addBtnEl.click();

  // save button
  const saveBtnEl = document.querySelector('button.save');
  // save cells to local storage
  saveBtnEl.addEventListener('click', () => {
    g.dataSlot.pageTitle = document.querySelector('h1.page-title').textContent;
    g.dataSlot.cells = [];
    const cells = document.querySelectorAll('section#main div.cell.card-cell:not(.meta-cell)');
    cells.forEach(cell => {
      const cellInfo = {};
      const headerEl = cell.querySelector('.header p');
      cellInfo.header = headerEl?.textContent;
      const contentEl = cell.querySelector('.content');
      cellInfo.content = contentEl?.innerHTML.replace(/<br\s*\/?>/gi, '\n');
      cellInfo.color = contentEl?.style.backgroundColor;
      g.dataSlot.cells.push(cellInfo);
    });
    localStorage.setItem('dataSlot', JSON.stringify(g.dataSlot));
  });

  // load button
  const loadBtnEl = document.querySelector('button.load');
  // load cells from local storage
  loadBtnEl.addEventListener('click', () => {
    showConfirm('overwrite current cells?', [
      {
        name: "ok", function: () => {
          // remove all card-cells
          const cells = document.querySelectorAll('section#main div.cell.card-cell');
          cells.forEach(cell => {
            cell.remove();
          });
          const loadedSlot = JSON.parse(localStorage.getItem('dataSlot'));
          document.querySelector('h1.page-title').textContent = loadedSlot.pageTitle;
          loadedSlot.cells.forEach(cellInfo => {
            createCell(cellInfo);
          });
        }
      },
      { name: "cancel", function: null },
    ]);
  });

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
