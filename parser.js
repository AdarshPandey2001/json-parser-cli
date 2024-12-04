const Lexer = require('./lexer');

class Parser {
    constructor(lexer) {
        this.lexer = lexer;
        this.tokens = this.lexer.tokenize();
        this.currentToken = this.getNextToken();
    }

    getNextToken() {
        return this.tokens.shift();
    }

    parse() {
        this.validateValue();
        if (this.currentToken !== undefined) {
            this.reportError('Extra data found after JSON');
        }
    }

    validateObject() {
        if (this.currentToken.type !== '{') {
            this.reportError('Expected {');
        }
        this.currentToken = this.getNextToken();

        while (this.currentToken.type !== '}') {
            if (this.currentToken.type !== 'STRING') {
                this.reportError('Expected STRING key');
            }
            this.currentToken = this.getNextToken();
            if (this.currentToken.type !== ':') {
                this.reportError('Expected :');
            }
            this.currentToken = this.getNextToken();
            this.validateValue();
            if (this.currentToken.type === ',') {
                this.currentToken = this.getNextToken();
            } else if (this.currentToken.type !== '}') {
                this.reportError('Expected }');
            }
        }
        this.currentToken = this.getNextToken(); // Consume the closing }
    }

    validateArray() {
        if (this.currentToken.type !== '[') {
            this.reportError('Expected [');
        }
        this.currentToken = this.getNextToken();
        let expectValue = true;
        while (this.currentToken.type !== ']') {
            if (expectValue) {
                this.validateValue();
                expectValue = false;
            } else if (this.currentToken.type === ',') {
                this.currentToken = this.getNextToken();
                expectValue = true;
            } else {
                this.reportError("Missing , between array elements");
            }
        }
        this.currentToken = this.getNextToken(); // Consume the closing ]
    }

    validateValue() {
        if (this.currentToken.type === '{') {
            this.validateObject();
        } else if (this.currentToken.type === '[') {
            this.validateArray();
        } else if (['STRING', 'NUMBER', 'BOOLEAN', 'NULL'].includes(this.currentToken.type)) {
            this.currentToken = this.getNextToken();
        } else {
            this.reportError('Unexpected token');
        }
    }

    reportError(message) {
        console.error(`Error: ${message} on line ${this.currentToken.line}`);
        process.exit(1);
    }
}

module.exports = Parser;
