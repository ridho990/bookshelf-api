const { nanoid } = require('nanoid');
const books = require('./books');

const isValueExist = (value) => {
	return value !== undefined;
};

const isValueNoExist = (value) => {
	return value === undefined;
};

const addBookHandler = (request, h) => {
	const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

	if (isValueNoExist(name)) {
		const response = h
			.response({
				status: 'fail',
				error: true,
				message: 'Gagal menambahkan buku. Mohon isi nama buku',
			})
			.code(400);
		return response;
	}

	if (readPage > pageCount) {
		const response = h.response({
			status: 'fail',
			error: true,
			message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
		});
		response.code(400);
		return response;
	}

	// Membuat id sebanyak 16 karakter
	const id = nanoid(16);
	// standar ISO 8601 seperti "YYYY-MM-DDTHH:mm:ss.sssZ".
	const insertedAt = new Date().toISOString();
	const updatedAt = insertedAt;
	const finished = pageCount === readPage;
	const newBook = {
		id,
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
		insertedAt,
		updatedAt,
		finished,
	};

	books.push(newBook);

	// Jika panjang array hasil filter (length) lebih dari 0, berarti ada buku dengan id yang sesuai, dan isSuccess akan menjadi true.
	const isSuccess = books.filter((book) => book.id === id).length > 0;

	if (isSuccess) {
		const response = h.response({
			status: 'success',
			error: false,
			message: 'Buku berhasil ditambahkan',
			data: {
				bookId: id,
			},
		});

		response.code(201);
		return response;
	}

	const response = h.response({
		status: 'fail',
		error: true,
		message: 'Buku gagal ditambahkan',
	});

	response.code(500);
	return response;
};

const viewAllBooksHandler = (request, h) => {
	const { name, reading, finished } = request.query;

	if (books.length === 0) {
		const response = h.response({
			status: 'success',
			error: false,
			count: books.length,
			data: {
				books: [],
			},
		});

		response.code(200);
		return response;
	}

	let filteredBooks = books;

	// Find book with name query
	if (isValueExist(name)) {
		filteredBooks = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
	}

	// Find reading book with reading query
	if (isValueExist(reading)) {
		filteredBooks = books.filter((book) => Number(book.reading) === Number(reading));
	}

	// Find Finished book with finished query
	if (isValueExist(finished)) {
		filteredBooks = books.filter((book) => Number(book.finished) === Number(finished));
	}

	// the books should have contains only id, name, and publisher property
	const resultFilteredBooks = filteredBooks.map((book) => ({
		id: book.id,
		name: book.name,
		publisher: book.publisher,
	}));

	const response = h.response({
		status: 'success',
		error: false,
		count: resultFilteredBooks.length,
		data: {
			books: resultFilteredBooks,
		},
	});

	response.code(200);
	return response;
};

const detailBookwithIdHandler = (request, h) => {
	const { bookId } = request.params;
	// Ambil buku berdasarkan nilai ID
	const book = books.filter((book_) => book_.id === bookId)[0];

	if (isValueExist(book)) {
		const response = h.response({
			status: 'success',
			error: false,
			data: {
				book,
			},
		});

		response.code(200);
		return response;
	}

	const response = h.response({
		status: 'fail',
		error: true,
		message: 'Buku tidak ditemukan',
	});
	response.code(404);
	return response;
};

const editBookwithIdHandler = (request, h) => {
	const { bookId } = request.params;
	const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

	if (isValueNoExist(name)) {
		const response = h.response({
			status: 'fail',
			error: true,
			message: 'Gagal memperbarui buku. Mohon isi nama buku',
		});
		response.code(400);
		return response;
	}

	if (pageCount < readPage) {
		const response = h.response({
			status: 'fail',
			error: true,
			message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
		});
		response.code(400);
		return response;
	}

	// Update tanggal
	const updatedAt = new Date().toISOString();
	// Ambil index buku berdasarkan nilai ID (jika gak gak ketemu nilainya -1)
	const index = books.findIndex((book) => book.id === bookId);
	const finished = pageCount === readPage;

	if (index !== -1) {
		books[index] = {
			// Memyalin objek pada index tertentu
			...books[index],
			name,
			year,
			author,
			summary,
			publisher,
			pageCount,
			readPage,
			finished,
			reading,
			updatedAt,
		};

		const response = h.response({
			status: 'success',
			error: false,
			message: 'Buku berhasil diperbarui',
		});
		response.code(200);
		return response;
	}

	const response = h.response({
		status: 'fail',
		error: true,
		message: 'Gagal memperbarui buku. Id tidak ditemukan',
	});
	response.code(404);
	return response;
};

const deleteBookwithIdHandler = (request, h) => {
	const { bookId } = request.params;
	// Ambil index buku berdasarkan nilai ID (jika gak gak ketemu nilainya -1)
	const index = books.findIndex((book) => book.id === bookId);

	if (index !== -1) {
		books.splice(index, 1);
		const response = h.response({
			status: 'success',
			error: false,
			message: 'Buku berhasil dihapus',
		});
		response.code(200);
		return response;
	}

	const response = h.response({
		status: 'fail',
		error: true,
		message: 'Buku gagal dihapus. Id tidak ditemukan',
	});
	response.code(404);
	return response;
};

const undefinedEndPoint = (request, h) => {
	const { any } = request.params;
	const response = h.response({
		status: 'fail',
		error: true,
		message: `End point "${any}" tidak ditemukan`,
	});
	response.code(404);
	return response;
};

module.exports = {
	addBookHandler,
	viewAllBooksHandler,
	detailBookwithIdHandler,
	editBookwithIdHandler,
	deleteBookwithIdHandler,
	undefinedEndPoint,
};
