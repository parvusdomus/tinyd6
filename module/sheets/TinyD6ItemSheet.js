import { TinyD6System } from "../tinyd6.js";

export default class TinyD6ItemSheet extends ItemSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: [ TinyD6System.SYSTEM, "sheet", "item", game.settings.get(TinyD6System.SYSTEM, "theme") ]
        });
    }

    get template() {
        return `systems/tinyd6/templates/sheets/${this.document.type}-sheet.hbs`;    
    }

    async getData() {
        const data = super.getData();

        data.data.traits = {};
        data.config = CONFIG.tinyd6;

        data.rollData = this.item.getRollData();
        data.descriptionHTML = await TextEditor.enrichHTML(this.item.system.description,
            { secrets: this.item.isOwner, async: true, rollData: data.rollData });
        if (this.item.system.trait)
            data.traitHTML = await TextEditor.enrichHTML(this.item.system.trait,
                { secrets: this.item.isOwner, async: true, rollData: data.rollData });

        //console.log("tinyd6 | ITEM DATA (after)", data);
        return data;
    }

    
}