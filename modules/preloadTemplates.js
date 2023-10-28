export const preloadHandlebarsTemplates = async function () {
    const templatePaths = [
      "/systems/tinyd6/templates/actors/parts/general.html",
      "/systems/tinyd6/templates/actors/parts/inventory.html",
      "/systems/tinyd6/templates/actors/parts/general_NPC.html",
      "/systems/tinyd6/templates/actors/parts/general_Vehicle.html",
      "/systems/tinyd6/templates/actors/parts/general_Spaceship.html",
      "/systems/tinyd6/templates/actors/parts/general_Ship.html",
      "/systems/tinyd6/templates/actors/parts/Cargo_Ship.html",
      "/systems/tinyd6/templates/actors/parts/Crew_Ship.html",
      "/systems/tinyd6/templates/actors/parts/notes.html"
    ];
        return loadTemplates(templatePaths);
};