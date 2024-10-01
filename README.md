# Page-Loader

[![Tests](https://github.com/Skryam/hexlet-code/actions/workflows/main.yml/badge.svg)](https://github.com/Skryam/hexlet-code/actions/workflows/main.yml)
<a href="https://codeclimate.com/github/Skryam/hexlet-code/maintainability"><img src="https://api.codeclimate.com/v1/badges/8d792b48568d9ed1a03e/maintainability" /></a>
<a href="https://codeclimate.com/github/Skryam/hexlet-code/test_coverage"><img src="https://api.codeclimate.com/v1/badges/8d792b48568d9ed1a03e/test_coverage" /></a>

**Page-loader** or **HTTP Page Downloader** utility allows you to download a webpage along with its associated local files and save them to a specified directory.

### Key Features:
- **Full Page Download:** Downloads the entire HTML page and its local resources (e.g., images, CSS, JavaScript) to replicate the structure and appearance of the original page.
- **Resource Handling:** Automatically fetches and saves linked files such as external stylesheets, JavaScript files, fonts, and multimedia content.
- **Offline Accessibility:** Enables users to browse downloaded web pages without the need for an internet connection.
- **Flexible Configuration:** Allows customization of the download process, including filtering specific file types or excluding certain resources.
- **Efficiency:** Optimized to download pages quickly and ensure minimal server load.

The project can be easily integrated into various workflows for developers, researchers, and analysts looking to automate web content retrieval.

## Requirements
- Git
- Node.js
- NPM

## Installation
1. Clone the repository:
```bash
git clone https://github.com/Skryam/hexlet-code.git
```
   
2. Install dependencies:  
```bash
npm install
```

3. Make link:  
```bash
npm link
```

## Commands
The program uses the following options and arguments:
```bash
Usage: page-loader [options] <url>

Options:
  -V, --version          output the version number
  -o, --output [dir]     specify the output directory (default: current working directory)
  -h, --help             display help for command
```

## Example
To download a webpage and save it in the current directory, run:
```bash
page-loader https://example.com
```

To specify an output directory:
```bash
page-loader -o ./downloads https://example.com
```

After a successful download, you’ll see the following message:
```bash
Loaded successfully and saved at path: ./downloads/example.com.html
```