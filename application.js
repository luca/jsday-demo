$(function(){
	var Note = Backbone.Model.extend({

	    // Default attributes for Note
	    defaults: {
	      text: "This is a note, tap me to edit",
	    },
		
		title: function(){
			return this.get("text").substr(0,30)+(this.get("text").length>30 ? " ..." : "");
		},
	});
	
	var Notes = Backbone.Collection.extend({
	  	model: Note,
      	localStorage: new Store("Notes.store")
	});
	
	window.notes = new Notes();
	
	var NoteView = Backbone.View.extend({

	  tagName: "li",
      className: "arrow",
      template: _.template($('#note-tmpl').html()),
	  
	  events: {
	    "click": "edit",
	  },

	  initialize: function() {
	    _.bindAll(this, "render");
		this.model.bind("change", this.render);
	  },

	  render: function() {
	      $(this.el).html(this.template({id: this.model.id, title: this.model.title()}));
	      return this;
	  },
	 
	  edit: function(){
		noteedit.showNote(this.model);
	  	// alert(this.model.get("text"));
	  }

	});
	
	var NotepadView = Backbone.View.extend({
	
	  el: $("#menu"),
	  events: {
	    "click #add": "create",
	  },
	  
	  initialize: function() {
	    _.bindAll(this, "addOne", "addAll", "create");
	
	    notes.bind('add',     this.addOne);
	    notes.bind('refresh', this.addAll);
	    	
	    notes.fetch();
		if (window.notes.isEmpty()){
			window.notes.create({});		
		}
	    
		this.el.addClass("current");
	  },
	
	  addOne: function(note){
		var view = new NoteView({model: note});
	  	this.$(".list").append(view.render().el);
	  },
	  addAll: function(note){
		notes.each(this.addOne);
	  },
	  create: function(){
	  	noteedit.showNote(new Note({text:""}));
	  },
	});
	window.notepad = new NotepadView;

	var NoteEditView = Backbone.View.extend({
	
	  el: $("#edit"),
	  events: {
	    "click #save": "save",
	    "click #back": "back",
	  },
	  
	  initialize: function() {
	    _.bindAll(this, "render", "save", "showNote", "back");	    
	  },
	
	  save: function(){
		if (this.model.isNew()) {
			notes.create({text:this.$("textarea").val()})
		} else {
			this.model.save({text:this.$("textarea").val()});			
		}
		this.el.removeClass("current");
	  },
	  render: function(){
	    this.$("textarea").val(this.model.get("text"));	
		this.el.addClass("current");
	  },
	  showNote: function(note){
	  	this.model = note;
		this.render();
	  },
	  back: function(note){
		this.el.removeClass("current").addClass("reverse");
		this.model = null;
	  },
		
	});
	window.noteedit = new NoteEditView;
	window.notes.refresh([])
})