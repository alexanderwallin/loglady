'use strict';

const loglady = require('../dist/loglady');
var argv = require('yargs')
    .count('verbose')
    .alias('v', 'verbose')
    .argv;

loglady.setVerbose(argv.verbose > 0);
loglady.showIntroHeader('Spying on objects', ' ~ ');

let foo;
let bar;
let quad;
let val;
let newVal;

//
// Plain object
//
loglady.section('Spying on regular object');

const Spyee = {
  val: 123,
  foo: () => 'foo',
  bar: () => 'bar',
  quad: (x) => x*x,
  getVal: function() {
    return this.val;
  },
  add: function(x) {
    return this.val + x;
  },
};

loglady.spyOn(Spyee, 'Spyee');

foo = Spyee.foo();
bar = Spyee.bar();
quad = Spyee.quad(4);
val = Spyee.getVal();
newVal = Spyee.add(10);

loglady.json({ foo, bar, quad, val, newVal });

//
// Using prototype
//
loglady.section('Spying on an instance');

function SpyeeProto() {
  this.val = 123;
}
SpyeeProto.prototype.foo = function() {
  return 'foo';
}
SpyeeProto.prototype.bar = function() {
  return 'bar';
}
SpyeeProto.prototype.quad = function(x) {
  return x*x;
}
SpyeeProto.prototype.getVal = function() {
  return this.val;
}
SpyeeProto.prototype.add = function(x) {
  return this.val + x;
}

const spyeeProto = new SpyeeProto();
loglady.spyOn(spyeeProto, 'spyeeProto');

foo = spyeeProto.foo();
bar = spyeeProto.bar();
quad = spyeeProto.quad(2);
val = spyeeProto.getVal();
newVal = spyeeProto.add(10);

loglady.json({ foo, bar, quad, val, newVal });

//
// Using prototype
//
loglady.section('Spying on an instance of a class');

class SpyeeClass {
  constructor() {
    this.val = 123;
  }
  foo() {
    return 'foo';
  }
  bar() {
    return 'bar';
  }
  quad(x) {
    return x*x;
  }
  getVal() {
    return this.val;
  }
  add(x) {
    return this.val + x;
  }
}

const spyeeInstance = new SpyeeClass();

loglady.spyOn(spyeeInstance);

foo = spyeeInstance.foo();
bar = spyeeInstance.bar();
quad = spyeeInstance.quad(2);
val = spyeeInstance.getVal();
newVal = spyeeInstance.add(10);

loglady.json({ foo, bar, quad, val, newVal });
