#!/usr/bin/env node

import { program } from "commander";
import * as commands from "./src/commands.js";
import { displayBanner } from "./src/utils.js";

displayBanner();

program
    .name("gm")
    .description("GitMorph - Advanced Git operations and developer productivity tool")
    .version("1.0.2");

// Register all commands
Object.entries(commands).forEach(([name, command]) => {
    program.addCommand(command);
});

program.parse(process.argv);

// If no arguments, display help
if (!process.argv.slice(2).length) {
    program.outputHelp();
}