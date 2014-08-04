var Mongolian = require('mongolian');

var server = new Mongolian();

var db = server.db('blog_database')

module.exports.collections = {
	blogs: db.collection('blogs')
};