import {DiceRollV2} from "../modules/rolls.js";
export default class TINY_CHAR_SHEET extends ActorSheet{
    static get defaultOptions() {
      let adjusted_height= 650;
      //if (game.settings.get("tinyd6", "enableSubTraits")==true || game.settings.get("tinyd6", "enableSubStyles")==true){
      //  adjusted_height+=130;
      //}
      return mergeObject(super.defaultOptions, {
          classes: ["tinyd6", "sheet", "actor"],
          template: "systems/tinyd6/templates/actors/character.html",
          width: 700,
          //height: 620,
          height: adjusted_height,
          tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "general" }],
          scrollY: ['section.sheet-body']
        });
  
    }
    getData() {
      const data = super.getData();
      if (this.actor.type == 'Player') {
        this._prepareCharacterItems(data);
        //this._updateInitiative(data);
      }
      return data;
    }

    _prepareCharacterItems(sheetData){
      const actorData = sheetData;
      const Traits = [];
      const Archetype_Traits = [];
      const Weapons = [];
      const Items = [];
      const Armors = [];
      const EquippedWeapons = [];
      const EquippedArmors =[];
      for (let i of sheetData.items){
        switch (i.type){
				  case 'trait':
				  {
            if (i.system.archetype == true){
              Archetype_Traits.push(i);
					    break;
            }
            else{
              Traits.push(i);
              break;
            }
					  
				  }
          case 'weapon':
				  {
            const item = this.actor.items.get(i._id);
            if (actorData.actor.system.competences[i.system.weapontype]==true){
              item.update ({'system.competent': true})
            }
            else{
              item.update ({'system.competent': false})
            }
            switch (item.system.weapontype){
              case 'lightmelee':
              {
                item.update ({'system.competentlabel': game.i18n.localize("TINY.competence.light_melee")});
                break;
              }
              case 'heavymelee':
              {
                item.update ({'system.competentlabel': game.i18n.localize("TINY.competence.heavy_melee")});
                break;
              }
              case 'lightranged':
              {
                item.update ({'system.competentlabel': game.i18n.localize("TINY.competence.light_ranged")});
                break;
              }
              case 'heavyranged':
              {
                item.update ({'system.competentlabel': game.i18n.localize("TINY.competence.heavy_ranged")});
                break;
              }
            }
            Weapons.push(i);
            if (i.system.equipped==true){
              EquippedWeapons.push(i);
            }
					  break;			  
				  }
          case 'item':
          {
            Items.push(i);
            break;			  
          }
          case 'armor':
          {
            const item = this.actor.items.get(i._id);
            switch (item.system.armortype){
              case 'light':
              {
                item.update ({'system.competentlabel': game.i18n.localize("TINY.competence.light")});
                break;
              }
              case 'medium':
              {
                item.update ({'system.competentlabel': game.i18n.localize("TINY.competence.medium")});
                break;
              }
              case 'heavy':
              {
                item.update ({'system.competentlabel': game.i18n.localize("TINY.competence.heavy")});
                break;
              }
            }
            Armors.push(i);
            let armorhitpoints=0;
            if (i.system.equipped==true){
              armorhitpoints=item.system.extralife;
              EquippedArmors.push(i);
            }
            this.actor.update ({'system.resources.armorhitpoints.max': armorhitpoints})
            break;			  
          }
          
        }
      }
      actorData.Traits = Traits;
      actorData.Archetype_Traits = Archetype_Traits;
      actorData.Weapons = Weapons;
      actorData.EquippedWeapons = EquippedWeapons;
      actorData.EquippedArmors = EquippedArmors;
      actorData.Items = Items;
      actorData.Armors = Armors;
      let totalhitpoints = Number(this.actor.system.resources.hitpoints.max)+Number(this.actor.system.resources.armorhitpoints.max)+Number(this.actor.system.resources.extrahitpoints.max)
      this.actor.update ({'system.resources.totalhitpoints.max': totalhitpoints})
      actorData.settings = {
        
      }
      actorData.isGM = game.user.isGM;

    }

    //_updateInitiative(sheetData){
    //  let initiative=""
    //  if (sheetData.actor.system.trait=="Agile" || sheetData.actor.system.subtrait.reflexes){
    //    initiative="3d6cs>=5"
    //  }
    //  else{
    //    initiative="2d6cs>=5"
    //  }
    //  this.actor.update ({ 'system.initiative': initiative });
    //}


    activateListeners(html)
	  {
		  super.activateListeners(html);
      html.find('a.item-create').click(this._onItemCreate.bind(this));
      html.find('a.item-equip').click(this._onItemEquip.bind(this));
      html.find('a.item-edit').click(this._onEditClick.bind(this));
      html.find('a.item-show').click(this._onShowClick.bind(this));
		  html.find('a.item-delete').click(this._onDeleteClick.bind(this));
      html.find('a.resource-change').click(this._onResourceChange.bind(this));
      html.find('a.dice-roll').click(this._onDiceRoll.bind(this));
      html.find('a.regular-roll').click(this._onRegularRoll.bind(this));
    }

    _onItemCreate(event) {
      event.preventDefault();
      const header = event.currentTarget;
      const type = header.dataset.type;
      const data = duplicate(header.dataset);
      const name = `${type.capitalize()}`;
      const itemData = {
        name: name,
        type: type,
        data: data
      };
      // Remove the type from the dataset since it's in the itemData.type prop.
      delete itemData.data["type"];
    
      // Finally, create the item!
      //     return this.actor.createOwnedItem(itemData);
      return Item.create(itemData, {parent: this.actor});
    }

    async _onEditClick(event, data)
	  {
      event.preventDefault();
		  const dataset = event.currentTarget.dataset;
		  const item = this.actor.items.get(dataset.id);
		  item.sheet.render(true);
		  return;
    }

    async _onShowClick(event, data)
	  {
      event.preventDefault();
		  const dataset = event.currentTarget.dataset;
		  const item = this.actor.items.get(dataset.id);
      let chatData = {}
      let msg_content = "<p><span>"+item.name+" </span>"
      if (item.system.tag != ""){msg_content+="<span style=\"background-color:"+item.system.bg_color+"; color:"+item.system.text_color+"\">&nbsp;"+item.system.tag+"&nbsp;</span>"}
      msg_content+="</p>"
      if (item.system.desc != ""){msg_content+="<hr>"+item.system.desc}
      chatData = {
        content: msg_content,
      };
      ChatMessage.create(chatData);
		  return;
    }

    async _onItemEquip(event, data)
	  {
      event.preventDefault();
		  const dataset = event.currentTarget.dataset;
		  const item = this.actor.items.get(dataset.id);
		  if (item.system.equipped==true){
        item.update ({'system.equipped': false})
      }
      else{
        item.update ({'system.equipped': true})
      }
		  return;
    }
    
    async _onDeleteClick(event, data)
    {
      event.preventDefault();
      const dataset = event.currentTarget.dataset;
      console.log ("dataset")
      Dialog.confirm({
        title: game.i18n.localize("TRI.ui.deleteTitle"),
			  content: game.i18n.localize("TRI.ui.deleteText"),
        yes: () => this.actor.deleteEmbeddedDocuments("Item", [dataset.id]),
        no: () => {},
        defaultYes: false
         });
      return;
    }

    async _onResourceChange(event, data)
    {
      event.preventDefault();
      const dataset = event.currentTarget.dataset;
      let value=0;
      if (Number(dataset.number)==0){
        if (Number(this.actor.system.resources[dataset.resource].value)==0){
          value=1;
        }
        else{
          value=0;
        }
      }
      else{
        value=Number(dataset.number)+1
      }
      switch (dataset.resource){
        case 'totalhitpoints':
        {
          this.actor.update ({'system.resources.totalhitpoints.value': value});
          break;
        }
      }
      return;
    }
 
    async _onDiceRoll(event)
    {
      event.preventDefault();
      DiceRollV2(event);
      return;
    }

    async _onRegularRoll(event)
    {
      console.log ("ON REGULAR ROLL")

      let d = new Dialog({
        title: "Test Dialog",
        content: "<p>You must choose either Option 1, or Option 2</p>",
        buttons: {
         desventaja: {
          icon: '<i class="fas fa-check"></i>',
          label: "Desventaja",
          callback: () => DiceRollV2('desventaja',false,false)
         },
         normal: {
          icon: '<i class="fas fa-times"></i>',
          label: "Normal",
          callback: () => DiceRollV2('normal',false,false)
         },
         ventaja: {
          icon: '<i class="fas fa-times"></i>',
          label: "Ventaja",
          callback: () => DiceRollV2('ventaja',false,false)
         }
        },
        default: "two",
        render: html => console.log("Register interactivity in the rendered dialog"),
        close: html => console.log("This always is logged no matter which option is chosen")
       });
       d.render(true);
      return;
    }
  
  }