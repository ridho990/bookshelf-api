const {
	addBookHandler,
	viewAllBooksHandler,
	detailBookwithIdHandler,
	editBookwithIdHandler,
	deleteBookwithIdHandler,
	undefinedEndPoint,
} = require('./handler');

const routes = [
	{
		method: 'POST',
		path: '/books',
		handler: addBookHandler,
	},
	{
		method: 'GET',
		path: '/books',
		handler: viewAllBooksHandler,
	},
	{
		method: 'GET',
		path: '/books/{bookId}',
		handler: detailBookwithIdHandler,
	},
	{
		method: 'PUT',
		path: '/books/{bookId}',
		handler: editBookwithIdHandler,
	},
	{
		method: 'DELETE',
		path: '/books/{bookId}',
		handler: deleteBookwithIdHandler,
	},
	{
		method: '*',
		path: '/{any*}',
		handler: undefinedEndPoint,
	},
];

module.exports = routes;
