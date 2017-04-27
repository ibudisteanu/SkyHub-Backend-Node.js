var waterfall = require('async').waterfall;

module.exports = function(){
  var arr = new Array();

  var wf = {
    callback: function(fn){
      waterfall(arr, fn);
    },
    push: function(fn){
      arr.push(fn);
      return wf;
    }
  };

  return wf;
};