var blogs = require('../db').collections.blogs;
var ObjectId = require('../db').ObjectId;
var _ = require('underscore');

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

exports.create = function(req, res){
	var params = req.body;
	blogs.insert(params, function(err){
		if (!err){
			res.send(params);
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
	var id = req.params.id;
	blogs.remove({_id: new ObjectId(id)}, function(err, numRemoved){
		if (!err && numRemoved == 1){
			res.send({_id: id});
		}
		else
		{
			return res.status(500).send({ 
				status: "Failed to delete blog" + id + "from database" 
			});
		}
	})
};

exports.update = function(req, res){
	var id = req.params.id;
	var params = req.body;

	blogs.update({_id: new ObjectId(id)}, sanitize(params), function(err, numUpdated){
		if (!err && numUpdated == 1) {
			res.send(params);
		}
		else
		{
			return res.status(500).send({status: "Failed to update blog." + id});
		}
	});
};

function sanitize(blog){
	var blog = _.clone(blog);
	delete blog._id;
	return blog;
}