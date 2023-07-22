export async function RollTest({
    numberOfDice = 2,
    numberOfSides = 6,
    defaultThreshold = 5,
    focusAction = false,
    marksmanTrait = false } = {}) {

    let threshold = defaultThreshold;
    if (focusAction && (focusAction === 'true'))
    {
        threshold = threshold - 1;
    }

    if (marksmanTrait && (marksmanTrait === 'true'))
    {
        threshold = threshold - 1;
    }
    
    const rollForumla = `${numberOfDice}d${numberOfSides}cs>=${threshold}`;

    // Execute the roll
    let result = await new Roll(rollForumla, {}).evaluate({'async': true})
    let additional = await new Roll("1d6", {}).evaluate({'async': true})
    let number = Number(result.terms[0].number)
    let critEnabled = game.settings.get('tinyd6', 'enableCriticalHits');
    let botchEnabled = game.settings.get('tinyd6', 'enableCriticalFailure');
    let sixes=0;
    let ones= 0;
    let bCrit=false;
    let bBotch=false;
    //Evaluate Crit
    for (let i = 0; i < number; i++) {
        if (result.terms[0].results[i].result == 6){sixes++}
        if (result.terms[0].results[i].result == 1){ones++}
    }
    if (number >= 2){
        if (sixes==number){
            bCrit=true;
        }
    }
    else{
        if (sixes==number){
            if (additional._total == 6){
                bCrit=true;
            }
        }        

    }
    if (ones==number){
        bBotch=true;
    }
    let renderedRoll = await renderTemplate("systems/tinyd6/templates/partials/test-result.hbs", { 
        rollResult: result, 
        nDice: number, 
        critEnabled: critEnabled, 
        botchEnabled: botchEnabled,
        bCrit:bCrit, 
        bBotch:bBotch});
    // let renderedRoll = await result.render({ result: result, template: "systems/tinyd6/templates/partials/test-result.hbs" });

    const chatData = {
        speaker: ChatMessage.getSpeaker(),
        content: renderedRoll
    };
    result.toMessage(chatData);
}

export function setFocusOption(form, element) {
    form.find(".die-roller > .roll-dice").each((n, tag) => {
        tag.dataset.enableFocus = element.checked
    });

    if (element.checked)
    {
        form.find(".action-modifiers .toggle-marksman").prop("disabled", false);
    }
    else
    {
        const marksmanElement = form.find(".action-modifiers .toggle-marksman");
        marksmanElement.prop("checked", false);
        marksmanElement.prop("disabled", true);
    }
}

export function setMarksmanOption(form, element)
{
    form.find(".die-roller > .roll-dice").each((n, tag) => {
        tag.dataset.enableMarksman = element.checked;
    });
}

export function diceToFaces(value, content)
{
    switch (value)
    {
        case 1:
            return "fa-dice-one";
        case 2:
            return "fa-dice-two";
        case 3:
            return "fa-dice-three";
        case 4:
            return "fa-dice-four";
        case 5:
            return "fa-dice-five";
        case 6:
            return "fa-dice-six";
    }

    return "fa-dice-d6";
}