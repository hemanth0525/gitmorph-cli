import { execSync } from 'child_process';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

export function runCommand(command, options = {}) {
    try {
        const output = execSync(command, { encoding: 'utf8', ...options });
        return output;
    } catch (error) {
        handleError(error);
    }
}

export function isGitRepo() {
    try {
        runCommand('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
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

export function displayBanner() {
    const banner = fs.readFileSync(path.join(__dirname, 'banner.txt'), 'utf8');
    console.log(chalk.cyan(banner));
}

export function getGlobalConfig() {
    const configPath = path.join(os.homedir(), '.gitmorph', 'config.json');
    if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
    return {};
}

export function setGlobalConfig(config) {
    const configDir = path.join(os.homedir(), '.gitmorph');
    if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
    }
    const configPath = path.join(configDir, 'config.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

export function getLocalConfig() {
    if (isGitRepo()) {
        const configPath = path.join(process.cwd(), '.gitmorph.json');
        if (fs.existsSync(configPath)) {
            return JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }
    }
    return {};
}

export function setLocalConfig(config) {
    if (isGitRepo()) {
        const configPath = path.join(process.cwd(), '.gitmorph.json');
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    } else {
        console.error(chalk.red('Error: Not a git repository'));
    }
}