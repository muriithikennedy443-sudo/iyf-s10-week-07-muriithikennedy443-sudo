# Week 07: JavaScript Best Practices

## Author
- *Name:* Kennedy Muriithi
- *GitHub:* [@muriithikennedy443-sudo](https://github.com/muriithikennedy443-sudo)
- *Date:* April 20, 2026

## Project Description
This project demonstrates setting up ESLint and Prettier for JavaScript code quality and formatting. It includes configuring linting rules, code formatting, and running automated code checks on a To-Do List application.

## Technologies Used
- HTML5
- CSS3
- JavaScript (ES Modules)
- ESLint v9 (Code linting)
- Prettier v3 (Code formatting)
- Node.js & npm

## Features
- ESLint configured with custom rules to catch code errors
- Prettier configured for consistent code formatting
- Automated lint and format scripts in package.json
- Clean modular To-Do List code in src/todo.js
- VS Code integration with ESLint and Prettier extensions

## How to Run
1. Clone this repository
2. Run npm install
3. Run npm run lint to check for errors
4. Run npm run lint:fix to auto-fix errors
5. Run npm run format to format code with Prettier
6. Open index.html in your browser

## Lessons Learned
- How to set up ESLint v9 with the new eslint.config.js format
- How to configure Prettier for consistent code style
- The difference between linting (catching errors) and formatting (style)
- How to use named constants instead of magic numbers
- How to write clean, single-responsibility functions

## Challenges Faced
- ESLint v9 no longer supports .eslintrc.json — had to migrate to eslint.config.js
- PowerShell execution policy blocked npm scripts — fixed with Set-ExecutionPolicy
- Windows path separators differ from Unix (backslash vs forward slash)