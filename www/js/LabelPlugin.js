var THREE

module.exports = function (three) {

  THREE = three // hack until three.js fixes multiple instantiation

  var LabelPlugin = {
  labels: [],
  init: function() {},
  add: function(l) {this.labels.push(l);},
  remove: function(l) {
    this.labels = this.labels.filter(function (label) {
      return label != l;
    });
  },
  update: function(l) {
    for (var i=0; i<this.labels.length; i++) {
    var currentLabel = this.labels[i]
      if (currentLabel.id = l.id) {
        currentLabel.content = l.content
      }
    }
  },
  render: function() {
    for (var i=0; i<this.labels.length; i++) {
      var args = Array.prototype.slice.call(arguments);
      this.labels[i].render.apply(this.labels[i], args);
    }
  }
};
  return LabelPlugin;

}