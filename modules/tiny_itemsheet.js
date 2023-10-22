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
        return `systems/tinyd6/templates/items/${this.item.type}.html`;
    }
    getData() {
      const data = super.getData();
      this._prepareItemOptions(data);
      return data;
    }

    _prepareItemOptions(sheetData){
      const itemData = sheetData;
      itemData.settings = {
        enableSlots: game.settings.get("tinyd6", "enableSlots")
      }
    }

  
  }