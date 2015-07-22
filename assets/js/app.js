var Geneva = new Marionette.Application();

Geneva.addRegions({
  mainRegion: "#main-region"
});

Geneva.on("start", function() {
  Backbone.history.start();
  Geneva.mainRegion.show(new Geneva.TestView())
});

var Todo = Backbone.Model.extend({
  defaults: {
    title: '',
    completed: false,
  },
  toggle: function () {
    this.save({
      completed: !this.get('completed')
    });
  }
});

var Item = Backbone.View.extend({
  tagName: 'li',
  className: 'item todo',
  template: _.template('<div class="col-md-3"><%- title %> <input type="checkbox" <%- completed ? "checked=checked" : "" %></p>'),
  events: {
    'change input': 'save'
  },
  initialize: function(options) {},
  save: function() {
    this.model.toggle();
  },
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});

var Todos = Backbone.Collection.extend({
  model: Todo,
});

Geneva.TestView = Marionette.LayoutView.extend({
  template: "#new-view",
  initialize: function(options) {
    this.collection = new Todos();
  },

  events: {
    'click .submit' : 'clicked',
    'mouseover li': 'addDelete'
  },
  addDelete : function(){
    this.$('li').find('input').append('hi');
  },

  clicked: function() {
    this.collection.add({title: $('#todo-input').val()});
    this.onRender();
  },

  onRender: function() {
    this.$('ul').empty();
    this.collection.each(function(model) {
      this.$('ul').append((new Item({model: model})).render().el);
    }, this);
  },

  templateHelpers: function() {
    return {
      tempVariable: "This is how you pass variables to the template"
    };
  }
});

$(function() {
  Geneva.start();
});
