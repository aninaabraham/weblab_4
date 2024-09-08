document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    const sortSelect = document.getElementById('sort');
    const bookList = document.getElementById('book-list');
    const errorMessage = document.getElementById('error-message');
    const paginationInfo = document.getElementById('page-info');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');

    let books = [];
    let currentPage = 1;
    const booksPerPage = 5;

    async function fetchBooks() {
        try {
            const response = await fetch('books.json'); // Replace with the actual API endpoint
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            books = await response.json();
            displayBooks();
        } catch (error) {
            errorMessage.textContent = `Failed to load books: ${error.message}`;
        }
    }

    function displayBooks() {
        const startIndex = (currentPage - 1) * booksPerPage;
        const endIndex = startIndex + booksPerPage;
        const paginatedBooks = books.slice(startIndex, endIndex);

        bookList.innerHTML = '';
        paginatedBooks.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.className = 'book';
            bookItem.innerHTML = `
                <h3>${book.title}</h3>
                <p>Author: ${book.author}</p>
                <p>Year: ${book.year}</p>
            `;
            bookList.appendChild(bookItem);
        });

        paginationInfo.textContent = `Page ${currentPage} of ${Math.ceil(books.length / booksPerPage)}`;
    }

    function filterBooks() {
        const searchTerm = searchInput.value.toLowerCase();
        return books.filter(book => book.title.toLowerCase().includes(searchTerm));
    }

    function sortBooks(filteredBooks) {
        const sortBy = sortSelect.value;
        return filteredBooks.sort((a, b) => {
            if (a[sortBy] < b[sortBy]) return -1;
            if (a[sortBy] > b[sortBy]) return 1;
            return 0;
        });
    }

    function updateBooks() {
        let filteredBooks = filterBooks();
        filteredBooks = sortBooks(filteredBooks);
        books = filteredBooks;
        displayBooks();
    }

    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayBooks();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentPage * booksPerPage < books.length) {
            currentPage++;
            displayBooks();
        }
    });

    searchInput.addEventListener('input', updateBooks);
    sortSelect.addEventListener('change', updateBooks);

    fetchBooks();
});
