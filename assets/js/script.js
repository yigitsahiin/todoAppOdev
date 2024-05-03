// Local Storage'dan todoList verisini al, eğer veri yoksa varsayılan bir obje oluştur
const data = localStorage.getItem('todoList') ? JSON.parse(localStorage.getItem('todoList')) : {
    todo: [],
    completed: []
};

// Silme ve tamamlama işlemleri için SVG simgeleri bunu genelde burda kullanıyom alışkanlık
const removeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect class="noFill" width="22" height="22"/><g><g><path class="fill" d="M16.1,3.6h-1.9V3.3c0-1.3-1-2.3-2.3-2.3h-1.7C8.9,1,7.8,2,7.8,3.3v0.2H5.9c-1.3,0-2.3,1-2.3,2.3v1.3c0,0.5,0.4,0.9,0.9,1v10.5c0,1.3,1,2.3,2.3,2.3h8.5c1.3,0,2.3-1,2.3-2.3V8.2c0.5-0.1,0.9-0.5,0.9-1V5.9C18.4,4.6,17.4,3.6,16.1,3.6z M9.1,3.3c0-0.6,0.5-1.1,1.1-1.1h1.7c0.6,0,1.1,0.5,1.1,1.1v0.2H9.1V3.3z M16.3,18.7c0,0.6-0.5,1.1-1.1,1.1H6.7c-0.6,0-1.1-0.5-1.1-1.1V8.2h10.6V18.7z M17.2,7H4.8V5.9c0-0.6,0.5-1.1,1.1-1.1h10.2c0.6,0,1.1,0.5,1.1,1.1V7z"/></g><g><g><path class="fill" d="M11,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6s0.6,0.3,0.6,0.6v6.8C11.6,17.7,11.4,18,11,18z"/></g><g><path class="fill" d="M8,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C8.7,17.7,8.4,18,8,18z"/></g><g><path class="fill" d="M14,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C14.6,17.7,14.3,18,14,18z"/></g></g></g></svg>';
const completeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect y="0" class="noFill" width="22" height="22"/><g><path class="fill" d="M9.7,14.4L9.7,14.4c-0.2,0-0.4-0.1-0.5-0.2l-2.7-2.7c-0.3-0.3-0.3-0.8,0-1.1s0.8-0.3,1.1,0l2.1,2.1l4.8-4.8c0.3-0.3,0.8-0.3,1.1,0s0.3,0.8,0,1.1l-5.3,5.3C10.1,14.3,9.9,14.4,9.7,14.4z"/></g></svg>';

// Sayfayı ilk açtığında ve herhangi bir ekleme/çıkarma işlemi yapıldığında todo listesini render et renderrrlaaa
renderTodoList();

// Ekle butonuna tıklanınca veya Enter tuşuna basılınca yeni bir öğe ekleyen fonksiyon
document.querySelector('#add').addEventListener('click', function () {
    const value = document.querySelector('#item').value;
    if (value) {
        addItem(value);
    }
});

// Enter tuşuna basıldığında yeni bir öğe ekleyen fonksiyon
document.querySelector('#item').addEventListener('keydown', function (e) {
    const value = this.value;
    if ((e.code === 'Enter' || e.code === 'NumpadEnter') && value) {
        addItem(value);
    }
});

// Yeni bir öğe ekleyen fonksiyon
function addItem(value) {
    addItemToDOM(value);
    document.querySelector('#item').value = '';
    data.todo.push(value); // Yeni öğeyi veriye ekle
    dataObjectUpdated(); // Veriyi güncelle
}

// Todo listesini render eden fonksiyon
function renderTodoList() {
    if (data.todo.length || data.completed.length) {
        data.todo.forEach(value => addItemToDOM(value));
        data.completed.forEach(value => addItemToDOM(value, true));
    }
}

// Veri güncellendiğinde local storage'a kaydeden fonksiyon
function dataObjectUpdated() {
    localStorage.setItem('todoList', JSON.stringify(data));
}

// Bir öğeyi silen fonksiyon
function removeItem() {
    const item = this.parentNode.parentNode;
    const parent = item.parentNode;
    const id = parent.id;
    const value = item.innerText;
    const listToUpdate = id === 'todo' ? data.todo : data.completed;

    listToUpdate.splice(listToUpdate.indexOf(value), 1);
    dataObjectUpdated();

    parent.removeChild(item); // Öğeyi DOM'dan kaldır
}

// Bir öğeyi tamamlayan fonksiyon
function completeItem() {
    const item = this.parentNode.parentNode;
    const parent = item.parentNode;
    const id = parent.id;
    const value = item.innerText;
    const listToUpdate = id === 'todo' ? data.todo : data.completed;
    const index = listToUpdate.indexOf(value);

    if (index > -1) {
        listToUpdate.splice(index, 1);
        dataObjectUpdated();

        const target = id === 'todo' ? document.querySelector('#completed') : document.querySelector('#todo');

        parent.removeChild(item); // Öğeyi DOM'dan kaldır
        target.insertBefore(item, target.firstChild); // Öğeyi hedef listeye ekle
    }
}

// DOM'a yeni bir öğe ekleyen fonksiyon
function addItemToDOM(text, completed) {
    const list = completed ? document.querySelector('#completed') : document.querySelector('#todo');

    const itemHTML = `
      <li>
        ${text}
        <div class="buttons">
          <button class="remove">${removeSVG}</button>
          <button class="complete">${completeSVG}</button>
        </div>
      </li>
    `;

    list.innerHTML += itemHTML; // Yeni öğeyi DOM'a ekle
}

// Herhangi bir yere tıklandığında işlem yapılmasını sağlayan genel event listener
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('remove')) {
        removeItem.call(event.target);
    }

    if (event.target.classList.contains('complete')) {
        completeItem.call(event.target);
    }
});
