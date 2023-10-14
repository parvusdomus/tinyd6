import {DiceRoll} from "../modules/rolls.js";

export default class TINY_NPC_SHEET extends ActorSheet{
    static get defaultOptions() {
      return mergeObject(super.defaultOptions, {
          classes: ["tinyd6", "sheet", "actor"],
          template: "systems/tinyd6/templates/actors/npc.html",
          width: 600,
          height: 505,
          tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "general" }]
        });
  
    }
    getData() {
      const data = super.getData();
      if (this.actor.type == 'NPC') {
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
            if (i.system.equipped==true){
              armorhitpoints=item.system.extralife;
              EquippedArmors.push(i);
            }
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
      actorData.settings = {
        
      }
      actorData.isGM = game.user.isGM;

    }
    
    activateListeners(html)
	  {
		  super.activateListeners(html);
      html.find('a.dice-roll').click(this._onDiceRoll.bind(this));
      
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