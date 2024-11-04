# GitMorph CLI

GitMorph CLI is an advanced Git operations and developer productivity tool that simplifies Git commands and provides additional features to enhance your development workflow.

## Installation

To install GitMorph CLI globally, run:

```

npm install -g gitmorph-cli

```

## Usage

After installation, you can use the `gim` command followed by the desired operation. Here's a list of available commands:

### Git Operations

- `gim init`: Initialize a new Git repository
- `gim clone <url>`: Clone a repository
- `gim stage <files>`: Stage files
- `gim save "<message>"`: Commit changes
- `gim upload`: Push to remote
- `gim download`: Pull from remote
- `gim status`: Check status
- `gim history`: Check log
- `gim branch <name>`: Create a new branch
- `gim switch <branch>`: Switch to a different branch
- `gim merge <branch>`: Merge branches
- `gim delete <branch>`: Delete a branch
- `gim stash`: Stash changes
- `gim apply-stash`: Apply stashed changes
- `gim rebase <branch>`: Rebase current branch

### Beyond Git

- `gim create-ignore`: Create a .gitignore file with common patterns
- `gim analyze`: Analyze repository statistics
- `gim todo`: List or add TODO comments in your code
- `gim scaffold <type>`: Scaffold a basic project structure (node, react)
- `gim search <query>`: Search for a string in all files
- `gim diff`: Show changes between commits, commit and working tree, etc
- `gim blame <file>`: Show what revision and author last modified each line of a file
- `gim hooks`: Manage Git hooks
- `gim lint`: Lint your code
- `gim benchmark <command>`: Run a simple benchmark test
- `gim dependencies`: Analyze project dependencies
- `gim docker`: Generate a basic Dockerfile for the project
- `gim test`: Run tests
- `gim config`: Manage GitMorph configuration

## Examples

1. Initialize a new repository:

```

gim init

```

2. Stage all files and commit:

```

gim stage .
gim save "Initial commit"

```

3. Push changes to remote:

```

gim upload

```

4. Analyze repository statistics:

```

gim analyze

```

5. Scaffold a new Node.js project:

```

gim scaffold node

```

6. Search for a string in all files:

```

gim search "TODO"

```

7. Run a benchmark test:

```

gim benchmark "npm test" -r 10

```

8. Generate a Dockerfile:
```

gim docker

```

## Configuration

You can configure GitMorph CLI using the `gim config` command. This allows you to set global or local configurations.

- Set a global configuration:
```

gim config -g -s key value

```

- Set a local configuration:
```

gim config -l -s key value

```

- View current configuration:
```

gim config -v

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