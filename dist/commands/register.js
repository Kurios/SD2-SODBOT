"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterCommandHelper = exports.RegisterCommand = void 0;
var logs_1 = require("../general/logs");
var RegisterCommand = /** @class */ (function () {
    function RegisterCommand() {
    }
    //Register a new player to the BOT Database
    RegisterCommand.registerPlayer = function (message, input) {
        console.log(input[0]);
        logs_1.Logs.log("command register with Inputs " + JSON.stringify(input));
        if (input.length == 0) {
            message.reply("This command requires a EugenID to work");
        }
        else {
            var eugenid = input[0].toLowerCase();
            message.reply("Player's EugenID to be registered is " + input[0]);
            return;
        }
    };
    //Update the player details (Discord UserName and EugenID)
    RegisterCommand.updatePlayer = function (message, input) {
    };
    //Return Player details DiscordID, Discord Username, EugenID, ELO
    RegisterCommand.playerDetails = function (message, input) {
    };
    return RegisterCommand;
}());
exports.RegisterCommand = RegisterCommand;
var RegisterCommandHelper = /** @class */ (function () {
    function RegisterCommandHelper() {
    }
    RegisterCommandHelper.addCommands = function (bot) {
        //bot.registerCommand("register",RegisterCommand.registerPlayer);
        //bot.registerCommand("updateplayer",RegisterCommand.updatePlayer);
        //bot.registerCommand("playerdetails",RegisterCommand.playerDetails);
    };
    return RegisterCommandHelper;
}());
exports.RegisterCommandHelper = RegisterCommandHelper;
//# sourceMappingURL=register.js.map