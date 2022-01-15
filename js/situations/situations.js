class Result {
    constructor(success, text) {
        this.success = success;
        this.text = text;
    }
}

class Choice {
    constructor(id, text) {
        this.id = id;
        this.text = text;
    }
}

class Situation {
    constructor() {

    }

    getText(scene, temp) {
        
    }

    getChoices(scene, temp) {
        
    }

    choose(choice, scene, temp) {
        
    }
}

class RiverSituation extends Situation {
    getText(scene, temp) {
        let str1 = "You come across a large river blocking your path.";
        let str2 = "You can try to find a way around, or test your luck and ford the river.";
        if(scene.vars.boat) {
            str2 += "\nYou also have a boat you can use to get across safely.";
        }
        return [str1, str2];
    }

    getChoices(scene, temp) {
        let choices = [ new Choice("ford", "Ford the river") ];
        if(!temp.failedToFindAWayAround) {
            choices.push(new Choice("around", "Find a way around"));
        }
        if(scene.vars.boat) {
            choices.push(new Choice("boat", "Use your boat to cross the river"));
        }
        return choices;
    }

    choose(choice, scene, temp) {
        if(choice.id == "ford") {
            scene.hurt(Math.ceil(Math.random() * 25));
            let text = ["You forded your way accross the river, sustaining damage along the way."];
            if(Math.random() < 0.33) {
                scene.vars.people--;
                text.push("As you made it to the other side, you turned to see a member of your group being washed away.");
            }
            return new Result(true, text);
        }
        if(choice.id == "around") {
            if(Math.random() < 0.33) {
                return new Result(true, ["You successfully found a way around the river."]);
            } else {
                temp.failedToFindAWayAround = true;
                scene.consumeFood();
                return new Result(false, ["There is no other way around the river."]);
            }
        }
        if(choice.id == "boat") {
            let text = ["You and your crew boated across the river."];
            if(Math.random() < 0.5) {
                scene.vars.boat = false;
                text.push("Unfortunately, as you got to the other side, your boat fell to pieces.");
            }
            return new Result(true, text);
        }
    }
}

export { RiverSituation };