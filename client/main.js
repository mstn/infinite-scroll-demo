instance = null;


// the component infinite-scroll is generic
// I could use it with several templates
Cat.define('infinite-scroll', {

  // this component can trigger the following actions
  actions: {
    'load-more': {
      // low-level biding with template event
      'event':'click .load-more',
      // optional data to send over as arguments
      'data': function(context, template){
        // We don't have to write e.preventDefault() anymore!
        // 'this' is an instance: hence we can access state
        // 'context' correspond to 'this' inside the template
        // 'template' is template instance
        return undefined;
        // return some_data;
        // return array_of_data;
      }
    }
  },

  // handlers handle input actions
  // it can be set using also this.onAction
  handlers: {
    'load-more': function(payload){
      // 'this' is a reference to an instance
      // actions can have also data payloads passed as arguments
      var limit = this.get('limit');
      limit += this.attrs.inc;
      this.set('limit', limit);
    }
  },

  // which actions are triggered by this components?
  // output actions
  // direct method instance.trigger('action')

  created: function(){

    // 'this' is a reference to an instance
    // this.params are instance parameters

    this.autorun( function(){
      var limit = this.get('limit');
      console.log("Asking for "+limit+" items")

      // XXX it should be controlled by the component and disposed when view not visible
      // I need to find another way to specify subscription, I do not like this trick
      var subscription = Meteor.subscribe(this.attrs.sub, limit);

      // if subscription is ready, set limit to newLimit
      if (subscription.ready()) {
        console.log("> Received "+limit+" items. \n\n")
        this.set('loaded', limit);
        this.set('ready', true);
      } else {
        this.set('ready', false);
        console.log("> Subscription is not ready yet. \n\n");
      }
    });


    var loaded = this.params.loaded || 0;
    var limit = this.params.limit || 5;

    // return the initial state
    // XXX should be init
    return {
      loaded:loaded, limit:limit, ready:false,
      items: function(){
        var loaded =  this.get('loaded');
        return this.params.data.find({}, {limit: loaded});
      },
      hasMoreItems:function(){
        // XXX better this.get('items')
        // how to distinguish between ReactiveVar and functions?
        var loaded =  this.get('loaded');
        return this.params.data.find({}, {limit: loaded}).count() >= this.get('limit');
      }
    };

  },

  rendered: function(){

  },

  destroyed: function(){

  }
});

instance = Cat.build('infinite-scroll', {
  // this properties are associated to this particular instance
  // infinite-scroll is generic, but an instance is particular
  template:'posts',
  limit:5,
  data: Posts
}, {
  // non reactive attributes
  // if you don't need reaction, don't use it. It is more expensive!
  title:'My posts',
  sub:'posts',
  inc:5
});

instance2 = Cat.build('infinite-scroll', {
  // this properties are associated to this particular instance
  // infinite-scroll is generic, but an instance is particular
  template:'posts',
  limit:2,
  data: Cats
}, {
  // non reactive attributes
  // if you don't need reaction, don't use it. It is more expensive!
  title:'My cute cats',
  sub:'cats',
  inc:1
});


Meteor.startup( function(){
  instance.render('#posts');
  instance2.render('#cats');
});
