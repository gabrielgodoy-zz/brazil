export let config = {
  margin: {
    top: 50,
    right: 45,
    bottom: 20,
    left: 45,
  },
  init() {
    this.width = 600 - this.margin.left - this.margin.right;
    this.height = 300 - this.margin.top - this.margin.bottom;
    return this;
  }
}.init();
