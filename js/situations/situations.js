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
        return [str1];
    }

    getChoices(scene, temp) {
        let choices = [ new Choice("ford", "Ford the river") ];
        if(!temp.failedToFindAWayAround) {
            choices.push(new Choice("around", "Find a way around\n{time}"));
        }
        if(scene.vars.boat) {
            choices.push(new Choice("boat", "Use your boat to cross the river"));
        }
        return choices;
    }

    choose(choice, scene, temp) {
        if(choice.id == "ford") {
            scene.hurt(Math.ceil(Math.random() * 25));
            let str1 = "You forded your way across the river, sustaining damage along the way.";
            if(Math.random() < 0.5) {
                scene.vars.people--;
                str1 += "\n_A member of your group was washed away in the strong currents. -1{person}_";
            }
            return new Result(true, [str1]);
        }
        if(choice.id == "around") {
            if(Math.random() < 0.33) {
                return new Result(true, ["You successfully found a way around the river."]);
            } else {
                temp.failedToFindAWayAround = true;
                scene.spendTime();
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