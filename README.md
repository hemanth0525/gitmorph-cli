# GitMorph CLI

GitMorph CLI is an advanced Git operations and developer productivity tool that simplifies Git commands and provides additional features to enhance your development workflow.

## Installation

To install GitMorph CLI globally, run:

```

npm install -g gitmorph-cli

```

## Usage

After installation, you can use the `gm` command followed by the desired operation. Here's a list of available commands:

### Git Operations

- `gm init`: Initialize a new Git repository
- `gm clone <url>`: Clone a repository
- `gm stage <files>`: Stage files
- `gm save "<message>"`: Commit changes
- `gm upload`: Push to remote
- `gm download`: Pull from remote
- `gm status`: Check status
- `gm history`: Check log
- `gm branch <name>`: Create a new branch
- `gm switch <branch>`: Switch to a different branch
- `gm merge <branch>`: Merge branches
- `gm delete <branch>`: Delete a branch
- `gm stash`: Stash changes
- `gm apply-stash`: Apply stashed changes
- `gm rebase <branch>`: Rebase current branch

### Beyond Git

- `gm create-ignore`: Create a .gitignore file with common patterns
- `gm analyze`: Analyze repository statistics
- `gm todo`: List or add TODO comments in your code
- `gm scaffold <type>`: Scaffold a basic project structure (node, react)
- `gm search <query>`: Search for a string in all files
- `gm diff`: Show changes between commits, commit and working tree, etc
- `gm blame <file>`: Show what revision and author last modified each line of a file
- `gm hooks`: Manage Git hooks
- `gm lint`: Lint your code
- `gm benchmark <command>`: Run a simple benchmark test
- `gm dependencies`: Analyze project dependencies
- `gm docker`: Generate a basic Dockerfile for the project
- `gm test`: Run tests
- `gm config`: Manage GitMorph configuration

## Examples

1. Initialize a new repository:

```

gm init

```

2. Stage all files and commit:

```

gm stage .
gm save "Initial commit"

```

3. Push changes to remote:

```

gm upload

```

4. Analyze repository statistics:

```

gm analyze

```

5. Scaffold a new Node.js project:

```

gm scaffold node

```

6. Search for a string in all files:

```

gm search "TODO"

```

7. Run a benchmark test:

```

gm benchmark "npm test" -r 10

```

8. Generate a Dockerfile:
```

gm docker

```

## Configuration

You can configure GitMorph CLI using the `gm config` command. This allows you to set global or local configurations.

- Set a global configuration:
```

gm config -g -s key value

```

- Set a local configuration:
```

gm config -l -s key value

```

- View current configuration:
```

gm config -v

```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Author

blu3ph4ntom

## Repository

https://github.com/hemanth0525/gitmorph-cli

## Homepage

https://hemanth0525.github.io/gitmorph