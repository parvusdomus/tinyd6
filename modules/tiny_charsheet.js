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
            Armors.push(i);
            break;			  
          }
          
        }
      }
      actorData.Traits = Traits;
      actorData.Archetype_Traits = Archetype_Traits;
      actorData.Weapons = Weapons;
      actorData.EquippedWeapons = EquippedWeapons;
      actorData.Items = Items;
      actorData.Armors = Armors;
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
      await this.actor.update ({ 'system.resources.hitpoints.value': value });
      return;
    }
 
    async _onDiceRoll(event)
    {
      event.preventDefault();
      DiceRollV2(event);
      return;
    }
  
  }