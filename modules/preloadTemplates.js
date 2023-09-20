export const preloadHandlebarsTemplates = async function () {
    const templatePaths = [
      "/systems/tinyd6/templates/actors/parts/general.html"
    ];
        return loadTemplates(templatePaths);
};