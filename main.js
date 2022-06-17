const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';
const playerCharacter = '!';

class Field {
    constructor(field, hardMode = false) {
        this.field = field;

        let {row, column} = this.getRandomSpot();

        while (this.field[row][column] !== fieldCharacter) {
            if (column < this.field[0].length - 1) {
                column++;
            } else if (row < this.field.length - 1) {
                column = 0;
                row++;
            } else {
                throw new Error('This field does not have any open spaces!');
            }
        }
        this.field[row][column] = playerCharacter;
        this.playerLocation = {
            row: row,
            column: column
        };
        this.hardMode = hardMode;


    }

    print() {
        let board = '';
        this.field.forEach(row => {
            board += row.join('');
            board += '\n';
        });
        console.log('\n');
        console.log(`Legend: character = ${playerCharacter}; hat = ${hat}; hole = ${hole}; field = ${fieldCharacter}; path = ${pathCharacter}`);
        console.log();
        console.log(board);
    }

    startGame() {
        while (true) {
            this.print();
            let move = prompt('Make your move (l, r, u, d): ').toLowerCase();
            let newRow = this.playerLocation.row;
            let newColumn = this.playerLocation.column;
            if (move === 'u') {
                newRow--;
            } else if (move === 'd') {
                newRow++;
            } else if (move === 'r') {
                newColumn++;
            } else if (move === 'l') {
                newColumn--;
            }
            

            if (newRow < 0 || newRow > this.field.length - 1 || newColumn < 0 || newColumn > this.field[0].length - 1) {
                console.log('You can\'t leave the field now! Move in a different direction.');
            } else if (this.field[newRow][newColumn] === hole) {
                console.log('You fell in a hole! Game over!');
                return;
            } else if (this.field[newRow][newColumn] === hat) {
                console.log('You found your hat! You win!');
                return;
            } else {
                this.field[this.playerLocation.row][this.playerLocation.column] = pathCharacter;
                this.playerLocation.row = newRow;
                this.playerLocation.column = newColumn;
                this.field[this.playerLocation.row][this.playerLocation.column] = playerCharacter;
            }
            if (this.hardMode) {
                this.addHole();
            }
        }
    }

    static generateField(length, width, difficulty) {
        const field = [];
        for (let i = 0; i < length; i++) {
            let row = new Array(width);
            row.fill(fieldCharacter);
            field.push(row);
        }
        const totalTiles = length * width;
        const numOfHolesPerRow = Math.round((totalTiles * (difficulty / 100)) / field.length);
        const hatRow = Math.floor(Math.random() * field.length);
        const hatColumn = Math.floor(Math.random() * field[0].length);
        field[hatRow][hatColumn] = hat;
        for (let i = 0; i < field.length; i++) {
            let holes = [];
            for (let j = 0; j < numOfHolesPerRow; j++) {
                let holeColumn = -1;
                while (holeColumn < 0 || holes.includes(holeColumn) || (i === hatRow && holeColumn === hatColumn)) {
                    holeColumn = Math.floor(Math.random() * field[i].length);
                }
                field[i][holeColumn] = hole; 
            }
        }
        return field;
    }

    addHole() {
        while (true) {
            let {row, column} = this.getRandomSpot();
            if (this.field[row][column] === fieldCharacter) {
                this.field[row][column] = hole;
                return;
            }
        }
        
    }

    getRandomSpot() {
        let row = Math.floor(Math.random() * this.field.length);
        let column = Math.floor(Math.random() * this.field[0].length);
        return {row, column};
    }
}

const length = Number(process.argv[2]);
const width = Number(process.argv[3]);
const difficulty = Number(process.argv[4]);
const hardMode = process.argv[5] === 'hard';

const field = new Field(Field.generateField(length, width, difficulty), hardMode);

field.startGame();