export default class TINY_ITEM_SHEET extends ItemSheet{
    static get defaultOptions() {
      return mergeObject(super.defaultOptions, {
          classes: ["tinyd6", "sheet", "item"],
          template: "systems/tinyd6/templates/item/trait.html",
          width: 400,
          height: 530
        });
  
    }
    get template(){
      console.log (this.item.type)
        return `systems/tinyd6/templates/items/${this.item.type}.html`;
    }


  
  }