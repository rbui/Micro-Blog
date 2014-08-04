var blogs = require('../db').collections.blogs;

exports.index = function(req, res){
	blogs.find().toArray(function(err, docs){
		if (!err){
			res.send(docs);
		}
		else
		{
			return res.status(500).send({
				status: 'Failed to find blogs.'
			});
		}
	});
};

exports.show = function(req, res){

};

exports.create = function(req, res){
	var params = req.body;
	blogs.insert(params, function(err){
		if (!err){

		}
		else
		{
			return res.status(500).send({
				status: 'Failed to write to database'
			})
		}
	});
};
exports.destroy = function(req, res){

};
exports.update = function(req, res){

};