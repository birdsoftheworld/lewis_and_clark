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
    constructor(scene) {
        this.scene = scene;
    }

    getText() {
        
    }

    getChoices() {
        
    }

    choose(choice) {
        
    }
}

class RiverSituation extends Situation {
    getText() {
        let str1;
        if(this.scene.vars.season === 3) {
            str1 = "You come across a large river, frozen over by the cold.";
        } else {
            str1 = "You come across a large river blocking your path.";
        }
        return [str1];
    }

    getWinterChoices() {
        let choices = [ new Choice("ice_risky", "Cross the ice quickly"), new Choice("ice_careful", "Cross the ice carefully\n{time}") ];
        return choices;
    }

    getNormalChoices() {
        let choices = [ new Choice("ford", "Ford the river") ];
        if(!this.failedToFindAWayAround) {
            choices.push(new Choice("around", "Find a way around\n{time}"));
        }
        if(this.scene.vars.boat) {
            choices.push(new Choice("boat", "Use your boat to cross the river"));
        }
        return choices;
    }

    getChoices() {
        if(this.scene.vars.season === 3) {
            return this.getWinterChoices();
        }

        return this.getNormalChoices();
    }

    choose(choice) {
        if(choice.id === "ford") {
            this.scene.hurt(15, "river");
            let str1 = "You ford your way across the river, sustaining damage along the way.";
            if(Math.random() < 0.5) {
                this.scene.vars.people--;
                str1 += "\n_A member of your group was washed away in the strong currents. -1{person}_";
            }
            return new Result(true, [str1]);
        }
        if(choice.id === "around") {
            this.scene.spendTime(false, false);
            if(this.scene.vars.season === 3) {
                return new Result(true, ["As you are looking for a way around the river, Winter arrives, freezing the water and allowing you to cross."]);
            }
            if(Math.random() < 0.33) {
                return new Result(true, ["You successfully find a way around the river."]);
            } else {
                this.failedToFindAWayAround = true;
                return new Result(false, ["There is no other way around the river."]);
            }
        }
        if(choice.id === "boat") {
            let text = ["You and your crew boat across the river."];
            if(Math.random() < 0.5) {
                this.scene.vars.boat = false;
                text.push("Unfortunately, as you get to the other side, your boat falls to pieces.");
            }
            return new Result(true, text);
        }
        if(choice.id === "ice_risky") {
            let text = ["You decide to make your way across the ice as quickly as possible."];
            if(Math.random() < 0.33) {
                let killed = Math.ceil(Math.random() * 3);
                text.push(`_As you cross, the ice breaks beneath you. You are severely injured. ${killed} people are caught beneath the ice. -${killed}{person}_`);
                this.scene.hurt(30, "frozen_river");
                return new Result(true, text);
            }
        }
        if(choice.id === "ice_careful") {
            return new Result(true, ["You make your way across the ice carefully, being sure not to break it."]);
        }
    }
}

class MeadowSituation extends Situation {
    getText() {
        let str1;
        if(this.camping) {
            str1 = "Your group is camping in a large field.";
        } else if(this.scene.vars.season === 3) {
            str1 = "Your group enters a large field, covered in snow.";
        } else {
            str1 = "Your group enters a large meadow.";
        }

        if(this.areAnimals()) {
            str1 += "\nThere is a herd of animals here.";
        }
        return [str1];
    }

    choose(choice) {
        if(choice.id === "wait" || choice.id === "heal" || choice.id === "hunt") {
            this.scene.spendTime(this.camping, false);
        }
        if(choice.id === "heal") {
            this.scene.vars.health = Math.min(100, this.scene.vars.health + 30);
            return new Result(false, ["You spend time healing those in poor condition."]);
        }
        if(choice.id === "wait") {
            return new Result(false, ["You wait in your camp."]);
        }
        if(choice.id === "camp") {
            this.camping = true;
            return new Result(false, ["Your group sets up camp in the middle of the field."]);
        }
        if(choice.id === "hunt") {
            this.hunted = true;
            this.scene.vars.food = Math.min(100, this.scene.vars.food + 75);
            return new Result(false, ["You hunt the animals, gaining a surplus of food. +{food}"]);
        }
        if(choice.id === "continue") {
            return new Result(true, ["You leave the field and continue on your journey."]);
        }
        if(choice.id === "camp_continue") {
            return new Result(true, ["You leave your camp and continue onwards."]);
        }
    }

    areAnimals() {
        return this.scene.vars.season !== 3 && !this.hunted;
    }

    getCampingChoices() {
        let choices = [ new Choice("camp_continue", "Leave the camp"), new Choice("wait", "Wait\n{time}") ];
        if(this.scene.vars.health < 100) {
            choices.push(new Choice("heal", "Tend to the wounded\n{time}"));
        }
        if(this.areAnimals()) {
            choices.push(new Choice("hunt", "Hunt the animals\n{food}{time}"));
        }
        return choices;
    }

    getChoices() {
        if(this.camping) {
            return this.getCampingChoices();
        }

        let choices = [ new Choice("continue", "Continue onwards"), new Choice("camp", "Set up camp") ];

        if(this.areAnimals()) {
            choices.push(new Choice("hunt", "Hunt the animals\n{food}{time}"));
        }

        return choices;
    }
}

export { RiverSituation, MeadowSituation };