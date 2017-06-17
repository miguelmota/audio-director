# observable

> Event observer pattern in JavaScript.

# Install

```bash
npm install observablejs
```

# Usage

```javascript
const observable = require('observablejs');

function Foo() {
  observable(this);

  this.on('msg', function(msg) {
    console.log(msg);
  });

  this.one('once', function(msg) {
    console.log(msg);
  });
}

var foo = new Foo();

foo.trigger('msg', 'poop'); // 'poop'
foo.trigger('msg', 'poop'); // 'poop'
foo.off('msg'); // undefined
foo.trigger('once', 'caca'); // 'caca'
foo.trigger('once', 'caca'); // undefined
```

# License

MIT
