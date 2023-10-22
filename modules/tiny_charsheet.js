import {DiceRoll} from "../modules/rolls.js";
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
      let armorhitpoints=0;
      let totalSlots=0;
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
            totalSlots+=item.system.slots;
					  break;			  
				  }
          case 'item':
          {
            const item = this.actor.items.get(i._id);
            Items.push(i);
            totalSlots+=item.system.slots;
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
            if (i.system.equipped==true){
              armorhitpoints=item.system.extralife;
              EquippedArmors.push(i);
            }
            totalSlots+=item.system.slots;
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
      let totalhitpoints = Number(this.actor.system.resources.hitpoints.max)+Number(armorhitpoints)+Number(this.actor.system.resources.extrahitpoints.max)
      this.actor.update ({'system.resources.armorhitpoints.max': armorhitpoints})
      this.actor.update ({'system.resources.totalhitpoints.max': totalhitpoints})
      actorData.isGM = game.user.isGM;
      actorData.settings = {
        xpMode: game.settings.get("tinyd6", "xpMode"),
        enableSlots: game.settings.get("tinyd6", "enableSlots"),
      }
      this.actor.update ({'system.resources.slots.value': totalSlots})
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
      html.find('a.competence-toggle').click(this._onCompetenceToggle.bind(this));
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
      let msg_content = "<p><span>"+item.name+" </span></p>"
      if (item.type == "weapon"){
        msg_content+="<hr><p>"+item.system.competentlabel+" <i class=\"fa-solid fa-heart\"></i> "+item.system.damage+"</p>"
      }
      if (item.type == "armor"){
        msg_content+="<hr><p>"+item.system.competentlabel+" <i class=\"fa-solid fa-shield\"></i> "+item.system.extralife+"</p>"
      }
      msg_content+=""
      if (item.system.desc != ""){msg_content+="<hr>"+item.system.description}
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
      console.log (item)
		  if (item.system.equipped==true){
        item.update ({'system.equipped': false})
      }
      else{
        if (item.type=="armor"){
          for (let i of this.actor.items){
            if ((i.type=="armor")&&(i.system.equipped==true)){
              i.update ({'system.equipped': false})
            }
          }
        }
        item.update ({'system.equipped': true})
      }
      console.log (item)
		  return;
    }
    
    async _onDeleteClick(event, data)
    {
      event.preventDefault();
      const dataset = event.currentTarget.dataset;
      console.log ("dataset")
      Dialog.confirm({
        title: game.i18n.localize("TINY.ui.deleteTitle"),
			  content: game.i18n.localize("TINY.ui.deleteText"),
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
        if (dataset.resource != 'sessionsplayed'){
          if (Number(this.actor.system.resources[dataset.resource].value)==0){
            value=1;
          }
          else{
            value=0;
          }
        }
        else{
          if (Number(this.actor.system.xp.sessionsPlayed)==0){
            value=1;
          }
          else{
            value=0;
          }
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
        case 'sessionsplayed':
        {
          this.actor.update ({'system.xp.sessionsPlayed': value});
          break;
        }
      }
      return;
    }

    async _onCompetenceToggle (event, data){
      event.preventDefault();
      const dataset = event.currentTarget.dataset;
      switch (dataset.competence){
        case 'lightmelee':
        {
          if (this.actor.system.competences.lightmelee==true){
            await this.actor.update ({'system.competences.lightmelee': false});
          }
          else{
            await this.actor.update ({'system.competences.lightmelee': true});
          }
          
          break;
        }
        case 'heavymelee':
        {
          if (this.actor.system.competences.heavymelee==true){
            await this.actor.update ({'system.competences.heavymelee': false});
          }
          else{
            await this.actor.update ({'system.competences.heavymelee': true});
          }
          
          break;
        }
        case 'lightranged':
        {
          if (this.actor.system.competences.lightranged==true){
            await this.actor.update ({'system.competences.lightranged': false});
          }
          else{
            await this.actor.update ({'system.competences.lightranged': true});
          }
          console.log (this.actor.system.competences.lightranged)
          break;
        }
        case 'heavyranged':
        {
          if (this.actor.system.competences.heavyranged==true){
            await this.actor.update ({'system.competences.heavyranged': false});
          }
          else{
            await this.actor.update ({'system.competences.heavyranged': true});
          }
          
          break;
        }
      }
      return;
    }
 
    async _onDiceRoll(event)
    {
      let html_content='<table style="background: none; border:none; text-align: center;"><tr><td><label>'+game.i18n.localize("TINY.ui.focus")+'</label><input type="checkbox"' 
      if (this.actor.system.focus){
        html_content+=' checked'
      } 
      html_content+=' name="focus" id="focus"></td>'
      +'<td><label>'+game.i18n.localize("TINY.ui.defense")
      +'</label><input type="checkbox"' 
      if (this.actor.system.defense){
        html_content+=' checked'
      } 
      html_content+=' name="defense" id="defense"></td></tr></table>'

      let d = new Dialog({
        title: game.i18n.localize("TINY.ui.diceRoll"),
        content: html_content,
        buttons: {
         desventaja: {
          icon: '<i class="fa-solid fa-cube"></i>',
          label: game.i18n.localize("TINY.ui.disadvantageRoll"),
          callback: () => {
            let focus=document.getElementById("focus").checked;
            let defense=document.getElementById("defense").checked;
            DiceRoll('desventaja',focus,defense)
            this.actor.update ({'system.focus': focus});
            this.actor.update ({'system.defense': defense});
          }
         },
         normal: {
          icon: '<i class="fa-solid fa-dice"></i>',
          label: game.i18n.localize("TINY.ui.regularRoll"),
          callback: () => {
            let focus=document.getElementById("focus").checked;
            let defense=document.getElementById("defense").checked;
            DiceRoll('normal',focus,defense)
            this.actor.update ({'system.focus': focus});
            this.actor.update ({'system.defense': defense});
          }
         },
         ventaja: {
          icon: '<i class="fa-solid fa-cubes"></i>',
          label: game.i18n.localize("TINY.ui.advantageRoll"),
          callback: () => {
            let focus=document.getElementById("focus").checked;
            let defense=document.getElementById("defense").checked;
            DiceRoll('ventaja',focus,defense)
            this.actor.update ({'system.focus': focus});
            this.actor.update ({'system.defense': defense});
          }
         }
        },
        default: "normal",
        render: html => console.log("Register interactivity in the rendered dialog"),
        close: html => console.log("This always is logged no matter which option is chosen")
       });
       d.render(true);
      return;
    }
  
  }