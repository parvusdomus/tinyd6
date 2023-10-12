export async function DiceRoll(rollType, focus, defense)
{
    let tirada= ""
    let testResult=""
    let nExitos=0
    let nUnos=0
    let nSeises=0
    let rollText=""
    let dados=[];
    let nDice=0;
    let actor_id = ChatMessage.getSpeaker().actor;
    switch (rollType){
        case 'ventaja':
        {
          nDice=3;
          break;
        }
        case 'normal':
        {
            nDice=2;
            break;
        }
        case 'desventaja':
        {
            nDice=1;
            break;
        }

    }
    let difficulty=5;
    if (focus==true){
        difficulty=4;
    }
    if (defense=true){
        
    }
    let actor = game.actors.get(ChatMessage.getSpeaker().actor);
    tirada=nDice+"d6"
    rollText="<label>"+tirada+" VS "+difficulty+"</label>"
    let d6Roll = await new Roll(String(tirada)).roll({async: false});
    let critEnabled = game.settings.get('tinyd6', 'enableCritical');
    console.log ("CRIT ENABLED")
    console.log (critEnabled)
    let additional = await new Roll("1d6", {}).evaluate({'async': true});
    console.log ("ADDITIONAL")
    console.log (additional._total)
    for (let i = 0; i < nDice; i++) {
        if (d6Roll.terms[0].results[i].result >= difficulty){nExitos++}
        if (d6Roll.terms[0].results[i].result == 1){nUnos++}
        if (d6Roll.terms[0].results[i].result == 6){nSeises++}
        dados.push(d6Roll.terms[0].results[i].result);
    }
    if (nExitos >= 1){
        testResult="<h3 class=\"regular-success\">"+game.i18n.localize("TINY.ui.regularSuccess")+"</h3>"
        if ((nSeises == Number(nDice)) && (critEnabled==true) && (Number(nDice)>1)){

            testResult="<h3 class=\"critical-success\">"+game.i18n.localize("TINY.ui.criticalSuccess")+"</h3>"
        }
        else{
            if (additional._total == 6){
                testResult="<h3 class=\"critical-success\">"+game.i18n.localize("TINY.ui.criticalSuccess")+"</h3>"
            }
        }
    }
    else{
        testResult="<h3 class=\"regular-failure\">"+game.i18n.localize("TINY.ui.regularFailure")+"</h3>"
    }
    if ((nUnos >= nDice) && (critEnabled==true)){
        testResult="<h3 class=\"critical-failure\">"+game.i18n.localize("TINY.ui.criticalFailure")+"</h3>"
    }

    let renderedRoll = await renderTemplate("systems/tinyd6/templates/chat/test-result.html", { 
        rollResult: d6Roll, 
        actor_id: actor_id,
        dados:dados,
        nDice: nDice,
        rollText: rollText,
        nDiff: difficulty,
        canSpendKarma: false,
        testResult: testResult
    });

    const chatData = {
        speaker: ChatMessage.getSpeaker(),
        content: renderedRoll
    };

    d6Roll.toMessage(chatData);
    return;
}

export function diceToFaces(value, content)
{
    switch (Number(value))
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