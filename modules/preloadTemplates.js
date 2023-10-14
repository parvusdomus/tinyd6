export const preloadHandlebarsTemplates = async function () {
    const templatePaths = [
      "/systems/tinyd6/templates/actors/parts/general.html",
      "/systems/tinyd6/templates/actors/parts/inventory.html",
      "/systems/tinyd6/templates/actors/parts/general_NPC.html"
    ];
        return loadTemplates(templatePaths);
};