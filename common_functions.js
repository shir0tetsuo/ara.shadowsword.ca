const SHA256 = require('crypto-js/sha256')

All_Item_Types = ['Blanket','Earing','Necklace','Jewelry','Bracelet','Bibs','Sleepers']

function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function selection(id, group) {
  return group[id]
}

module.exports = {
  newID: function(){
    let h = SHA256(new Date().getTime() + zeroPad(getRandomInt(6000),4)).toString();
    return h
  },
  hash: function(name){
    if (!name) return 0;
    return SHA256(name).toString().substring(0,10);
  },
  item_classification: function(id) {
    return selection(id, All_Item_Types)
  }
}
