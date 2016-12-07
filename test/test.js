var expect = require('expect');
var Injector = require('../');
var _ = require('lodash');

describe('Inejector#inject Inejector#invoke', function(){
  it('should new same as call', function(){
    var injector = Injector();
    expect(injector instanceof Injector).toBe(true);
  });
  it('should invoke at once when source ready', function(){
    var injector = Injector();
    injector.inject('one', 1);
    var mark = false;
    injector.invoke(['one'], function(){
      mark = true;
    });
    expect(mark).toBe(true);
  });
  it('should inject the right source', function(done){
    this.timeout(500);
    var injector = Injector();
    injector.inject('two', 2);
    injector.inject('one', 1);
    injector.invoke(['one'], function(one){
      expect(one).toBe(1);
      done();
    });
  });
  it('should inject int right sequnce', function(done){
    this.timeout(500);
    var injector = Injector();
    injector.inject('two', 2);
    injector.inject('one', 1);
    injector.invoke(['one', 'two'], function(one, two){
      expect(one).toBe(1);
      expect(two).toBe(2);
      done();
    });
  });
  it('should be lazy', function(){
    var injector = Injector();
    injector.inject('one', 1);
    var mark = false;
    injector.invoke(['one', 'two'], function(one, two){
      expect(one).toBe(1);
      expect(two).toBe(2);
      expect(mark).toBe(true);
    });
    mark = true;
    injector.inject('two', 2);
  });
  it('should work with defer', function(done){
    this.timeout(500);
    var injector = Injector();
    injector.inject('one', 1);
    var mark = false;
    injector.invoke(['one', 'two'], function(one, two){
      expect(one).toBe(1);
      expect(two).toBe(2);
      expect(mark).toBe(true);
      done();
    });
    _.defer(function(){
      mark = true;
      injector.inject('two', 2);
    });
  });
  it('should callback only once', function(){
    var injector = Injector();
    injector.inject('one', 1);
    var count = 0;
    injector.invoke(['one'], function(){
      count++;
      expect(count).toBe(1);
    });
    injector.inject('one', new Number(1));
    injector.inject('two', new Number(2));
  });
  it('should callback when double inject', function(){
    var injector = Injector();
    injector.inject('one', 1);
    var count = 0;
    injector.invoke(['one', 'two'], function(){
      count++;
      expect(count).toBe(1);
    });
    injector.inject('two', 2);
    _.defer(function(){
        injector.inject('two', new Number(2));
    });
  });
});

describe('Injector#waiting', function(){
  it('should be 0 when construt', function() {
    var injector = new Injector();
    expect(injector.waiting()).toBe(0);
  });
  it('should be 0 when invoke at once', function() {
    var injector = Injector();
    injector.inject('one', 1);
    injector.invoke(['one'], function(){
    });
    expect(injector.waiting()).toBe(0);
  });
  it('should equal after inject', function(){
    var injector = Injector();
    injector.inject('one', 1);
    injector.invoke(['one', 'two'], function(){
    });
    expect(injector.waiting()).toBe(1);
  });
  it('should equal after lazy invoke', function(){
    this.timeout(500);
    var injector = Injector();
    injector.inject('one', 1);
    injector.invoke(['one', 'two'], function(){
    });
    expect(injector.waiting()).toBe(1);
    injector.inject('two', 2);
    expect(injector.waiting()).toBe(0);
  });
  it('should equal after defer invoke', function(done){
    this.timeout(500);
    var injector = Injector();
    injector.inject('one', 1);
    injector.invoke(['one', 'two'], function(){
    });
    expect(injector.waiting()).toBe(1);
    _.defer(function(){
      injector.inject('two', 2);
      expect(injector.waiting()).toBe(0);
      done();
    });
  });
});
