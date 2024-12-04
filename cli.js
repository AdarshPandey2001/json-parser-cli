const fs = require('fs');
const { program } = require('commander');
const Lexer = require('./lexer');
const Parser = require('./parser');

program
  .version('1.0.0')
  .description('Custom JSON Parser CLI Tool')
  .argument('<file>', 'JSON file to parse')
  .action((file) => {
    // Check if file exists
    if (!fs.existsSync(file)) {
        console.error(`File not found: ${file}`);
        process.exit(1);
    }

    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file: ${err.message}`);
            process.exit(1);
        }

        const lexer = new Lexer(data);
        const tokens = lexer.tokenize();
        const parser = new Parser(lexer);
        try {
            parser.parse();
            console.log('Valid JSON');
            process.exit(0);
        } catch (error) {
            console.error(`Invalid JSON: ${error.message}`);
            process.exit(1);
        }
    });
  });

program.parse(process.argv);

