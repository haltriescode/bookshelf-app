document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const bookForm = document.getElementById("bookForm");
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");
  const searchBook = document.getElementById("searchBook");
  const searchInput = document.getElementById("searchBookTitle");

  // Data Storage
  let books = JSON.parse(localStorage.getItem("books")) || [];

  // Core Functions
  const saveBooks = () => {
    localStorage.setItem("books", JSON.stringify(books));
  };

  const addBook = (book) => {
    books.push(book);
    saveBooks();
    renderBooks();
  };

  const deleteBook = (bookId) => {
    books = books.filter((book) => book.id !== bookId);
    saveBooks();
    renderBooks();
  };

  const toggleStatus = (bookId) => {
    const book = books.find((book) => book.id === bookId);
    if (book) {
      book.isComplete = !book.isComplete;
      saveBooks();
      renderBooks();
    }
  };

  const editBook = (bookId) => {
    const book = books.find((book) => book.id === bookId);

    if (book) {
      // Fill form with book data
      document.getElementById("bookFormTitle").value = book.title;
      document.getElementById("bookFormAuthor").value = book.author;
      document.getElementById("bookFormYear").value = book.year;
      document.getElementById("bookFormIsComplete").checked = book.isComplete;

      // Remove old book
      books = books.filter((b) => b.id !== bookId);

      // Save and render
      saveBooks();
      renderBooks();

      // Scroll to form
      document
        .getElementById("bookForm")
        .scrollIntoView({ behavior: "smooth" });
    }
  };

  // Render Function
  const renderBooks = (filter = "") => {
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    books
      .filter((book) => book.title.toLowerCase().includes(filter.toLowerCase()))
      .forEach((book) => {
        const bookElement = document.createElement("div");
        bookElement.setAttribute("data-bookid", book.id);
        bookElement.setAttribute("data-testid", "bookItem");
        bookElement.innerHTML = `
                <h3 data-testid="bookItemTitle">${book.title}</h3>
                <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
                <p data-testid="bookItemYear">Tahun: ${book.year}</p>
                <div>
                    <button data-testid="bookItemIsCompleteButton">
                        ${book.isComplete ? "Belum selesai" : "Selesai"} dibaca
                    </button>
                    <button data-testid="bookItemDeleteButton">Hapus Buku</button>
                    <button data-testid="bookItemEditButton">Edit Buku</button>
                </div>
            `;

        // Add event listeners to buttons
        bookElement
          .querySelector("[data-testid='bookItemIsCompleteButton']")
          .addEventListener("click", () => toggleStatus(book.id));

        bookElement
          .querySelector("[data-testid='bookItemDeleteButton']")
          .addEventListener("click", () => deleteBook(book.id));

        bookElement
          .querySelector("[data-testid='bookItemEditButton']")
          .addEventListener("click", () => editBook(book.id));

        if (book.isComplete) {
          completeBookList.appendChild(bookElement);
        } else {
          incompleteBookList.appendChild(bookElement);
        }
      });
  };

  // Event Listeners
  bookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newBook = {
      id: Date.now(),
      title: document.getElementById("bookFormTitle").value,
      author: document.getElementById("bookFormAuthor").value,
      year: parseInt(document.getElementById("bookFormYear").value),
      isComplete: document.getElementById("bookFormIsComplete").checked,
    };
    addBook(newBook);
    bookForm.reset();
  });

  searchBook.addEventListener("submit", (e) => {
    e.preventDefault();
    renderBooks(searchInput.value);
  });

  // Initial render
  renderBooks();
});
