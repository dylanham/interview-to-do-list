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
  tagName: 'tr',
  className: 'item todo',
  template: _.template('<td> <%= completed ? "<s>" + title + "</s>" : title %></td><td><%- due %></td><td>Complete <input type="checkbox" <%- completed ? "checked=checked" : "" %>></td><td><button class="delete btn btn-danger">Delete</button></td>'),
  events: {
    'change input': 'save',
    'click .delete': 'delete',
  },
  initialize: function(options) {},
  save: function() {
    this.model.toggle();
    this.render();
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
  comparator: function(model) {
    return model.get('due')
  }
});

Geneva.TestView = Marionette.LayoutView.extend({
  template: "#new-view",
  initialize: function(options) {
    this.collection = new Todos();
  },

  events: {
    'click .submit' : 'submited',
    'click .delete' : 'deleteClicked',
  },

  submited: function() {
    this.collection.add({title: $('#todo-input').val(), due: $('#datepicker').val()});
    this.onRender();
  },

  onRender: function() {
    this.$('tr').empty();
    this.collection.each(function(model) {
      model.save();
      this.$('tbody').append((new Item({model: model})).render().el);
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
