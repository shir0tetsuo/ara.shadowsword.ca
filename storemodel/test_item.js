const Common = require('../common_functions.js')

// A formal item name
ItemName = 'Super Bracelet Thing'

// A description of the item
ItemDescription ='A simple test item.'

// The Image in Content Distribution Node
MaterialRef = 'something.jpg'

// Price In Cents
PriceInCents = 500

// Is Enabled? true or false
IsEnabled = true;

// 0 = Blanket, 1 = Earing, 2 = Necklace, 3 = Jewelry, 4 = Bracelet
ObjectType = 1;

exports.material_data = {
  material_id: Common.newID(), // a unique runtime ID

  material_ref: MaterialRef,
  item_formalname: ItemName,
  item_description: ItemDescription,

  item_identity: Common.hash(ItemName + MaterialRef), // World Object ID

  item_classification: Common.item_classification(ObjectType), // Object Type

  item_priceInCents: PriceInCents,
  enabled: IsEnabled
}
