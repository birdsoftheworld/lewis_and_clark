import { Util } from "../util/util.js";

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
        let choices = [ new Choice("ice", "Cross the ice") ];
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
        if(choice.id === "ice") {
            return new Result(true, ["You carefully make your way across the ice."]);
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
        if(choice.id === "wait" || choice.id === "heal") {
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
            this.scene.spendTime(this.camping, false);
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
            choices.push(new Choice("heal", "Tend to the wounded\n{health}{time}"));
        }
        if(this.areAnimals()) {
            choices.push(new Choice("hunt", "Hunt the animals\n{food}{time}"));
        }
        return choices;
    }

    getChoices() {
        if(this.scene.vars.season === 0 && this.scene.vars.day === 0) {
            this.hunted = false;
        }

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

class NativeSettlementSituation extends Situation {
    constructor(scene) {
        super(scene);
        this.stage = "meeting";
        this.meetingCount = Math.ceil(Math.random() * 3);
        if(Math.random() < 1 / this.scene.magicKarma) {
            this.meetingType = "hostile";
            this.attackChance = 0.5;
        } else {
            this.meetingType = "friendly";
            this.attackChance = 1 / this.scene.magicKarma;
        }
    }

    isPlural() {
        return this.meetingCount > 1;
    }

    getText() {
        if(this.stage === "meeting") {
            let str1 = "Ahead, you see a settlement, likely that of one of the native tribes.";
            let str2 = `${Util.capitalizeFirstLetter(Util.getEnglishWordForNumber(this.meetingCount))} ${this.isPlural()? "people ride" : "person rides"} up to your group on ${this.isPlural()? "horses" : "a horse"}.`;
            if(this.meetingType === "hostile") {
                str2 += "\nThey seem suspicious of you.";
            } else if(this.meetingType === "friendly") {
                str2 += "\nThey seem indifferent towards you.";
            }

            return [str1, str2];
        } else if(this.stage === "communication") {
            return [ "They ask you to put your weapons down." ];
        } else if(this.stage === "attack") {
            return [ "You come out of the fight as the victor. You decide not to risk further conflict, and continue." ];
        } else if(this.stage === "camp") {
            return [ "You are in the native settlement." ];
        }
    }

    getMeetingChoices() {
        return [ new Choice("communicate", "Talk with them"), new Choice("attack", "Attack them"), new Choice("run", "Run away") ];
    }

    getCommunicationChoices() {
        return [ new Choice("comply", "Comply"), new Choice("weapons", "Keep holding your weapons"), new Choice("run", "Run away") ];
    }

    getCampChoices() {
        let choices = [
            new Choice("camp_continue", "Leave"),
            new Choice("wait", "Wait\n{time}")
        ];

        if(this.scene.vars.health < 100) {
            choices.push(new Choice("heal", "Tend to the wounded\n{health}{time}"));
        }

        return choices;
    }

    getChoices() {
        switch(this.stage) {
            case "meeting":
                return this.getMeetingChoices();
            case "communication":
                return this.getCommunicationChoices();
            case "attack":
                return [ new Choice("attack_leave", ["Leave"]) ];
            case "camp":
                return this.getCampChoices();
        }
    }

    dealDamage(multiplier) {
        this.scene.hurt(multiplier * 20);
    }

    attack(firstStrike, surprise) {
        this.stage = "attack";
        let selfDamageMultiplier = this.meetingCount;

        if(this.meetingType === "friendly") {
            selfDamageMultiplier *= 0.75;
        }

        if(firstStrike) {
            if(this.meetingType === "friendly") {
                this.changeKarma(-2);
            } else {
                this.changeKarma(-1);
            }
            selfDamageMultiplier *= 0.5;
            this.dealDamage(selfDamageMultiplier);
            return new Result(false, [ `Before the ${Util.getEnglishWordForNumber(this.meetingCount)} in front of you ${this.isPlural()? "have" : "has"} time to react, you decide to make the first move and attack.` ]);
        }

        if(surprise) {
            selfDamageMultiplier *= 1.5;
            this.dealDamage(selfDamageMultiplier);
            return new Result(false, [ `As soon as you put down your weapons, the ${Util.getEnglishWordForNumber(this.meetingCount)} in front of you attack${this.isPlural()? "" : "s"}.` ]);
        }

        this.dealDamage(selfDamageMultiplier);
        return new Result(false, [ `The natives consider your act of not putting down your weapons as a sign of hostility, and attack.` ]);
    }

    communicate() {
        this.stage = "communication";
        return new Result(false, `*Lewis* talks to the native${this.isPlural()? "s" : ""}.`);
    }

    comply() {
        this.changeKarma(1);

        if(this.meetingType === "hostile") {
            if(Math.random() < 2 / this.scene.vars.magicKarma) {
                return this.attack(false, true);
            }
        } else if(this.meetingType === "friendly") {
            if(Math.random() < 1 / this.scene.vars.magicKarma) {
                return this.attack(false, true);
            }
        }

        this.stage = "camp";
        let text = [
            `The native${this.isPlural()? "s" : ""} recognize${this.isPlural()? "" : "s"} your sign of peace, and dismount${this.isPlural()? "" : "s"} their horse${this.isPlural()? "s" : ""}.`,
            `They introduce themselves, and generously invite you to stay within their settlement.`
        ];

        return new Result(false, text);
    }

    keepWeapons() {
        this.changeKarma(-0.5);
        if(this.meetingType === "hostile") {
            if(Math.random() < 8 / this.scene.vars.magicKarma) {
                return this.attack(false, false);
            }
        } else {
            if(Math.random() < 4 / this.scene.vars.magicKarma) {
                return this.attack(false, false);
            }
        }
        return new Result(true, [ "Seeing that you did not put your weapons down, the natives flee. You continue onwards." ]);
    }

    changeKarma(amount) {
        this.scene.vars.magicKarma = Math.max(1, this.scene.vars.magicKarma + amount);
    }

    choose(choice) {
        switch(choice.id) {
            case "run":
                return new Result(true, "You decide to run before any harm might come to you.");
            case "attack":
                return this.attack(true, false);
            case "communicate":
                return this.communicate();
            case "comply":
                return this.comply();
            case "weapons":
                return this.keepWeapons();
            case "attack_leave":
                return new Result(true, ["You move onwards."]);
            case "camp_continue":
                return new Result(true, "You leave the settlement.");
            case "heal":
                this.scene.vars.health = Math.min(100, this.scene.vars.health + 50);
                this.scene.spendTime(true, true);
                return new Result(false, ["You spend time healing those in poor condition. The natives seem willing to help."]);
            case "wait":
                this.scene.spendTime(true, true);
                return new Result(false, ["You wait."]);
        }
    }
}

class MountainSituation extends Situation {

}

export { RiverSituation, MeadowSituation, NativeSettlementSituation};