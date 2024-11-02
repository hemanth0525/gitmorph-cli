import { execSync } from 'child_process';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

export function handleError(error) {
    console.error(chalk.red('Error:'), error.message);
    if (error.stderr) {
        console.error(chalk.yellow('Output:'), error.stderr.toString());
    }
    process.exit(1);
}

export function displayFeedback(message) {
    console.log(chalk.green('Success:'), message);
}

export function runCommand(command) {
    try {
        return execSync(command, { encoding: 'utf8' });
    } catch (error) {
        handleError(error);
    }
}

export function isGitRepo() {
    try {
        runCommand('git rev-parse --is-inside-work-tree');
        return true;
    } catch (error) {
        return false;
    }
}

export function createFileWithContent(filePath, content) {
    try {
        fs.writeFileSync(filePath, content);
        displayFeedback(`File created: ${filePath}`);
    } catch (error) {
        handleError(error);
    }
}

export function readFileContent(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        handleError(error);
    }
}