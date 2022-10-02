const bookshelf = [];
const RENDER_EVENT = 'render-book';
document.addEventListener('DOMContentLoaded', function() {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addBook();
    })
    if (isStorageExist()) {
        loadDataFromStorage();
    }
})

function addBook() {
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;
    const isCompleted = document.getElementById('inputBookIsComplete').checked;
    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, isCompleted);
    bookshelf.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    savedData();
}

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id, 
        title, 
        author, 
        year, 
        isCompleted}
}

document.addEventListener(RENDER_EVENT, function() {
    const inCompletedBookshelfList = document.getElementById('incompleteBookshelfList');
    inCompletedBookshelfList.innerHTML = '';

    const completeBookshelfList = document.getElementById('completeBookshelfList');
    completeBookshelfList.innerHTML = '';

    for (const bookItem of bookshelf) {
        const bookList = makeListBook(bookItem);
        if(!bookItem.isCompleted){
            inCompletedBookshelfList.append(bookList);
        } else {
            completeBookshelfList.append(bookList);
        }
    }
});

function makeListBook(bookObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = "Penulis: " + bookObject.author;

    const textYear = document.createElement('p');
    textYear.innerText = "Tahun: "+bookObject.year;

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('action');

    const container = document.createElement('article');
    container.append(
        textTitle, 
        textAuthor, 
        textYear, 
        buttonContainer);
    container.classList.add('book_item');
    container.setAttribute('id', 'book-${bookObject,id}');

    if (bookObject.isCompleted) {
        const markButton = document.createElement('button');
        markButton.classList.add('green');
        markButton.innerText = 'Belum selesai dibaca';

        const removeButton = document.createElement('button');
        removeButton.classList.add('red');
        removeButton.innerText = "Hapus Buku";

        markButton.addEventListener('click', function() {
            addBookListToInComplete(bookObject.id);
        })

        removeButton.addEventListener('click', function() {
            const conf = confirm("Apakah kamu yakin ingin menghapus buku?");
            if (conf == true) {
                removeBookFromList(bookObject.id);
            }
        })

        buttonContainer.append(markButton, removeButton);
    } else {
        const markButton = document.createElement('button');
        markButton.classList.add('green');
        markButton.innerText = 'Selesai dibaca';

        const removeButton = document.createElement('button');
        removeButton.classList.add('red');
        removeButton.innerText = "Hapus Buku";

        markButton.addEventListener('click', function() {
            addBookListToComplete(bookObject.id);
        })

        removeButton.addEventListener('click', function() {
            const conf = confirm("Apakah kamu yakin ingin menghapus buku?");
            if (conf == true) {
                removeBookFromList(bookObject.id);
            }
        })

       buttonContainer.append(markButton,removeButton);
    }
        return container;
}

function addBookListToComplete(bookId){
    const bookTarget = findListBook(bookId);

    if (bookTarget == null) return;
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    savedData()
}

function addBookListToInComplete(bookId) {
    const bookTarget = findListBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    savedData();
}

function findListBook(bookId) {
    for (const bookItem of bookshelf) {
        if(bookItem.id === bookId){
            return bookItem;
        }
    }
    return null;
}

function findListBookIndex(bookId) {
    for (const index in bookshelf) {
        if (bookshelf[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function removeBookFromList(bookId) {
    const bookTarget = findListBookIndex(bookId);

    if (bookTarget === -1) return;

    bookshelf.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    savedData();
}

document
.getElementById("searchBook")
.addEventListener("submit", function (event) {
    event.preventDefault();
    const searchBook = document
      .getElementById("searchBookTitle")
      .value.toLowerCase();
    const bookList = document.querySelectorAll("article h3");
    for (const book of bookList) {
      if (book.innerText.toLowerCase().includes(searchBook)) {
        book.parentElement.style.display = "block";
      } else {
        book.parentElement.style.display = "none";
      }
    }
});

const SAVED_EVENT = 'saved_book';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function savedData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(bookshelf);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const book of data) {
        bookshelf.push(book);
      }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}