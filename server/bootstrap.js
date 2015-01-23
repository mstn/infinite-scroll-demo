// generate dummy content
Meteor.startup(function () {
  if (Posts.find().count() === 0) {
    for (i = 0; i <= 50; i++) {
      Posts.insert({
        title: Fake.sentence(6),
        body: Fake.paragraph(3)
      });
    }
  }
  if (Cats.find().count() === 0) {
    for (i = 0; i <= 50; i++) {
      Cats.insert({
        title: Fake.sentence(6),
        body: Fake.paragraph(3)
      });
    }
  }
});

// publish posts
Meteor.publish('posts', function(limit) {
  Meteor._sleepForMs(2000);
  return Posts.find({}, {limit: limit});
});

Meteor.publish('cats', function(limit) {
  Meteor._sleepForMs(2000);
  return Cats.find({}, {limit: limit});
});
