import { Message, MessageEmbed } from "discord.js";
import { CommonUtil } from "../general/common";
import { DiscordBot, MsgHelper } from "../general/discordBot";
import { DeckParser } from "sd2-utilities/lib/parser/deckParser"
import { SqlHelper } from "../general/sqlHelper";
import { Logs } from "../general/logs";



export class MiscCommand {

    static sodbotReplies = [
        "hit! Target destroyed!",
        "miss! Mission failed. We'll get em next time!",
        "miss! Are you even trying to hit anymore?",
        "oh come on, that shot was pathetic... Put your back into it!",
        "ping! Your shot bounced!",
        "you miss 100% of the shots you don't take. Or in your case, 100% of those that you do as well...",
        "miss! Your shot couldn't hit the broad side of a barn!",
        "miss! Come on bruh, just boogaloo it",
        "another miss! Your aim is like Gonzo's analysis....lacking",
        "miss! This piat is rubbish, just use your Sherman",
        "miss! Just side shot it bro",
        "miss! I know you will try again, like proto who always came back for another shot",
        "hit!, He's Burning",
        "hit!, Jerry's in trouble now",
        "bounce!, you do know that is a King Tiger right?",
        "hit! We're Airborne. We don't start fights, we finish 'em!",
        "hit! Your name is unknown. Your deed is immortal.",
        "hit! Up the Ox and Bucks. Up the Ox and Bucks.",
        "miss! You know every time you salute the Captain, you make him a target for the Germans. So do us a favor, don't do it. Especially when I'm standing next to him, capisce?"
      ];


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static flip(message: Message, input: string[]): void {
        if (Math.random() > 0.5) {
            MsgHelper.reply(message, "Heads");
        } else {
            MsgHelper.reply(message, "Tails");
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static faction(message: Message, input: string[]): void {
        if (Math.random() > 0.5) {
            MsgHelper.reply(message, "Axis");
        } else {
            MsgHelper.reply(message, "Allied");
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static help(message: Message, input: string[]): void {
        const embed = new MessageEmbed()
            .setTitle("Help")
            .setDescription("prefix commands with " + CommonUtil.config('prefix'))
            .addFields([
                { name: "Maps", value: "rdiv (axis|allies): get a random division from unbanned pool", inline: true },
                {
                    name: "Divisions", value:
                        "rmap (axis|allies): get a random division from unbanned pool. Can be filtered by allied/axis \n" +
                        "divisions", inline: true
                },
                { name: "Misc", value: '', inline: true }
            ])
        message.channel.send(embed);
    } 

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static piat(message: Message, input: string[]): void {
        const name = message.author.username;
        const k = Math.random();
        const i = Math.random();
        if (i > 0.95){
            MsgHelper.reply(
                message,
                MiscCommand.sodbotReplies[Math.floor(Math.random() * MiscCommand.sodbotReplies.length)],
                true
            );
        } else if (i > 0.005) {
            MsgHelper.reply(message, "Miss!");
            return;
        } else {
            k < 0.7
                ? (MsgHelper.reply(message, `You hit!`, true),
                    setTimeout(() => {
                        MsgHelper.reply(message, `Just kidding, you didn't.`, true);
                    }, 5000))
                : (MsgHelper.say(
                    message,
                    `Private ${name} has dishonored himself and dishonored the discord. I have tried to help him. But I have failed.`,
                    true
                ),
                    setTimeout(() => {
                        MsgHelper.say(
                            message,
                            `I have failed because YOU have not helped me. YOU people have not given Private ${name} the proper motivation! `,
                            true
                        );
                        setTimeout(() => {
                            MsgHelper.say(
                                message,
                                `So, from now on, whenever Private ${name} fucks up, I will not punish him! I will punish all of YOU!`,
                                true
                            );
                            setTimeout(() => {
                                MsgHelper.say(
                                    message,
                                    `And the way I see it ladies, you owe me for ONE JELLY DOUGHNUT! NOW GET ON YOUR FACES!`,
                                    true
                                );
                            }, 10000);
                        }, 10000);
                    }, 10000));
                }
    }

    static deck(message: Message, input: string[]): void {
        let embed = new MessageEmbed();
        if(String.length > 0){
            const deck = DeckParser.parse(input[0])
            embed = embed.setTitle(deck.division);
            embed = embed.setDescription(deck.income);
            const a = [];
            const b = [];
            const c = [];
            for(const unit of deck.units){
                let u = "";
                if(unit.count > 1){
                    u += unit.count + "x "
                }
                u += unit.name;
                if(unit.raw.transportid != -1){
                    u += " in " + unit.transport
                }
                if( unit.xp == 1) u += " ☆"
                if( unit.xp == 2) u += " ☆☆"
                if(unit.phase == 0){
                    a.push(u)
                }else if(unit.phase == 1){
                    b.push(u)
                }else if(unit.phase == 2){
                    c.push(u)
                }
            }
            let astr = "";
            for(const i of a){
                astr += i + "\n"
            }
            let bstr = ''
            for(const i of b){
                bstr += i + "\n"
            }
            let cstr = ""
            for(const i of c){
                cstr += i + "\n"
            }
            embed = embed.addField("A Phase",astr,true)
            embed = embed.addField("B Phase",bstr,true)
            embed = embed.addField("C Phase",cstr,true)
            embed = embed.setFooter("counts are in # of cards, not # of units")
            message.channel.send(embed);
        }
    }

    //Register a player to the bot
    static register(message:Message, input:string[]):void{
        if(input.length == 1 && Number(input[0])){
            (async () => {
                let user = await SqlHelper.getDiscordUserFromEugenId(Number(input[0]))
                if(user){
                    if(user.id = message.author.id){
                        MsgHelper.reply(message,"you are already registered to Eugen account " + input[0])
                        Logs.log("Eugen account "+ input[0] + "is already registered to user " + user.id )
                    }else{
                        user.id =(message.author.id)
                        await SqlHelper.setDiscordUser(user);
                        MsgHelper.reply(message,"Eugen account " + input[0] + " has been updated to your discord userid")
                        Logs.log("Changed eugen account "+ input[0] + " to user " + user.id )
                    }
                }else{
                    console.log(Number(message.author.id))
                    user = {
                        id: (message.author.id),
                        playerId: Number(input[0]),
                        serverAdmin: [],
                        globalAdmin: false,
                        impliedName: message.author.username
                    }
                    await SqlHelper.setDiscordUser(user);
                    MsgHelper.reply(message,"Eugen account " + input[0] + " has been added to the Player Database and connected to your Discord userid")
                    Logs.log("Added eugen account "+ input[0] + " to user " + user.id )
                }
            })()
        }
    }
}

export class MiscCommandHelper {
    static addCommands(bot: DiscordBot): void {
        bot.registerCommand("flip", MiscCommand.flip);
        bot.registerCommand("faction", MiscCommand.faction);
        bot.registerCommand("help", MiscCommand.help);
        bot.registerCommand("piat",MiscCommand.piat);
        bot.registerCommand("deck",MiscCommand.deck);
        bot.registerCommand("register",MiscCommand.register)
    }
}
