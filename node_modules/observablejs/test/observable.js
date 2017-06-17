var test = require('tape');
var observable = require('../observable');

test('observable', function (t) {
  t.plan(5);

  var result;
  var once;
  var count = 0;

  function Foo() {
    observable(this);

    this.on('msg', function(arg) {
      result = arg;
      count++;
    });

    this.one('once', function(arg) {
      once = arg;
    });
  }

  var foo = new Foo();

  foo.trigger('msg', 'poop');
  foo.trigger('once', 'boop');
  t.equal(result, 'poop');
  t.equal(once, 'boop');
  t.equal(count, 1);
  t.equal(foo.trigger('once', 'boop'), undefined);
  foo.off('msg');
  t.equal(foo.trigger('msg'), undefined);
});

