export const preloadHandlebarsTemplates = async function () {
    const templatePaths = [
      "/systems/tinyd6/templates/actors/parts/general.html",
      "/systems/tinyd6/templates/actors/parts/inventory.html"
    ];
        return loadTemplates(templatePaths);
};