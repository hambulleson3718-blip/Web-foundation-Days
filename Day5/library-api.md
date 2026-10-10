# Library Books REST API Design

## 1. List All Books

- **Method:** GET
- **Path:** `/api/books`
- **Description:** Retrieves a list of all books in the library.
- **Example Request Body:** Not required.
- **Success Status Code:** 200 OK

## 2. Get a Single Book

- **Method:** GET
- **Path:** `/api/books/:id`
- **Description:** Retrieves details of a book using its unique ID.
- **Example Request Body:** Not required.
- **Success Status Code:** 200 OK

## 3. Create a New Book

- **Method:** POST
- **Path:** `/api/books`
- **Description:** Adds a new book to the library.
- **Example Request Body:**

```json
{
  "title": "Introduction to Chemistry",
  "author": "John Kamau",
  "year": 2025
}
```

- **Success Status Code:** 201 Created

## 4. Update a Book

- **Method:** PUT
- **Path:** `/api/books/:id`
- **Description:** Updates the details of an existing book.
- **Example Request Body:**

```json
{
  "title": "Advanced Chemistry",
  "author": "John Kamau",
  "year": 2026
}
```

- **Success Status Code:** 200 OK

## 5. Delete a Book

- **Method:** DELETE
- **Path:** `/api/books/:id`
- **Description:** Deletes a book using its unique ID.
- **Example Request Body:** Not required.
- **Success Status Code:** 204 No Content

## 6. List Books by Author

- **Method:** GET
- **Path:** `/api/books?author=John%20Kamau`
- **Description:** Retrieves books written by the specified author using a query parameter.
- **Example Request Body:** Not required.
- **Success Status Code:** 200 OK

## 7. Error Status Codes

### 400 Bad Request

- **Description:** The request contains invalid data or missing required fields.
- **Example:** Creating a book without a title or author.

### 404 Not Found

- **Description:** The requested resource does not exist.
- **Example:** Requesting `/api/books/999` when book ID 999 does not exist.