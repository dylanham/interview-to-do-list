var Geneva = new Marionette.Application();
var todoValue = $('#todo-input').val();
Geneva.addRegions({
  mainRegion: "#main-region",
});

Geneva.on("start", function() {
  Backbone.history.start();
  Geneva.mainRegion.show(new Geneva.ListView());
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
  template: _.template('<td> <%- title %> </td><td><%- due %></td><td>Complete <input type="checkbox" <%- completed ? "checked=checked" : "" %>></td><td><button class="delete btn btn-danger">Delete</button></td>'),
  events: {
    'change input': 'save',
    'click .delete': 'delete',
  },
  initialize: function(options) {},
  save: function() {
    this.model.toggle();
    this.remove();
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

var CompletedItem = Backbone.View.extend({
  tagName: 'li',
  className: 'complted-todo',
  template: _.template('<p> <s><%- title %> </s>'),
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

Geneva.ListView = Marionette.LayoutView.extend({
  template: "#new-view",
  initialize: function(options) {
    this.collection = new Todos();
    this.listenTo(this.collection, 'change', this.renderCompleted);
  },

  events: {
    'click .submit' : 'submited',
  },

  submited: function() {
    this.collection.add({title: $('#todo-input').val(), due: $('#datepicker').val()});
    this.onRender();
  },

  onRender: function() {
    this.$('tr').empty();
    this.collection.each(function(model) {
      model.save();
      if (!model.get('completed')){
        this.$('tbody').append((new Item({model: model})).render().el);
      }
    }, this);
  },

  renderCompleted: function() {
    this.$('.count').empty();
    this.$('.count').hide();
    var collectionCount = this.collection.where({completed: true}).length
    if (collectionCount > 0){
      var countStringExtension = collectionCount > 1 ? ' items completed' : ' item completed';
      this.$('.count').show();
      this.$('.count').append(collectionCount + countStringExtension);
    }
    this.$('ul').empty();
    this.collection.each(function(model) {
      if (model.get('completed')) {
        this.$('ul').append((new CompletedItem({model: model})).render().el);
      }
    }, this);
  },

  templateHelpers: function() {
    return {
      tempVariable: function(){ return this.collection.where({completed: true}).length }.bind(this)()
    };
  }
});

$(function() {
  Geneva.start();
});

$(function() {
  $( "#datepicker" ).datepicker();
});
