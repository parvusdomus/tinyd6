import {DiceRoll} from "../modules/rolls.js";

export default class TINY_SPACESHIP_SHEET extends ActorSheet{
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
          classes: ["tinyd6", "sheet", "actor"],
          template: "systems/tinyd6/templates/actors/spaceship.html",
          width: 600,
          height: 505,
          tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "general" }]
        });
  
    }
    getData() {
      const data = super.getData();
      if (this.actor.type == 'Spaceship') {
        this._prepareCharacterItems(data);
        //this._updateInitiative(data);
      }
      return data;
    }

    _prepareCharacterItems(sheetData){
      const actorData = sheetData;
      const Traits = [];
      const Weapons = [];
      let initiative="2d6"
      for (let i of sheetData.items){
        switch (i.type){
				  case 'trait':
				  {
            switch (i.system.modifies_init){
              case 'ventaja':
              {
                initiative="3d6"
                break;
              }
              case 'desventaja':
              {
                initiative="1d6"
                break;
              }
            }
            Traits.push(i);
            break;
				  }
          case 'weapon':
				  {
            const item = this.actor.items.get(i._id);
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
					  break;			  
				  }
          
          
        }
      }
      actorData.Traits = Traits;
      actorData.Weapons = Weapons;
      let totalhitpoints = Number(this.actor.system.resources.hitpoints.max)
      this.actor.update ({'system.resources.totalhitpoints.max': totalhitpoints})
      this.actor.update ({'system.initiative': initiative})
      actorData.settings = {
        
      }
      actorData.isGM = game.user.isGM;

    }
    
    activateListeners(html)
	  {
		  super.activateListeners(html);
      html.find('a.dice-roll').click(this._onDiceRoll.bind(this));
      html.find('a.resource-change').click(this._onResourceChange.bind(this));
      html.find('a.item-edit').click(this._onEditClick.bind(this));
      html.find('a.item-show').click(this._onShowClick.bind(this));
		  html.find('a.item-delete').click(this._onDeleteClick.bind(this));
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
      html_content+=' name="defense" id="defense"></td><td><label>'+game.i18n.localize("TINY.ui.marksman")+'</label><input type="checkbox" name="marksman" id="marksman"></td></tr></table>'

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
            let marksman=document.getElementById("marksman").checked;
            DiceRoll('desventaja',focus,defense,marksman)
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
            let marksman=document.getElementById("marksman").checked;
            DiceRoll('normal',focus,defense,marksman)
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
            let marksman=document.getElementById("marksman").checked;
            DiceRoll('ventaja',focus,defense,marksman)
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
        case 'energy':
        {
          this.actor.update ({'system.resources.energy.value': value});
          break;
        }
      }
      return;
    }
    
  
  }