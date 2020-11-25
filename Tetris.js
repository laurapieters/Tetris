function playGame(){
    let board = new Board();
    board.generateNewPiece();
    let boardDiv = board.createBoard();
    let controlsDiv = board.generateControls();
    document.body.appendChild(boardDiv);
    document.body.appendChild(controlsDiv);
}

class Board{
    constructor() {
        this.blocks = this.createBlocks();
        // this.generateNewPiece();
    }

    createBlocks(){
        let blocks = [];
        for(let i = 0; i < 10; i++){
            let yBlocks = [];
            for(let j = 0; j < 22; j++){ // 18 rows + 4 invisible
                let block = new Block(i,j, 'lightgrey');
                yBlocks.push(block);
            }
            blocks.push(yBlocks);
        }
        return blocks;
    }

    createBoard(){
        let boardDiv = document.createElement('div');
        boardDiv.setAttribute('id', 'background');
        for(let j = 4; j < 22; j++){ // starting at 4 after invisible blocks
            for(let i = 0; i < 10; i++) {
                boardDiv.appendChild(this.blocks[i][j].createBlock());
            }
            const br = document.createElement('br');
            boardDiv.appendChild(br);
        }
        return boardDiv;
    }

    updateBoard(){
        const board = document.getElementById('background');
        const controls = document.getElementById('controls');
        board.parentNode.removeChild(board);
        const boardDiv = this.createBoard();
        document.body.insertBefore(boardDiv,controls);
    }

    generateNewPiece(){
        const shapes = ['I','O','T','J','L','Z','S'];
        const nr = Math.floor(Math.random() * (shapes.length));
        const shape = shapes[nr];
        let piece = new Piece(shape,4,3, this.blocks);
        this.activePiece = piece;
        let coordinates = piece.createPiece();
        for(let i = 0; i < coordinates.length; i++){
            this.blocks[coordinates[i][0]][coordinates[i][1]].changeColor(piece.color);
        }
    }

    moveDown = () => {
        // old blocks to grey
        let oldCoordinates = this.activePiece.createPiece();
        for(let i = 0; i < oldCoordinates.length; i++){
            this.blocks[oldCoordinates[i][0]][oldCoordinates[i][1]].changeColor('lightgrey');
        }
        // new blocks to color
        let newCoordinates = this.activePiece.moveDown();
        for(let i = 0; i < newCoordinates.length; i++){
            this.blocks[newCoordinates[i][0]][newCoordinates[i][1]].changeColor(this.activePiece.color);
        }
        this.updateBoard();
    }

    moveRight = () => {
        // old blocks to grey
        let oldCoordinates = this.activePiece.createPiece();
        for(let i = 0; i < oldCoordinates.length; i++){
            this.blocks[oldCoordinates[i][0]][oldCoordinates[i][1]].changeColor('lightgrey');
        }
        // new blocks to color
        let newCoordinates = this.activePiece.moveRight();
        for(let i = 0; i < newCoordinates.length; i++){
            this.blocks[newCoordinates[i][0]][newCoordinates[i][1]].changeColor(this.activePiece.color);
        }
        this.updateBoard();
    }

    moveLeft = () => {
        // old blocks to grey
        let oldCoordinates = this.activePiece.createPiece();
        for(let i = 0; i < oldCoordinates.length; i++){
            this.blocks[oldCoordinates[i][0]][oldCoordinates[i][1]].changeColor('lightgrey');
        }
        // new blocks to color
        let newCoordinates = this.activePiece.moveLeft();
        for(let i = 0; i < newCoordinates.length; i++){
            this.blocks[newCoordinates[i][0]][newCoordinates[i][1]].changeColor(this.activePiece.color);
        }
        this.updateBoard();
    }

    generateControls(){
        let controlsDiv = document.createElement('div');
        controlsDiv.setAttribute('id', 'controls');

        let downButton = document.createElement('button');
        downButton.innerHTML = 'V';
        downButton.setAttribute('id', 'downButton');
        downButton.onclick = this.moveDown;
        controlsDiv.appendChild(downButton);

        const br = document.createElement('br');
        controlsDiv.appendChild(br);

        let rightButton = document.createElement('button');
        rightButton.innerHTML = '>';
        rightButton.setAttribute('id', 'rightButton');
        rightButton.onclick = this.moveRight;
        controlsDiv.appendChild(rightButton);

        let leftButton = document.createElement('button');
        leftButton.innerHTML = '<';
        leftButton.setAttribute('id', 'leftButton');
        leftButton.onclick = this.moveLeft;
        controlsDiv.appendChild(leftButton);

        const br1 = document.createElement('br');
        controlsDiv.appendChild(br1);

        let rotateButton = document.createElement('button');
        rotateButton.innerHTML = '^';
        rotateButton.setAttribute('id', 'rotateButton');
        controlsDiv.appendChild(rotateButton);

        return controlsDiv;
    }
}

class Piece{
    constructor(shape, x, y) {
        this.shape = shape;
        this.x = x;
        this.y = y;
        this.coordinates = [[x,y]];
    }

    moveDown = () => {
        this.coordinates[0][1] ++;
        this.coordinates[1][1] ++;
        this.coordinates[2][1] ++;
        this.coordinates[3][1] ++;
        return this.coordinates;
    }

    moveLeft = () => {
        this.coordinates[0][0] --;
        this.coordinates[1][0] --;
        this.coordinates[2][0] --;
        this.coordinates[3][0] --;
        return this.coordinates;
    }

    moveRight = () => {
        this.coordinates[0][0] ++;
        this.coordinates[1][0] ++;
        this.coordinates[2][0] ++;
        this.coordinates[3][0] ++;
        return this.coordinates;
    }

    createPiece(){
        switch (this.shape) {
            case 'I':
                this.color = 'deepskyblue';
                this.coordinates.push([this.x,this.y-1]);
                this.coordinates.push([this.x,this.y-2]);
                this.coordinates.push([this.x,this.y-3]);
                break;
            case 'O':
                this.color = 'yellow'
                this.coordinates.push([this.x,this.y-1]);
                this.coordinates.push([this.x+1,this.y]);
                this.coordinates.push([this.x+1,this.y-1]);
                break;
            case 'T':
                this.color = 'purple';
                this.coordinates.push([this.x,this.y-1]);
                this.coordinates.push([this.x+1,this.y-1]);
                this.coordinates.push([this.x-1,this.y-1]);
                break;
            case 'J':
                this.color = 'hotpink';
                this.coordinates.push([this.x+1,this.y]);
                this.coordinates.push([this.x+1,this.y-1]);
                this.coordinates.push([this.x+1,this.y-2]);
                break;
            case 'L':
                this.color = 'darkorange';
                this.coordinates.push([this.x+1,this.y]);
                this.coordinates.push([this.x,this.y-1]);
                this.coordinates.push([this.x,this.y-2]);
                break;
            case 'Z':
                this.color = 'yellowgreen';
                this.coordinates.push([this.x+1,this.y]);
                this.coordinates.push([this.x,this.y-1]);
                this.coordinates.push([this.x-1,this.y-1]);
                break;
            case 'S':
                this.color = 'red';
                this.coordinates.push([this.x+1,this.y]);
                this.coordinates.push([this.x+1,this.y-1]);
                this.coordinates.push([this.x+2,this.y-1]);
                break;
        }
        return this.coordinates;
    }

}

class Block{
    constructor(x, y, color) {
        this.color = color;
        this.x = x;
        this.y = y;
    }

    changeColor(color){
        this.color = color;
    }

    createBlock(){
        this.blockDiv = document.createElement('div');
        this.blockDiv.setAttribute('class','block');
        this.blockDiv.style.backgroundColor = this.color;
        return this.blockDiv;
    }

}