import { Command } from 'commander';
import { runCommand, displayFeedback, isGitRepo, createFileWithContent, readFileContent } from './utils.js';
import chalk from 'chalk';
import fs from 'fs';
import inquirer from 'inquirer';

// Git Commands

export const init = new Command('init')
    .description('Initialize a new Git repository')
    .action(() => {
        runCommand('git init');
        displayFeedback('Git repository initialized successfully.');
    });

export const clone = new Command('clone')
    .description('Clone a repository')
    .argument('<url>', 'Repository URL')
    .action((url) => {
        runCommand(`git clone ${url}`);
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
    .action((message) => {
        runCommand(`git commit -m "${message}"`);
        displayFeedback(`Changes committed with message: '${message}'`);
    });

export const upload = new Command('upload')
    .description('Push to remote')
    .action(() => {
        runCommand('git push');
        displayFeedback('Changes pushed to remote successfully.');
    });

export const download = new Command('download')
    .description('Pull from remote')
    .action(() => {
        runCommand('git pull');
        displayFeedback('Changes pulled from remote successfully.');
    });

export const status = new Command('status')
    .description('Check status')
    .action(() => {
        console.log(runCommand('git status'));
    });

export const history = new Command('history')
    .description('Check log')
    .action(() => {
        console.log(runCommand('git log --oneline'));
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
    .action((branch) => {
        runCommand(`git branch -d ${branch}`);
        displayFeedback(`Branch '${branch}' deleted successfully.`);
    });

export const stash = new Command('stash')
    .description('Stash changes')
    .action(() => {
        runCommand('git stash');
        displayFeedback('Changes stashed successfully.');
    });

export const applyStash = new Command('apply-stash')
    .description('Apply stashed changes')
    .action(() => {
        runCommand('git stash apply');
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

const ignorePatterns = {
    node: `
  # Node
  node_modules/
  npm-debug.log*
  yarn-debug.log*
  yarn-error.log*
  lerna-debug.log*
  .pnpm-debug.log*
  report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json
  .node_repl_history
  *.tgz
  .yarn-integrity
  .env
  .env.development.local
  .env.test.local
  .env.production.local
  .env.local
  `,
    python: `
  # Python
  __pycache__/
  *.py[cod]
  *$py.class
  *.so
  .Python
  build/
  develop-eggs/
  dist/
  downloads/
  eggs/
  .eggs/
  lib/
  lib64/
  parts/
  sdist/
  var/
  wheels/
  share/python-wheels/
  *.egg-info/
  .installed.cfg
  *.egg
  MANIFEST
  *.manifest
  *.spec
  pip-log.txt
  pip-delete-this-directory.txt
  htmlcov/
  .tox/
  .nox/
  .coverage
  .coverage.*
  .cache
  nosetests.xml
  coverage.xml
  *.cover
  *.py,cover
  .hypothesis/
  .pytest_cache/
  cover/
  *.mo
  *.pot
  *.log
  local_settings.py
  db.sqlite3
  db.sqlite3-journal
  instance/
  .webassets-cache
  .scrapy
  docs/_build/
  .pybuilder/
  target/
  .ipynb_checkpoints
  profile_default/
  ipython_config.py
  __pypackages__/
  celerybeat-schedule
  celerybeat.pid
  *.sage.py
  .env
  .venv
  env/
  venv/
  ENV/
  env.bak/
  venv.bak/
  .spyderproject
  .spyproject
  .ropeproject
  /site
  .mypy_cache/
  .dmypy.json
  dmypy.json
  .pyre/
  .pytype/
  cython_debug/
  `,
    java: `
  # Java
  *.class
  *.log
  *.ctxt
  .mtj.tmp/
  *.jar
  *.war
  *.nar
  *.ear
  *.zip
  *.tar.gz
  *.rar
  hs_err_pid*
  replay_pid*
  `,
    ruby: `
  # Ruby
  *.gem
  *.rbc
  /.config
  /coverage/
  /InstalledFiles
  /pkg/
  /spec/reports/
  /spec/examples.txt
  /test/tmp/
  /test/version_tmp/
  /tmp/
  .dat*
  .repl_history
  *.bridgesupport
  build-iPhoneOS/
  build-iPhoneSimulator/
  /.yardoc/
  /_yardoc/
  /doc/
  /rdoc/
  /.bundle/
  /vendor/bundle
  /lib/bundler/man/
  .rvmrc
  `,
    go: `
  # Go
  *.exe
  *.exe~
  *.dll
  *.so
  *.dylib
  *.test
  *.out
  go.work
  `,
    rust: `
  # Rust
  debug/
  target/
  Cargo.lock
  **/*.rs.bk
  *.pdb
  `,
    csharp: `
  # C#
  *.rsuser
  *.suo
  *.user
  *.userosscache
  *.sln.docstates
  *.userprefs
  [Dd]ebug/
  [Dd]ebugPublic/
  [Rr]elease/
  [Rr]eleases/
  x64/
  x86/
  [Ww][Ii][Nn]32/
  [Aa][Rr][Mm]/
  [Aa][Rr][Mm]64/
  bld/
  [Bb]in/
  [Oo]bj/
  [Ll]og/
  [Ll]ogs/
  .vs/
  *.pidb
  *.svclog
  *.scc
  `,
    web: `
  # Web
  *.log
  *.pid
  *.seed
  *.pid.lock
  logs
  pids
  lib-cov
  coverage
  .nyc_output
  .grunt
  bower_components
  .lock-wscript
  build/Release
  jspm_packages/
  web_modules/
  *.tsbuildinfo
  .npm
  .eslintcache
  .stylelintcache
  .rpt2_cache/
  .rts2_cache_cjs/
  .rts2_cache_es/
  .rts2_cache_umd/
  .node_repl_history
  .yarn-integrity
  .env
  .env.test
  .cache
  .parcel-cache
  .next
  out
  .nuxt
  dist
  .cache/
  .vuepress/dist
  .temp
  .docusaurus
  .serverless/
  .fusebox/
  .dynamodb/
  .tern-port
  .vscode-test
  .yarn/cache
  .yarn/unplugged
  .yarn/build-state.yml
  .yarn/install-state.gz
  .pnp.*
  `,
    ide: `
  # IDEs and editors
  .idea/
  .vscode/
  *.swp
  *.swo
  *.sublime-workspace
  *.sublime-project
  .DS_Store
  .AppleDouble
  .LSOverride
  ._*
  .Spotlight-V100
  .Trashes
  .AppleDB
  .AppleDesktop
  Network Trash Folder
  Temporary Items
  .apdisk
  Thumbs.db
  Thumbs.db:encryptable
  ehthumbs.db
  ehthumbs_vista.db
  *.stackdump
  [Dd]esktop.ini
  $RECYCLE.BIN/
  *.lnk
  `,
    database: `
  # Databases
  *.mdb
  *.ldb
  *.sqlite
  *.sqlite3
  *.db
  `,
    logs: `
  # Logs
  logs
  *.log
  npm-debug.log*
  yarn-debug.log*
  yarn-error.log*
  lerna-debug.log*
  .pnpm-debug.log*
  `,
    os: `
  # OS generated files
  .DS_Store
  .DS_Store?
  ._*
  .Spotlight-V100
  .Trashes
  ehthumbs.db
  Thumbs.db
  `,
    archives: `
  # Archives
  *.7z
  *.jar
  *.rar
  *.zip
  *.gz
  *.gzip
  *.tgz
  *.bzip
  *.bzip2
  *.bz2
  *.xz
  *.lzma
  *.cab
  *.iso
  *.tar
  *.dmg
  *.xpi
  *.gem
  *.egg
  *.deb
  *.rpm
  *.msi
  *.msm
  *.msp
  `,
    images: `
  # Images
  *.jpg
  *.jpeg
  *.jpe
  *.jif
  *.jfif
  *.jfi
  *.jp2
  *.j2k
  *.jpf
  *.jpx
  *.jpm
  *.mj2
  *.jxr
  *.hdp
  *.wdp
  *.gif
  *.raw
  *.webp
  *.png
  *.apng
  *.mng
  *.tiff
  *.tif
  *.svg
  *.svgz
  *.pdf
  *.xbm
  *.bmp
  *.dib
  *.ico
  *.3dm
  *.max
  `,
};

export const createIgnore = new Command('create-ignore')
    .description('Create a .gitignore file with common patterns')
    .option('-a, --all', 'Include all patterns')
    .action(async (options) => {
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
            ignoreContent += `# ${pattern.charAt(0).toUpperCase() + pattern.slice(1)}\n`;
            ignoreContent += ignorePatterns[pattern].trim() + '\n\n';
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
        const ignoreCase = options.ignoreCase ? '-i' : '';
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