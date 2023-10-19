import TINY_CHAR_SHEET from "./modules/tiny_charsheet.js";
import TINY_NPC_SHEET from "./modules/tiny_npc.js";
import TINY_ITEM_SHEET from "./modules/tiny_itemsheet.js";
import { preloadHandlebarsTemplates } from "./modules/preloadTemplates.js";
import {_getInitiativeFormula} from './modules/combat.js';
import {diceToFaces} from "./modules/rolls.js";
import tinyChat from "./modules/chat.js";



Hooks.once("init", function(){
  document.getElementById("logo").src = "/systems/tinyd6/style/images/tinyd6.webp";
  console.log("test | INITIALIZING TINY CHARACTER SHEETS...");
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("tinyd6", TINY_CHAR_SHEET, {
    makeDefault: true,
    types: ['Player']
  });
  Actors.registerSheet("tinyd6", TINY_NPC_SHEET, {
    makeDefault: true,
    types: ['NPC']
  });
  console.log("test | INITIALIZING TINY ITEM SHEETS...");
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("tinyd6", TINY_ITEM_SHEET,{
    makeDefault: true,
    types: ['trait','weapon','item','armor']
  });
  preloadHandlebarsTemplates();

    // Slowing down pings
    CONFIG.Canvas.pings.styles.pulse.duration = 2000
    CONFIG.Canvas.pings.styles.alert.duration = 2000
    CONFIG.Canvas.pings.styles.arrow.duration = 2000

  console.log("test | INITIALIZING TINY SETTINGS...");


  game.settings.register("tinyd6", "enableCritical", {
    name: game.i18n.localize("TINY.config.enableCriticalName"),
    hint: game.i18n.localize("TINY.config.enableCriticalHint"),
    scope: "world",
    type: Boolean,
    default: false,
    requiresReload: false,
    config: true
  });

  game.settings.register("tinyd6", "xpMode", {
    name: game.i18n.localize("TINY.config.xpModeName"),
    hint: game.i18n.localize("TINY.config.xpModeHint"),
    scope: "world",
    type: String,
    choices: {
      "none": game.i18n.localize("TINY.config.xpNone"),
      "minimalistic": game.i18n.localize("TINY.config.xpMinimal"),
      "xp": game.i18n.localize("TINY.config.xpXP")
    },
    default: "none",
    requiresReload: true,
    config: true
  });

  game.settings.register('tinyd6', 'bgImage', {
    name: game.i18n.localize("TINY.config.bgImageName"),
    hint: game.i18n.localize("TINY.config.bgImageHint"),
    type: String,
    default: 'systems/tinyd6/style/images/white.webp',
    scope: 'world',
    requiresReload: true,
    config: true,
    filePicker: 'image',
  });

  game.settings.register('tinyd6', 'chatBgImage', {
    name: game.i18n.localize("TINY.config.chatBgImageName"),
    hint: game.i18n.localize("TINY.config.chatBgImageHint"),
    type: String,
    default: 'systems/tinyd6/style/images/white.webp',
    scope: 'world',
    requiresReload: true,
    config: true,
    filePicker: 'image',
  });

  game.settings.register('tinyd6', 'titleFont', {
    name: game.i18n.localize("TINY.config.titleFontName"),
    hint: game.i18n.localize("TINY.config.titleFontHint"),
    config: true,
    type: String,
    scope: 'world',
    choices: {
      "Dominican": "Default Tricube Tales Font",
      "Werewolf_Moon": "A Welsh Werewolf",
      "East_Anglia": "Accursed: Dark Tales of Morden",
      "WHITC": "Christmas Capers",
      "RexliaRg": "Chrome Shells and Neon Streets",
      "Nautilus": "Down in the Depths",
      "Yagathan": "Eldritch Detectives",
      "Amble": "Firefighters",
      "MountainsofChristmas": "Goblin Gangsters",
      "BLACC": "Heroes of Sherwood Forest",
      "Creepster": "Horrible Henchmen",
      "Duvall": "Hunters of Victorian London",
      "mandalore": "Interstellar Bounty Hunters",
      "Starjedi": "Interstellar Laser Knights",
      "xirod": "Interstellar Mech Wars",
      "Mandalore_Halftone": "Interstellar Rebels",
      "pirulen": "Interstellar Smugglers",
      "Arkhip": "Interstellar Troopers",
      "MysteryQuest": "Maidenstead Mysteries",
      "Bangers": "Metahuman Uprising",
      "OhioKraft": "Minerunners",
      "WIZARDRY": "Paths Between the Stars",
      "TradeWinds": "Pirates of the Bone Blade",
      "Foul": "Rotten Odds",
      "BLOODY": "Samhain Slaughter",
      "Cinzel": "Sharp Knives and Dark Streets",
      "IMPOS5": "Spellrunners",
      "Almendrasc": "Stranger Tales",
      "StoneAge": "Stone Age Hunters",
      "IMMORTAL": "Summer Camp Slayers",
      "MetalMacabre": "Sundered Chains",
      "Bagnard": "Tales of the City Guard",
      "MountainsofChristmas": "Tales of the Goblin Horde",
      "RifficFree": "Tales of the Little Adventurers",
      "Orbitron": "Titan Effect: Covert Tales",
      "MetalMacabre": "Twisted Wishes",
      "Headhunter": "Voyage to the Isle of Skulls",
      "Saddlebag": "Wardens of the Weird West",
      "Berry": "Welcome to Drakonheim",
      "Skia": "Winter Eternal: Darkness & Ice",
      "Corleone": "Wiseguys: Gangster Tales"
    },
    requiresReload: true,
    default: 'Dominican',
  });

  game.settings.register('tinyd6', 'buttonHeaderBgColor', {
    name: game.i18n.localize("TINY.config.buttonHeaderBgColorName"),
    hint: game.i18n.localize("TINY.config.buttonHeaderBgColorHint"),
    scope: 'world',
    requiresReload: true,
    config: true,
    type: String,
    default: '#ffffff',
  });

  game.settings.register('tinyd6', 'buttonHeaderFontColor', {
    name: game.i18n.localize("TINY.config.buttonHeaderFontColorName"),
    hint: game.i18n.localize("TINY.config.buttonHeaderFontColorHint"),
    scope: 'world',
    requiresReload: true,
    config: true,
    type: String,
    default: '#000000',
  }); 

  game.settings.register('tinyd6', 'listHeaderBgColor', {
      name: game.i18n.localize("TINY.config.listHeaderBgColorName"),
      hint: game.i18n.localize("TINY.config.listHeaderBgColorHint"),
      scope: 'world',
      requiresReload: true,
      config: true,
      type: String,
      default: '#000000',
  });

  game.settings.register('tinyd6', 'listHeaderFontColor', {
    name: game.i18n.localize("TINY.config.listHeaderFontColorName"),
    hint: game.i18n.localize("TINY.config.listHeaderFontColorHint"),
    scope: 'world',
    requiresReload: true,
    config: true,
    type: String,
    default: '#ffffff',
  }); 

  game.settings.register('tinyd6', 'headerFontColor', {
    name: game.i18n.localize("TINY.config.headerFontColorName"),
    hint: game.i18n.localize("TINY.config.headerFontColorHint"),
    scope: 'world',
    requiresReload: true,
    config: true,
    type: String,
    default: '#000000',
  });

  game.settings.register('tinyd6', 'regularFontColor', {
    name: game.i18n.localize("TINY.config.itemFontColorName"),
    hint: game.i18n.localize("TINY.config.itemFontColorHint"),
    scope: 'world',
    requiresReload: true,
    config: true,
    type: String,
    default: '#000000',
  });

  game.settings.register('tinyd6', 'inputBgColor', {
    name: game.i18n.localize("TINY.config.inputBgColorName"),
    hint: game.i18n.localize("TINY.config.inputBgColorHint"),
    scope: 'world',
    requiresReload: true,
    config: true,
    type: String,
    default: '#ffffdc',
  });

  game.settings.register('tinyd6', 'inputFontColor', {
    name: game.i18n.localize("TINY.config.inputFontColorName"),
    hint: game.i18n.localize("TINY.config.inputFontColorHint"),
    scope: 'world',
    requiresReload: true,
    config: true,
    type: String,
    default: '#000000',
  });

  game.settings.register('tinyd6', 'windowHeaderBgColor', {
    name: game.i18n.localize("TINY.config.windowHeaderBgColorName"),
    hint: game.i18n.localize("TINY.config.windowHeaderBgColorHint"),
    scope: 'world',
    requiresReload: true,
    config: true,
    type: String,
    default: '#000000',
  });

  game.settings.register('tinyd6', 'windowHeaderFontColor', {
    name: game.i18n.localize("TINY.config.windowHeaderFontColorName"),
    hint: game.i18n.localize("TINY.config.windowHeaderFontColorHint"),
    scope: 'world',
    requiresReload: true,
    config: true,
    type: String,
    default: '#ffffff',
  });

  game.settings.register('tinyd6', 'dieRollerFontColor', {
    name: game.i18n.localize("TINY.config.dieRollerFontColorName"),
    hint: game.i18n.localize("TINY.config.dieRollerFontColorHint"),
    scope: 'world',
    requiresReload: true,
    config: true,
    type: String,
    default: '#000000',
  });

  game.settings.register('tinyd6', 'dieRollerButtonBgColor', {
    name: game.i18n.localize("TINY.config.dieRollerButtonBgColorName"),
    hint: game.i18n.localize("TINY.config.dieRollerButtonBgColorHint"),
    scope: 'world',
    requiresReload: true,
    config: true,
    type: String,
    default: '#ffffff',
  });

  game.settings.register('tinyd6', 'dieRollerButtonFontColor', {
    name: game.i18n.localize("TINY.config.dieRollerButtonFontColorName"),
    hint: game.i18n.localize("TINY.config.dieRollerButtonFontColorHint"),
    scope: 'world',
    requiresReload: true,
    config: true,
    type: String,
    default: '#000000',
  });

  game.settings.register('tinyd6', 'tabActiveBgColor', {
    name: game.i18n.localize("TINY.config.tabActiveBgColorName"),
    hint: game.i18n.localize("TINY.config.tabActiveBgColorHint"),
    scope: 'world',
    requiresReload: true,
    config: true,
    type: String,
    default: '#000000',
  });

  game.settings.register('tinyd6', 'tabActiveFontColor', {
    name: game.i18n.localize("TINY.config.tabActiveFontColorName"),
    hint: game.i18n.localize("TINY.config.tabActiveFontColorHint"),
    scope: 'world',
    requiresReload: true,
    config: true,
    type: String,
    default: '#ffffff',
  });

  game.settings.register('tinyd6', 'tabHoverBgColor', {
    name: game.i18n.localize("TINY.config.tabHoverBgColorName"),
    hint: game.i18n.localize("TINY.config.tabHoverBgColorHint"),
    scope: 'world',
    requiresReload: true,
    config: true,
    type: String,
    default: '#555353',
  });

  game.settings.register('tinyd6', 'tabHoverFontColor', {
    name: game.i18n.localize("TINY.config.tabHoverFontColorName"),
    hint: game.i18n.localize("TINY.config.tabHoverFontColorHint"),
    scope: 'world',
    requiresReload: true,
    config: true,
    type: String,
    default: '#d8d1d1',
  });
  

  const root = document.querySelector(':root');
  let bgImagePath="url(../../../"+game.settings.get ("tinyd6", "bgImage")+")"
  root.style.setProperty('--bg-image',bgImagePath)
  let chatbgImagePath="url(../../../"+game.settings.get ("tinyd6", "chatBgImage")+")"
  root.style.setProperty('--chat-bg-image',chatbgImagePath)
  let listHeaderBgColor=game.settings.get ("tinyd6", "listHeaderBgColor")
  root.style.setProperty('--list-header-color',listHeaderBgColor)
  let listHeaderFontColor=game.settings.get ("tinyd6", "listHeaderFontColor")
  root.style.setProperty('--list-header-font-color',listHeaderFontColor)
  let headerFontColor=game.settings.get ("tinyd6", "headerFontColor")
  root.style.setProperty('--header-font-color',headerFontColor)
  let regularFontColor=game.settings.get ("tinyd6", "regularFontColor")
  root.style.setProperty('--list-text-color',regularFontColor)
  let inputBgColor=game.settings.get ("tinyd6", "inputBgColor")
  root.style.setProperty('--input-bg-color',inputBgColor)
  let inputFontColor=game.settings.get ("tinyd6", "inputFontColor")
  root.style.setProperty('--input-text-color',inputFontColor)
  let titleFont=game.settings.get ("tinyd6", "titleFont")
  root.style.setProperty('--font-name',titleFont) 
  let windowHeaderBgColor=game.settings.get ("tinyd6", "windowHeaderBgColor")
  root.style.setProperty('--window-header-bg-color',windowHeaderBgColor) 
  let windowHeaderFontColor=game.settings.get ("tinyd6", "windowHeaderFontColor")
  root.style.setProperty('--window-header-font-color',windowHeaderFontColor) 
  let dieRollerFontColor=game.settings.get ("tinyd6", "dieRollerFontColor")
  root.style.setProperty('--die-roller-font-color',dieRollerFontColor) 
  let dieRollerButtonFontColor=game.settings.get ("tinyd6", "dieRollerButtonFontColor")
  root.style.setProperty('--die-roller-button-font-color',dieRollerButtonFontColor) 
  let dieRollerButtonBgColor=game.settings.get ("tinyd6", "dieRollerButtonBgColor")
  root.style.setProperty('--die-roller-button-bg-color',dieRollerButtonBgColor) 
  let tabActiveBgColor=game.settings.get ("tinyd6", "tabActiveBgColor")
  root.style.setProperty('--tab-bg-color-active',tabActiveBgColor)
  let tabActiveFontColor=game.settings.get ("tinyd6", "tabActiveFontColor")
  root.style.setProperty('--tab-text-color-active',tabActiveFontColor)
  let tabHoverBgColor=game.settings.get ("tinyd6", "tabHoverBgColor")
  root.style.setProperty('--tab-bg-color-hover',tabHoverBgColor)
  let tabHoverFontColor=game.settings.get ("tinyd6", "tabHoverFontColor")
  root.style.setProperty('--tab-text-color-hover',tabHoverFontColor)
  let buttonHeaderBgColor=game.settings.get ("tinyd6", "buttonHeaderBgColor")
  root.style.setProperty('--button-bg-color',buttonHeaderBgColor)
  let buttonHeaderFontColor=game.settings.get ("tinyd6", "buttonHeaderFontColor")
  root.style.setProperty('--button-font-color',buttonHeaderFontColor)

  //ACTIVATE FLOATING DICE ROLLER


  


  //DICE FACE HELPER
  Handlebars.registerHelper("times", function(n, content)
    {
      let result = "";
      for (let i = 0; i < n; ++i)
      {
          result += content.fn(i);
      }
    
      return result;
    });
    
  Handlebars.registerHelper("face", diceToFaces);

});


Hooks.on("renderPause", () => {
  $("#pause img").attr("class", "fa-spin pause-image");
  $("#pause figcaption").attr("class", "pause-tinyd6");
});


Hooks.on('renderSettingsConfig', (app, el, data) => {
  // Insert color picker input
  el.find('[name="tinyd6.listHeaderBgColor"]').parent()
    .append(`<input type="color" value="${game.settings.get('tinyd6','listHeaderBgColor')}" data-edit="tinyd6.listHeaderBgColor">`)
  el.find('[name="tinyd6.listHeaderFontColor"]').parent()
    .append(`<input type="color" value="${game.settings.get('tinyd6','listHeaderFontColor')}" data-edit="tinyd6.listHeaderFontColor">`) 
  el.find('[name="tinyd6.headerFontColor"]').parent()
    .append(`<input type="color" value="${game.settings.get('tinyd6','headerFontColor')}" data-edit="tinyd6.headerFontColor">`)
  el.find('[name="tinyd6.regularFontColor"]').parent()
    .append(`<input type="color" value="${game.settings.get('tinyd6','regularFontColor')}" data-edit="tinyd6.regularFontColor">`)
  el.find('[name="tinyd6.inputBgColor"]').parent()
    .append(`<input type="color" value="${game.settings.get('tinyd6','inputBgColor')}" data-edit="tinyd6.inputBgColor">`)
  el.find('[name="tinyd6.inputFontColor"]').parent()
    .append(`<input type="color" value="${game.settings.get('tinyd6','inputFontColor')}" data-edit="tinyd6.inputFontColor">`)
  el.find('[name="tinyd6.windowHeaderBgColor"]').parent()
    .append(`<input type="color" value="${game.settings.get('tinyd6','windowHeaderBgColor')}" data-edit="tinyd6.windowHeaderBgColor">`)
  el.find('[name="tinyd6.windowHeaderFontColor"]').parent()
    .append(`<input type="color" value="${game.settings.get('tinyd6','windowHeaderFontColor')}" data-edit="tinyd6.windowHeaderFontColor">`)
  el.find('[name="tinyd6.dieRollerFontColor"]').parent()
    .append(`<input type="color" value="${game.settings.get('tinyd6','dieRollerFontColor')}" data-edit="tinyd6.dieRollerFontColor">`)
  el.find('[name="tinyd6.dieRollerButtonBgColor"]').parent()
    .append(`<input type="color" value="${game.settings.get('tinyd6','dieRollerButtonBgColor')}" data-edit="tinyd6.dieRollerButtonBgColor">`)
  el.find('[name="tinyd6.dieRollerButtonFontColor"]').parent()
    .append(`<input type="color" value="${game.settings.get('tinyd6','dieRollerButtonFontColor')}" data-edit="tinyd6.dieRollerButtonFontColor">`)
  el.find('[name="tinyd6.tabActiveBgColor"]').parent()
    .append(`<input type="color" value="${game.settings.get('tinyd6','tabActiveBgColor')}" data-edit="tinyd6.tabActiveBgColor">`)
  el.find('[name="tinyd6.tabActiveFontColor"]').parent()
    .append(`<input type="color" value="${game.settings.get('tinyd6','tabActiveFontColor')}" data-edit="tinyd6.tabActiveFontColor">`)
  el.find('[name="tinyd6.tabHoverBgColor"]').parent()
    .append(`<input type="color" value="${game.settings.get('tinyd6','tabHoverBgColor')}" data-edit="tinyd6.tabHoverBgColor">`)
  el.find('[name="tinyd6.tabHoverFontColor"]').parent()
    .append(`<input type="color" value="${game.settings.get('tinyd6','tabHoverFontColor')}" data-edit="tinyd6.tabHoverFontColor">`)

  el.find('[name="tinyd6.buttonHeaderBgColor"]').parent()
    .append(`<input type="color" value="${game.settings.get('tinyd6','buttonHeaderBgColor')}" data-edit="tinyd6.buttonHeaderBgColor">`)
  el.find('[name="tinyd6.buttonHeaderFontColor"]').parent()
    .append(`<input type="color" value="${game.settings.get('tinyd6','buttonHeaderFontColor')}" data-edit="tinyd6.buttonHeaderFontColor">`)
});

Hooks.on('renderChatLog', (app, html, data) => tinyChat.chatListeners(html))

Hooks.on('refreshToken', () => {

})