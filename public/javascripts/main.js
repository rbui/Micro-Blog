(function($) {

	_.templateSettings = {
      interpolate : /\{\{(.+?)\}\}/g
    };

    Backbone.Model.prototype.idAttribute = '_id';

	var Blog = Backbone.Model.extend({
		defaults: function() {
			return {
				title: '',
				body: ''
			}
		}
	});
	var BlogsList = Backbone.Collection.extend({
		model: Blog,
		url: 'blogs'
	});
	var blogs = new BlogsList();

	var BlogView = Backbone.View.extend({
		model: new Blog(),
		tagName: 'div',
		events: {
			'click .edit': 'edit',
			'click .delete': 'delete',
			'blur .body': 'close',
			'keypress .body': 'onEnterUpdate'
		},
		initialize: function() {
			this.template = _.template($('#blog-template').html());
		},
		edit: function(ev) {
			ev.preventDefault();
			this.$('.body').attr('contenteditable', true).focus();
		},
		close: function(ev) {
			var body = this.$('.body').text();
			var self = this;
			// this.model.set('body', body);
			this.model.save({body: body}, {
				success: function(){
					console.log("Successfully updated blog." + self.model.id);
				},
				error: function(){
					console.log("Error: failed to update blog " + self.model.id);
				}
			});
			this.$('.body').removeAttr('contenteditable');
		},
		onEnterUpdate: function(ev) {
			var self = this;
			if (ev.keyCode === 13) {
				this.close();
				_.delay(function() { self.$('.body').blur() }, 100);
			}
		},
		delete: function(ev) {
			ev.preventDefault();
			var self = this;
			this.model.destroy({
				success: function (){
					blogs.remove(this.model);
				},
				error: function (){
					console.log("Error: failed to remove blog " + self.model.id);
				}
			});
			blogs.remove(this.model);
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}
	});

	var BlogsView = Backbone.View.extend({
		model: blogs,
		el: $('#blogs-container'),
		initialize: function() {
			var self = this;
			this.model.on('add', this.render, this);
			this.model.on('remove', this.render, this);

			blogs.fetch({
				success: function(){
					self.render();
				},
				error: function(){
					console.log("Error: cannot retrieve blogs");
				}
			});
		},
		render: function() {
			var self = this;
			self.$el.html('');
			_.each(this.model.toArray(), function(blog, i) {
				self.$el.append((new BlogView({model: blog})).render().$el);
			});
			return this;
		}
	});

	$(document).ready(function() {
		$('#new-blog').submit(function(ev) {
			var blog = new Blog({ title: $('#new-title').val(), body: $('#new-body').val() });
			blogs.add(blog);
			console.log(blogs.toJSON());
			blog.save({}, {
				success: function(){
					console.log("Successfully saved blog."); 
				},
				error: function(){
					console.log("Error saving blog."); 
				}
			});

			return false;		
		});

		var appView = new BlogsView();
	});

})(jQuery);