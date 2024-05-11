import showConfirm from './showConfirm/showConfirm.js';

document.addEventListener('DOMContentLoaded', () => {
  const g = {
    // global variables
    dataSlots: [],
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

  clickToEdit(document.querySelector('.page-title h1'));

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
    const headerEl = clone.querySelector('.cell p.cell-title');
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

    // grab
    const grabEl = clone.querySelector('.grab-cell');
    const grabMarker = document.querySelector('#grab-marker');
    grabEl.addEventListener('dragstart', (e) => {
      const magicField = document.createElement('div')
      magicField.id = ('magic-field');
      document.body.appendChild(magicField);

      g.draggedEl = grabEl.closest('div.cell');
      g.draggedEl.classList.add('dragging');
      grabMarker.classList.remove('hidden');
      g.draggedEl.parentNode.insertBefore(grabMarker, g.draggedEl.nextSibling);

      g.draggedEl.addEventListener('dragend', (e) => {
        g.draggedEl.classList.remove('dragging');
        grabMarker.classList.add("hidden");
        magicField.style.display = 'none';
        magicField.remove();
      });

      document.addEventListener('drop', (e) => {
        e.preventDefault();
        g.draggedEl.parentNode.insertBefore(g.draggedEl, grabMarker);
      });

      magicField.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        const cells = document.querySelectorAll('.cell:not(#add-cell-button)');
        let closestCell = null;
        let minDistance = Infinity;
        cells.forEach(cell => {
          const box = cell.getBoundingClientRect();
          const offsetX = e.clientX - box.left;
          const dx = offsetX - box.width / 2;
          const offsetY = e.clientY - box.top;
          const dy = offsetY - box.height / 2;
          const distance = Math.sqrt(dx ** 2 + dy ** 2);
          if (distance < minDistance) {
            closestCell = cell;
            minDistance = distance;
          }
        });

        if (closestCell) {
          const offset = e.clientX - closestCell.getBoundingClientRect().left;
          const after = offset > closestCell.clientWidth / 2;
          const marker = document.querySelector('.grab-marker');
          after ? closestCell.after(marker) : closestCell.before(marker);
        }
      });
    });

    // drop to content
    contentEl.addEventListener('dragover', (e) => {
      if (e.dataTransfer.types.includes('Files')
        || e.dataTransfer.types.includes('text/plain')) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
    contentEl.addEventListener('drop', (e) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files.length === 0) {
        if (e.dataTransfer.types.includes('text/plain')) {
          const text = e.dataTransfer.getData('text/plain');
          contentEl.textContent = text;
          return;
        }
      };
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = document.createElement('img');
          img.classList.add('content', 'content-image');
          img.src = e.target.result;
          contentEl.replaceWith(img);
        };
        reader.readAsDataURL(file);
      }
    });


    // random color
    contentEl.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 95%)`;

    // apply cellInfo
    headerEl.textContent = cellInfo.header || headerEl.textContent;
    contentEl.textContent = cellInfo.content || contentEl.textContent;
    if (cellInfo.isImage || cellInfo.type === 'image') { //頃合いを見てisImageの方は削除
      const img = document.createElement('img');
      img.classList.add('content', 'content-image');
      img.src = cellInfo.content;
      contentEl.replaceWith(img);
    }
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

  /* menu buttons */
  const colorShuffleBtnEl = document.querySelector('button.color-shuffle');
  colorShuffleBtnEl.addEventListener('click', () => {
    const cells = document.querySelectorAll('section#main div.cell.card-cell');
    cells.forEach(cell => {
      const contentEl = cell.querySelector('.content');
      contentEl.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 95%)`;
    });
  });

  const cardShuffleBtnEl = document.querySelector('button.card-shuffle');
  cardShuffleBtnEl.addEventListener('click', () => {
    const cells = document.querySelectorAll('section#main div.cell.card-cell');
    const shuffledCells = Array.from(cells).sort(() => Math.random() - 0.5);
    const btnContainer = document.querySelector('#add-cell-button');
    shuffledCells.forEach(cell => {
      document.querySelector('section#main').insertBefore(cell, btnContainer);
    });
    remapCellElIndex();
  });

  // save button
  const saveBtnEl = document.querySelector('button.save');
  const makeSlot = () => {
    const cells = document.querySelectorAll('section#main div.cell.card-cell:not(.meta-cell)');
    const data = {
      pageTitle: document.querySelector('.page-title h1').textContent,
      cells: [],
    };
    cells.forEach(cell => {
      const cellInfo = {};
      const headerEl = cell.querySelector('p.cell-title');
      cellInfo.header = headerEl?.textContent;
      const contentEl = cell.querySelector('.content');
      if (contentEl.classList.contains('content-image')) {
        cellInfo.content = contentEl?.src;
        cellInfo.type = 'image';
      } else {
        cellInfo.content = contentEl?.innerHTML.replace(/<br\s*\/?>/gi, '\n');
      }
      cellInfo.color = contentEl?.style.backgroundColor;
      data.cells.push(cellInfo);
    });
    return data;
  }
  // save cells to local storage
  saveBtnEl.addEventListener('click', () => {
    showConfirm('overwrite saved data?', [
      {
        name: "ok", function: () => {
          g.dataSlot = makeSlot();
          localStorage.setItem('dataSlot', JSON.stringify(g.dataSlot));
        }
      },
      {
        name: "No (only export to file)", function: () => {
          const slotData = makeSlot();
          const blob = new Blob([JSON.stringify(slotData)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'data.json';
          a.click();
          URL.revokeObjectURL(url);
        }
      },
      { name: "cancel", function: null },
    ]);
  });

  // load button
  const loadBtnEl = document.querySelector('button.load');
  // load cells from local storage
  const loadData = (dataSlot) => {
    // remove all card-cells
    const cells = document.querySelectorAll('section#main div.cell.card-cell');
    cells.forEach(cell => {
      cell.remove();
    });
    const pageTitleEl = document.querySelector('.page-title h1');
    pageTitleEl.textContent = dataSlot?.pageTitle ? dataSlot.pageTitle : "New Tempelit";
    dataSlot?.cells.forEach(cellInfo => {
      createCell(cellInfo);
    });
  };
  loadBtnEl.addEventListener('click', () => {
    showConfirm('overwrite current cells?', [
      {
        name: "ok", function: () => {
          const slots = JSON.parse(localStorage.getItem('dataSlots'));
          if (slots?.[0]?.cells) {
            console.log('loaded from slots');
            const loadedSlot = slots[0];
            loadData(loadedSlot);
          }
          else {
            const loadedSlot = JSON.parse(localStorage.getItem('dataSlot'));
            loadData(loadedSlot);
          }
        }
      },
      {
        name: "Ok (Import from file)", function: () => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'application/json';
          input.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            const text = await file.text();
            const data = JSON.parse(text);
            loadData(data);
          });
          input.click();
        }
      },
      { name: "cancel", function: null },
    ]);
  });
  // auto load
  const slots = JSON.parse(localStorage.getItem('dataSlots'));
  const slot = JSON.parse(localStorage.getItem('dataSlot'));
  const savedSlot = slots?.[0]?.cells ? slots[0] : slot;
  savedSlot ? loadData(savedSlot) : null;

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
          const addBtnEl = document.querySelector('#add-cell-button button.add-cell');
          addBtnEl.click();
          document.querySelector('.page-title h1').textContent = "New Tempelit";
        }
      },
      { name: "cancel", function: null },
    ];
    showConfirm('clear all cells and title?', callbacks);
  });

  // hover-to-show mode
  const hideModeEl = document.querySelector('#hover-to-show-mode input');
  hideModeEl.addEventListener('change', () => {
    const mainSection = document.querySelector('section#main');
    mainSection.classList.toggle('hover-to-show');
  });
});
