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
  validate: function(attrs){
    if (!attrs.title){
      return 'Please add a title';
    }
  },
  toggle: function () {
    this.save({
      completed: !this.get('completed')
    });
  }
});

var Item = Backbone.View.extend({
  className: 'well well-sm',
  template: _.template('<input type="checkbox" <%- completed ? "checked=checked" : "" %>>  <%- title %> <%- due ? "-" : "" %> <em><%- due %></em> <a class="pull-right delete">Remove</a>'),
  editTemplate: _.template('<input type="text" class="edit-task form-control" value="<%- title%>" <input type="text" id="dateupdater" class="edit-task form-control" value="<%- due %>"><button class="update btn btn-primary">Update</button>'),
  events: {
    'change input:checkbox': 'save',
    'click .delete': 'delete',
    'dblclick' : 'edit',
    'click .update': 'update',
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
  edit: function(){
    this.$el.html(this.editTemplate(this.model.toJSON()));
    $( "#dateupdater").datepicker();
  },
  update: function(){
    this.model.set('title', $('.edit-task').val());
    this.model.set('due', $('#dateupdater').val());
    this.model.save();
    this.render();
  },
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});

var CompletedItem = Backbone.View.extend({
  className: 'well well-sm',
  template: _.template('<input type="checkbox" <%- completed ? "checked=checked" : "" %>> <s><%- title %> </s> '),
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
    this.listenTo(this.collection, 'change:completed', this.onRender);
    this.listenTo(this.collection, 'change', this.renderCompleted);
  },

  events: {
    'click .submit' : 'submited',
  },

  submited: function() {
    var $title = $('#todo-input').val();
    var $error = this.$('.error');
    if (!title.trim()) {
      $error.html('<div class="alert alert-danger">Please add a title for this task.</div>')
    } else {
      $error.empty();
      this.collection.add({title: $title, due: $('#datepicker').val()});
      this.onRender();
    }
  },

  onRender: function() {
    var $tasks = this.$('.tasks');
    $tasks.empty();
    this.collection.each(function(model) {
      model.save();
      if (!model.get('completed')){
        this.$tasks.append((new Item({model: model})).render().el);
      }
    }, this);
  },

  renderCompleted: function() {
    var $count = this.$('.count');
    var $completed = this.$('.completed-tasks');
    $count.empty().hide();
    var collectionCount = this.collection.where({completed: true}).length
    if (collectionCount > 0){
      var countStringExtension = collectionCount > 1 ? ' items completed' : ' item completed';
      $count.show().append('<div class="wrapper">' + collectionCount + countStringExtension + '<div>');
    }
    $completed.empty();
    this.collection.each(function(model) {
      if (model.get('completed')) {
        $completed.append((new CompletedItem({model: model})).render().el);
      }
    }, this);
  },
});

$(function() {
  Geneva.start();
});

$(function() {
  $( "#datepicker" ).datepicker();
});
