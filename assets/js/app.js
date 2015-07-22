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
    content: ''
    completed: false;
  },
  toggle: {
    this.save({
      completed: !this.get('completed');
    });
  }
});

var Todos = Backbone.Collection.extend({
  model: Todo,
  localStorage: new Backbone.LocalStorage('todos-backbone'),
});

var todos = new Todos();

Geneva.TestView = Marionette.LayoutView.extend({
  template: "#new-view",
  initialize: function(options) {
    console.log(todos);
  },
  events: {
    'click' : 'clicked'
  },

  clicked: function(){
    $('.submit').on('click', function(){
      var todo = new Todo();
      todo.set('content', $('#todo-input').val());
      todos.add(todo);
      todos.each(function(element){
        console.log(element.get('content'));
      })
    })
  },
  onRender: function(){
    console.log("Hi there! I'm the render. All the html has been rendered")
  },
  templateHelpers: function() {
    return {
      tempVariable: "This is how you pass variables to the template"
    };
  }
});
