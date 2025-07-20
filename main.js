// DOM Elements
const title = document.querySelector('#title');
const price = document.querySelector('#price');
const taxes = document.querySelector('#taxes');
const ads = document.querySelector('#ads');
const discount = document.querySelector('#discount');
const total = document.querySelector('#total');
const count = document.querySelector('#count');
const category = document.querySelector('#category');
const createBtn = document.querySelector('#summit');
const deleteAllBtn = document.querySelector('#deleteAll');
const search = document.querySelector('#search');
const searchTitleBtn = document.querySelector('#searchTitle');
const searchCategoryBtn = document.querySelector('#searchCategory');
const themeBtn = document.querySelector('#toggleTheme');
const tbody = document.querySelector('#productsTable tbody');

let mode = 'create', tmpIndex, products = JSON.parse(localStorage.getItem('products')) || [];

function calculateTotal() {
  if (price.value) {
    const result = (+price.value + +taxes.value + +ads.value) - +discount.value;
    total.textContent = result || 0;
  } else {
    total.textContent = 0;
  }
}

[price, taxes, ads, discount].forEach(input => input.oninput = calculateTotal);

createBtn.onclick = () => {
  for(let i = 0; i<count.value;i++)
   {
      const product = {
    title: title.value.trim(),
    price: price.value.trim(),
    taxes: taxes.value.trim(),
    ads: ads.value.trim(),
    discount: discount.value.trim(),
    count: count.value.trim(),
    category: category.value.trim()
  };

  if (product.title && product.price && product.category) {
    if (mode === 'create') {
      const num = +product.count || 1;
      for (let i = 0; i < num; i++) products.push(product);
    } else {
      products[tmpIndex] = product;
      mode = 'create';
      createBtn.innerHTML = '<i class="fas fa-plus"></i> Create';
    }
    localStorage.setItem('products', JSON.stringify(products));
    render();
    clear();
  } else {
    alert('Please fill in all required fields!');
  }
   }
};

function clear() {
  [title, price, taxes, ads, discount, count, category].forEach(i => i.value = '');
  total.textContent = 0;
  title.focus();
}

function render() {
  tbody.innerHTML = '';
  products.forEach((p, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${p.title}</td>
        <td>${p.price}</td>
        <td>${p.taxes}</td>
        <td>${p.ads}</td>
        <td>${p.discount}</td>
        <td>${p.category}</td>
        <td>
          <button class="action-btn edit" onclick="editProduct(${i})"><i class="fas fa-edit"></i></button>
          <button class="action-btn delete" onclick="deleteProduct(${i})"><i class="fas fa-trash"></i></button>
        </td>
      </tr>`;
  });
  deleteAllBtn.style.display = products.length ? 'block' : 'none';
  deleteAllBtn.innerHTML = `<i class="fas fa-trash-alt"></i> Delete All (${products.length})`;
}
render();

function deleteProduct(index) {
  products.splice(index, 1);
  localStorage.setItem('products', JSON.stringify(products));
  render();
}

function editProduct(index) {
  const p = products[index];
  [title.value, price.value, taxes.value, ads.value, discount.value, count.value, category.value] =
    [p.title, p.price, p.taxes, p.ads, p.discount, p.count, p.category];
  calculateTotal();
  mode = 'update';
  tmpIndex = index;
  createBtn.innerHTML = '<i class="fas fa-save"></i> Update';
  title.focus();
  count.style.display = 'none';
}

deleteAllBtn.onclick = () => {
  products = [];
  localStorage.removeItem('products');
  render();
};

let searchMode = 'title';
searchTitleBtn.onclick = () => { searchMode = 'title'; search.placeholder = 'Search by Title'; search.focus(); search.value = ''; };
searchCategoryBtn.onclick = () => { searchMode = 'category'; search.placeholder = 'Search by Category'; search.focus(); search.value = ''; };

search.oninput = () => {
  const val = search.value.toLowerCase();
  tbody.innerHTML = '';
  products.forEach((p, i) => {
    if ((searchMode === 'title' && p.title.toLowerCase().includes(val)) ||
        (searchMode === 'category' && p.category.toLowerCase().includes(val))) {
      tbody.innerHTML += `
        <tr>
          <td>${i + 1}</td>
          <td>${p.title}</td>
          <td>${p.price}</td>
          <td>${p.taxes}</td>
          <td>${p.ads}</td>
          <td>${p.discount}</td>
          <td>${p.category}</td>
          <td>
            <button class="action-btn edit" onclick="editProduct(${i})"><i class="fas fa-edit"></i></button>
            <button class="action-btn delete" onclick="deleteProduct(${i})"><i class="fas fa-trash"></i></button>
          </td>
        </tr>`;
    }
  });
};

// Theme Toggle
function applyTheme(theme) {
  document.body.classList.toggle('light-mode', theme === 'light');
  localStorage.setItem('theme', theme);
}

themeBtn.onclick = () => {
  const current = document.body.classList.contains('light-mode') ? 'dark' : 'light';
  applyTheme(current);
};

window.onload = () => {
  const saved = localStorage.getItem('theme') || 'dark';
  applyTheme(saved);
};
