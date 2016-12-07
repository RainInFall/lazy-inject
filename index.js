function Injector() {
  if (!(this instanceof Injector)) {
    return new Injector();
  }
  this.src = {};
  this.invokers = [];
};

Injector.prototype.inject = function(name, source) {
  var me = this;
  me.src[name] = source;
  me.invokers = me.invokers.filter(function(invoker){
    return !me.try(invoker.sources, invoker.cb);
  });
};

Injector.prototype.invoke = function(sources, cb) {
  if (this.try(sources, cb)) return;
  this.invokers.push({ sources: sources, cb: cb});
}

Injector.prototype.try = function (sources, cb) {
  var me = this;
  var args = [];
  sources.forEach(function(name){
    if (name in me.src) {
      args.push(me.src[name]);
    }
  });
  if (args.length == sources.length) {
    cb.apply(cb, args);
    return true;
  }
  return false;
};

Injector.prototype.waiting = function() {
  return this.invokers.length;
}

module.exports = Injector;
