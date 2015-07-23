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
  template: _.template('<p><%- title %> <%- due %><input type="checkbox" <%- completed ? "checked=checked" : "" %>><button class="delete btn btn-danger">Delete</button></p>'),
  events: {
    'change input': 'save',
    'click .delete': 'delete',
  },
  initialize: function(options) {},
  save: function() {
    this.model.toggle();
  },
  delete: function(){
    this.model.destroy();
    this.remove();
  },
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});

var Todos = Backbone.Collection.extend({
  model: Todo,
  localStorage: new Backbone.LocalStorage('todos'),
});

Geneva.TestView = Marionette.LayoutView.extend({
  template: "#new-view",
  initialize: function(options) {
    this.collection = new Todos();
  },

  events: {
    'click .submit' : 'clicked',
    'click .delete' : 'deleteClicked',
  },

  clicked: function() {
    this.collection.add({title: $('#todo-input').val(), due: $('#datepicker').val()});
    this.onRender();
  },

  deleteClicked: function(){
  },

  onRender: function() {
    this.$('ul').empty();
    this.collection.each(function(model) {
      model.save();
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

$(function() {
  $( "#datepicker" ).datepicker();
});
