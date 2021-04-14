function Edge(a, b, label) {
  this.a = a;
  this.b = b;
  this.label = label;
}

Edge.prototype = {
  weight: function() {
    return Math.sqrt(Math.pow(this.a.y - this.b.y, 2) +
                     Math.pow(this.a.x - this.b.x, 2));
  },
  contains: function(c) {
    return this.a.equals(c) || this.b.equals(c);
  },
  equals: function(c) {
    return (this.a.equals(c.a) && this.b.equals(c.b)) ||
           (this.a.equals(c.b) && this.b.eqauls(c.a));
  },
  getA: function() {
    return this.a;
  },
  getB: function() {
    return this.b;
  }
};
