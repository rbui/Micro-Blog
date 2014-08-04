(function($) {

	_.templateSettings = {
      interpolate : /\{\{(.+?)\}\}/g
    };

	var Blog = Backbone.Model.extend({
		defaults: function() {
			return {
				title: '',
				body: ''
			}
		}
	});
	var BlogsList = Backbone.Collection.extend({
		model: Blog
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
			this.model.set('body', body);
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
			this.model.on('add', this.render, this);
			this.model.on('remove', this.render, this);
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

			return false;		
		});

		var appView = new BlogsView();
	});

})(jQuery);