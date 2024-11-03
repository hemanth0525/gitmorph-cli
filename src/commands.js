import { Command } from 'commander';
import {
    runCommand,
    displayFeedback,
    isGitRepo,
    createFileWithContent,
    readFileContent,
    getGlobalConfig,
    setGlobalConfig,
    getLocalConfig,
    setLocalConfig
} from './utils.js';
import chalk from 'chalk';
import fs from 'fs';
import inquirer from 'inquirer';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

// Git Commands

export const init = new Command('init')
    .description('Initialize a new Git repository')
    .option('-b, --branch <name>', 'Specify the initial branch name')
    .action((options) => {
        const command = options.branch ? `git init -b ${options.branch}` : 'git init';
        runCommand(command);
        displayFeedback('Git repository initialized successfully.');
    });

export const clone = new Command('clone')
    .description('Clone a repository')
    .argument('<url>', 'Repository URL')
    .option('-b, --branch <name>', 'Specify a branch to clone')
    .option('-d, --depth <number>', 'Create a shallow clone with a specified depth')
    .action((url, options) => {
        let command = `git clone ${url}`;
        if (options.branch) command += ` -b ${options.branch}`;
        if (options.depth) command += ` --depth ${options.depth}`;
        runCommand(command);
        displayFeedback(`Repository cloned successfully from ${url}`);
    });

export const stage = new Command('stage')
    .description('Stage files')
    .argument('<files>', 'Files to stage')
    .action((files) => {
        runCommand(`git add ${files}`);
        displayFeedback(`File(s) ${files} staged successfully.`);
    });

export const save = new Command('save')
    .description('Commit changes')
    .argument('<message>', 'Commit message')
    .option('-a, --all', 'Automatically stage files that have been modified and deleted')
    .action((message, options) => {
        let command = 'git commit';
        if (options.all) command += ' -a';
        command += ` -m "${message}"`;
        runCommand(command);
        displayFeedback(`Changes committed with message: '${message}'`);
    });

export const upload = new Command('upload')
    .description('Push to remote')
    .option('-b, --branch <name>', 'Specify the branch to push')
    .action((options) => {
        let command = 'git push';
        if (options.branch) command += ` origin ${options.branch}`;
        runCommand(command);
        displayFeedback('Changes pushed to remote successfully.');
    });

export const download = new Command('download')
    .description('Pull from remote')
    .option('-b, --branch <name>', 'Specify the branch to pull')
    .action((options) => {
        let command = 'git pull';
        if (options.branch) command += ` origin ${options.branch}`;
        runCommand(command);
        displayFeedback('Changes pulled from remote successfully.');
    });

export const status = new Command('status')
    .description('Check status')
    .option('-s, --short', 'Give the output in the short-format')
    .action((options) => {
        let command = 'git status';
        if (options.short) command += ' -s';
        console.log(runCommand(command));
    });

export const history = new Command('history')
    .description('Check log')
    .option('-n, --number <number>', 'Limit the number of commits to output')
    .option('--oneline', 'Show each commit on a single line')
    .action((options) => {
        let command = 'git log';
        if (options.number) command += ` -n ${options.number}`;
        if (options.oneline) command += ' --oneline';
        console.log(runCommand(command));
    });

export const branch = new Command('branch')
    .description('Create a new branch')
    .argument('<name>', 'Branch name')
    .action((name) => {
        runCommand(`git branch ${name}`);
        displayFeedback(`Branch '${name}' created successfully.`);
    });

export const switch_ = new Command('switch')
    .description('Switch to a different branch')
    .argument('<branch>', 'Branch name')
    .action((branch) => {
        runCommand(`git checkout ${branch}`);
        displayFeedback(`Switched to branch '${branch}' successfully.`);
    });

export const merge = new Command('merge')
    .description('Merge branches')
    .argument('<branch>', 'Branch to merge')
    .action((branch) => {
        runCommand(`git merge ${branch}`);
        displayFeedback(`Branch '${branch}' merged successfully.`);
    });

export const delete_ = new Command('delete')
    .description('Delete a branch')
    .argument('<branch>', 'Branch to delete')
    .option('-f, --force', 'Force deletion of branch')
    .action((branch, options) => {
        let command = `git branch -d ${branch}`;
        if (options.force) command = `git branch -D ${branch}`;
        runCommand(command);
        displayFeedback(`Branch '${branch}' deleted successfully.`);
    });

export const stash = new Command('stash')
    .description('Stash changes')
    .option('-m, --message <message>', 'Stash with a message')
    .action((options) => {
        let command = 'git stash';
        if (options.message) command += ` push -m "${options.message}"`;
        runCommand(command);
        displayFeedback('Changes stashed successfully.');
    });

export const applyStash = new Command('apply-stash')
    .description('Apply stashed changes')
    .option('-i, --index <index>', 'Apply a specific stash by index')
    .action((options) => {
        let command = 'git stash apply';
        if (options.index) command += ` stash@{${options.index}}`;
        runCommand(command);
        displayFeedback('Stashed changes applied successfully.');
    });

export const rebase = new Command('rebase')
    .description('Rebase current branch')
    .argument('<branch>', 'Branch to rebase onto')
    .action((branch) => {
        runCommand(`git rebase ${branch}`);
        displayFeedback(`Current branch rebased onto '${branch}' successfully.`);
    });

// Beyond Git Commands

export const createIgnore = new Command('create-ignore')
    .description('Create a .gitignore file with common patterns')
    .option('-a, --all', 'Include all patterns')
    .action(async (options) => {
        const ignorePatterns = {
            node: '# Node\nnode_modules/\nnpm-debug.log\nyarn-error.log\n',
            python: '# Python\n__pycache__/\n*.py[cod]\n',
            java: '# Java\n*.class\n*.jar\n',
            // Add more patterns as needed
        };

        let selectedPatterns;

        if (options.all) {
            selectedPatterns = Object.keys(ignorePatterns);
        } else {
            const answers = await inquirer.prompt([
                {
                    type: 'checkbox',
                    name: 'patterns',
                    message: 'Select the patterns you want to include in your .gitignore:',
                    choices: Object.keys(ignorePatterns),
                },
            ]);
            selectedPatterns = answers.patterns;
        }

        let ignoreContent = '# GitMorph generated .gitignore\n\n';
        selectedPatterns.forEach((pattern) => {
            ignoreContent += ignorePatterns[pattern] + '\n';
        });

        createFileWithContent('.gitignore', ignoreContent.trim());
        console.log('.gitignore file created successfully with selected patterns.');
    });

export const analyze = new Command('analyze')
    .description('Analyze repository statistics')
    .action(() => {
        if (!isGitRepo()) {
            console.error(chalk.red('Error: Not a git repository'));
            return;
        }

        const totalCommits = runCommand('git rev-list --count HEAD').trim();
        const contributors = runCommand('git shortlog -sn --no-merges').trim();
        const mostChangedFiles = runCommand('git log --pretty=format: --name-only | sort | uniq -c | sort -rg | head -10').trim();

        console.log(chalk.blue('Repository Analysis:'));
        console.log(chalk.yellow('Total Commits:'), totalCommits);
        console.log(chalk.yellow('\nTop Contributors:'));
        console.log(contributors);
        console.log(chalk.yellow('\nMost Changed Files:'));
        console.log(mostChangedFiles);
    });

export const todo = new Command('todo')
    .description('List or add TODO comments in your code')
    .option('-a, --add <task>', 'Add a new TODO')
    .option('-l, --list', 'List all TODOs')
    .action((options) => {
        const todoFile = '.gm_todos';

        if (options.add) {
            const todo = `TODO: ${options.add}`;
            fs.appendFileSync(todoFile, todo + '\n');
            displayFeedback(`Added TODO: ${options.add}`);
        }

        if (options.list || !options.add) {
            if (fs.existsSync(todoFile)) {
                const todos = fs.readFileSync(todoFile, 'utf8');
                console.log(chalk.yellow('TODOs:'));
                console.log(todos);
            } else {
                console.log(chalk.yellow('No TODOs found.'));
            }
        }
    });

export const scaffold = new Command('scaffold')
    .description('Scaffold a basic project structure')
    .argument('<type>', 'Project type (e.g., node, react)')
    .action((type) => {
        const structures = {
            node: [
                'src/',
                'test/',
                'src/index.js',
                'test/index.test.js',
                'package.json',
                'README.md',
            ],
            react: [
                'src/',
                'public/',
                'src/App.js',
                'src/index.js',
                'public/index.html',
                'package.json',
                'README.md',
            ],
        };

        if (!structures[type]) {
            console.error(chalk.red(`Error: Unsupported project type '${type}'`));
            return;
        }

        structures[type].forEach((item) => {
            if (item.endsWith('/')) {
                fs.mkdirSync(item, { recursive: true });
                displayFeedback(`Created directory: ${item}`);
            } else {
                createFileWithContent(item, '');
            }
        });

        displayFeedback(`${type} project structure scaffolded successfully.`);
    });

export const search = new Command('search')
    .description('Search for a string in all files')
    .argument('<query>', 'Search query')
    .option('-i, --ignore-case', 'Ignore case')
    .action((query, options) => {
        const ignoreCase = options.ignoreCase ? '-i'

            : '';
        try {
            const result = runCommand(`grep -R ${ignoreCase} "${query}" .`);
            console.log(result);
        } catch (error) {
            if (error.status === 1) {
                console.log(chalk.yellow('No matches found.'));
            } else {
                throw error;
            }
        }
    });

export const diff = new Command('diff')
    .description('Show changes between commits, commit and working tree, etc')
    .option('-s, --staged', 'Show diff of staged changes')
    .option('-c, --commit <commit>', 'Show diff of a specific commit')
    .action((options) => {
        let command = 'git diff';
        if (options.staged) {
            command += ' --staged';
        } else if (options.commit) {
            command += ` ${options.commit}^..${options.commit}`;
        }
        console.log(runCommand(command));
    });

export const blame = new Command('blame')
    .description('Show what revision and author last modified each line of a file')
    .argument('<file>', 'File to blame')
    .action((file) => {
        console.log(runCommand(`git blame ${file}`));
    });

export const hooks = new Command('hooks')
    .description('Manage Git hooks')
    .option('-l, --list', 'List available hooks')
    .option('-a, --add <hook>', 'Add a new hook')
    .option('-r, --remove <hook>', 'Remove a hook')
    .action((options) => {
        const hooksDir = '.git/hooks';

        if (options.list) {
            const hooks = fs.readdirSync(hooksDir);
            console.log(chalk.yellow('Available hooks:'));
            hooks.forEach(hook => console.log(hook));
        } else if (options.add) {
            const hookPath = path.join(hooksDir, options.add);
            createFileWithContent(hookPath, '#!/bin/sh\n\n# Add your hook logic here\n');
            fs.chmodSync(hookPath, '755');
            displayFeedback(`Hook ${options.add} added successfully.`);
        } else if (options.remove) {
            const hookPath = path.join(hooksDir, options.remove);
            fs.unlinkSync(hookPath);
            displayFeedback(`Hook ${options.remove} removed successfully.`);
        }
    });

export const lint = new Command('lint')
    .description('Lint your code')
    .option('-f, --fix', 'Automatically fix problems')
    .action((options) => {
        let command = 'npx eslint .';
        if (options.fix) {
            command += ' --fix';
        }
        console.log(runCommand(command));
    });

export const benchmark = new Command('benchmark')
    .description('Run a simple benchmark test')
    .argument('<command>', 'Command to benchmark')
    .option('-r, --runs <number>', 'Number of runs', '5')
    .action((command, options) => {
        const runs = parseInt(options.runs);
        console.log(chalk.yellow(`Benchmarking command: ${command}`));
        console.log(chalk.yellow(`Number of runs: ${runs}`));

        const times = [];
        for (let i = 0; i < runs; i++) {
            const start = process.hrtime();
            execSync(command, { stdio: 'ignore' });
            const end = process.hrtime(start);
            const duration = (end[0] * 1e9 + end[1]) / 1e6; // Convert to milliseconds
            times.push(duration);
            console.log(`Run ${i + 1}: ${duration.toFixed(2)} ms`);
        }

        const average = times.reduce((a, b) => a + b, 0) / runs;
        console.log(chalk.green(`\nAverage time: ${average.toFixed(2)} ms`));
    });

export const dependencies = new Command('dependencies')
    .description('Analyze project dependencies')
    .option('-o, --outdated', 'Check for outdated dependencies')
    .action((options) => {
        if (options.outdated) {
            console.log(runCommand('npm outdated'));
        } else {
            console.log(runCommand('npm list --depth=0'));
        }
    });

export const docker = new Command('docker')
    .description('Generate a basic Dockerfile for the project')
    .action(() => {
        const dockerfileContent = `
FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
`;
        createFileWithContent('Dockerfile', dockerfileContent.trim());
        displayFeedback('Dockerfile created successfully.');
    });

export const test = new Command('test')
    .description('Run tests')
    .option('-w, --watch', 'Run tests in watch mode')
    .action((options) => {
        let command = 'npm test';
        if (options.watch) {
            command += ' -- --watch';
        }
        console.log(runCommand(command));
    });

export const config = new Command('config')
    .description('Manage GitMorph configuration')
    .option('-g, --global', 'Use global configuration')
    .option('-l, --local', 'Use local configuration')
    .option('-s, --set <key> <value>', 'Set a configuration value')
    .option('-d, --delete <key>', 'Delete a configuration value')
    .option('-v, --view', 'View the current configuration')
    .action((options) => {
        const isGlobal = options.global || !options.local;
        const currentConfig = isGlobal ? getGlobalConfig() : getLocalConfig();

        if (options.set) {
            currentConfig[options.set[0]] = options.set[1];
            if (isGlobal) {
                setGlobalConfig(currentConfig);
            } else {
                setLocalConfig(currentConfig);
            }
            console.log(chalk.green(`Configuration updated: ${options.set[0]} = ${options.set[1]}`));
        } else if (options.delete) {
            delete currentConfig[options.delete];
            if (isGlobal) {
                setGlobalConfig(currentConfig);
            } else {
                setLocalConfig(currentConfig);
            }
            console.log(chalk.green(`Configuration key deleted: ${options.delete}`));
        } else if (options.view) {
            console.log(chalk.cyan('Current configuration:'));
            console.log(JSON.stringify(currentConfig, null, 2));
        } else {
            console.log('Use --set, --delete, or --view to manage configuration.');
        }
    });