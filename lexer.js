// lexer.js

class Token {
    constructor(type, value, line) {
        this.type = type;
        this.value = value;
        this.line = line;
    }
}

class Lexer {
    constructor(input) {
        this.input = input;
        this.tokens = [];
        this.current = 0;
        this.line = 1; // Initialize line number
    }

    tokenize() {
        while (this.current < this.input.length) {
            let char = this.input[this.current];

            if (char === '\n') {
                this.line++;
                this.current++;
            } else if (char === '{' || char === '}' || char === '[' || char === ']' || char === ':' || char === ',') {
                this.tokens.push(new Token(char, char, this.line));
                this.current++;
            } else if (char === '"') {
                let value = '';
                char = this.input[++this.current];
                while (char !== '"') {
                    value += char;
                    char = this.input[++this.current];
                }
                this.tokens.push(new Token('STRING', value, this.line));
                this.current++;
            } else if (char >= '0' && char <= '9') {
                let value = '';
                while (char >= '0' && char <= '9') {
                    value += char;
                    char = this.input[++this.current];
                }
                this.tokens.push(new Token('NUMBER', parseInt(value), this.line));
            } else if (char === 't' && this.input.substr(this.current, 4) === 'true') {
                this.tokens.push(new Token('BOOLEAN', true, this.line));
                this.current += 4;
            } else if (char === 'f' && this.input.substr(this.current, 5) === 'false') {
                this.tokens.push(new Token('BOOLEAN', false, this.line));
                this.current += 5;
            } else if (char === 'n' && this.input.substr(this.current, 4) === 'null') {
                this.tokens.push(new Token('NULL', null, this.line));
                this.current += 4;
            } else {
                this.current++;
            }
        }
        return this.tokens;
    }

    getNextToken() {
        return this.tokens.shift();
    }
}

module.exports = Lexer;
