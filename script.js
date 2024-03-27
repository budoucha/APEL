
document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.querySelector('button');
  console.log(addBtn);
  addBtn.addEventListener('click', () => {
    console.log('add');
    const templateContent = document.querySelector('template#cell-template').content;
    const clone = document.importNode(templateContent, true);
    const btnContainer = document.querySelector('div');
    document.querySelector('section#main').insertBefore(clone, btnContainer);
  });
});
