#!/usr/bin/env node

import { program } from "commander";
import * as commands from "./src/commands.js";

program
    .name("gm")
    .description("GitMorph - Simplified Git operations and beyond")
    .version("1.0.0");

// Register all commands
Object.entries(commands).forEach(([name, command]) => {
    program.addCommand(command);
});

program.parse(process.argv);

// If no arguments, display help
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
