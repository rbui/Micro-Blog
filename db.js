var Mongolian = require('mongolian');
var ObjectId = Mongolian.ObjectId;

ObjectId.prototype.toJSON = function toJSON(){
	return this.toString();
};

var server = new Mongolian();

var db = server.db('blog_database')

module.exports.collections = {
	blogs: db.collection('blogs')
};

module.exports.ObjectId = ObjectId;