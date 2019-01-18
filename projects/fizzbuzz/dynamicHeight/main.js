const getIndex = (number, index) => index + 1;
const app = new Vue({
  el: "#app",
  data: {
    numbers: Array.from({length: 100}, getIndex),
    height: 3000
  },
  filters: {
    getOutput: function(number) {
      if (number % 3 === 0 && number % 5 === 0) return 'FizzBuzz';
      if (number % 3 === 0) return 'Fizz';
      if (number % 5 === 0) return 'Buzz';
      return number;
    }
  },
  methods: {
    getClass: function(number) {
      const output = this.$options.filters.getOutput(number);
      if (isNaN(parseInt(output, 10))) {
      	return output;
      }
      return '';
    }
  }
});