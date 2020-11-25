function playGame(){
    let board = new Board();
    setInterval(function(){
        if(board.reachedBottom){
            board.generateNewPiece();
            board.moveDown();
            board.updateBoard();
        }else{
            board.moveDown();
            board.updateBoard();
        }
        }, 1000);

}

class Board{
    constructor() {
        this.blocks = this.createBlocks();
        this.generateNewPiece();
        this.board = this.createBoard();
        this.controls = this.generateControls();
        document.body.appendChild(this.board);
        document.body.appendChild(this.controls);
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
        this.coordinates = piece.createPiece();
        this.reachedBottom = false;
        for(let i = 0; i < this.coordinates.length; i++){
            this.blocks[this.coordinates[i][0]][this.coordinates[i][1]].changeColor(piece.color);
        }
    }

    move(oldCoordinates, newCoordinates){
        // old blocks to grey
        for(let i = 0; i < oldCoordinates.length; i++){
            this.blocks[oldCoordinates[i][0]][oldCoordinates[i][1]].changeColor('lightgrey');
        }
        this.coordinates = newCoordinates;
        // new blocks to color
        for(let i = 0; i < newCoordinates.length; i++){
            this.blocks[newCoordinates[i][0]][newCoordinates[i][1]].changeColor(this.activePiece.color);
            this.updateBoard();
        }
    }

    moveDown = () => {
        const oldCoordinates = this.coordinates;
        if(oldCoordinates[0][1] === 21){
            this.reachedBottom = true;
            console.log('bottom');
        }
        const newCoordinates = this.activePiece.moveDown();

        this.move(oldCoordinates, newCoordinates);
    }

    moveRight = () => {
        const oldCoordinates = this.coordinates;
        const newCoordinates = this.activePiece.moveRight();
        this.move(oldCoordinates, newCoordinates);
    }

    moveLeft = () => {
        const oldCoordinates = this.coordinates;
        const newCoordinates = this.activePiece.moveLeft();
        this.move(oldCoordinates, newCoordinates);
    }

    rotate = () => {
        const oldCoordinates = this.coordinates;
        const newCoordinates = this.activePiece.rotate();
        this.move(oldCoordinates, newCoordinates);
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
        rotateButton.onclick = this.rotate;
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
        this.firstRotationI = false;
    }

    stayInside(coordinates){
        let inside = true;
        // not past bottom border
        if(Math.max(coordinates[0][1],coordinates[1][1],coordinates[2][1],coordinates[3][1]) >= 22){
            inside = false;
        }
        // not past right border
        if(Math.max(coordinates[0][0],coordinates[1][0],coordinates[2][0],coordinates[3][0]) >= 10){
            inside = false;
        }
        // not past left border
        if(Math.min(coordinates[0][0],coordinates[1][0],coordinates[2][0],coordinates[3][0]) < 0){
            inside = false;
        }
        return inside;
    }

    moveDown = () => {
        const newCoordinates = [
            [this.coordinates[0][0], this.coordinates[0][1] + 1],
            [this.coordinates[1][0], this.coordinates[1][1] + 1],
            [this.coordinates[2][0], this.coordinates[2][1] + 1],
            [this.coordinates[3][0], this.coordinates[3][1] + 1],
        ];
        if(this.stayInside(newCoordinates)){
            this.coordinates = newCoordinates;
            return newCoordinates;
        }else{
            return [];
        }
    }

    moveLeft = () => {
        const newCoordinates = [
            [this.coordinates[0][0] - 1, this.coordinates[0][1]],
            [this.coordinates[1][0] - 1, this.coordinates[1][1]],
            [this.coordinates[2][0] - 1, this.coordinates[2][1]],
            [this.coordinates[3][0] - 1, this.coordinates[3][1]],
        ];
        if(this.stayInside(newCoordinates)){
            this.coordinates = newCoordinates;
            return newCoordinates;
        }else{
            return [];
        }
    }

    moveRight = () => {
        const newCoordinates = [
            [this.coordinates[0][0] + 1, this.coordinates[0][1]],
            [this.coordinates[1][0] + 1, this.coordinates[1][1]],
            [this.coordinates[2][0] + 1, this.coordinates[2][1]],
            [this.coordinates[3][0] + 1, this.coordinates[3][1]],
        ];
        if(this.stayInside(newCoordinates)){
            this.coordinates = newCoordinates;
            return newCoordinates;
        }else{
            return [];
        }
    }

    rotate = () => {
        let rotateAround = [];
        switch (this.shape) {
            case 'I':
                rotateAround = [this.coordinates[2][0],this.coordinates[2][1]];
                break;
            case 'O':
                // no rotation
                break;
            case 'T':
                rotateAround = [this.coordinates[1][0],this.coordinates[1][1]];
                break;
            case 'J':
                rotateAround = [this.coordinates[2][0],this.coordinates[2][1]];
                break;
            case 'L':
                rotateAround = [this.coordinates[2][0],this.coordinates[2][1]];
                break;
            case 'Z':
                rotateAround = [this.coordinates[2][0],this.coordinates[2][1]];
                break;
            case 'S':
                rotateAround = [this.coordinates[2][0],this.coordinates[2][1]];
                break;
        }
        let newCoordinates = this.coordinates;
        if(this.shape === 'I'){
            if(this.firstRotationI){
                // rotate 90 degrees clockwise with rotation matrix
                newCoordinates = [
                    [this.coordinates[0][1]-rotateAround[1]+rotateAround[0], rotateAround[0]-this.coordinates[0][0]+rotateAround[1]],
                    [this.coordinates[1][1]-rotateAround[1]+rotateAround[0], rotateAround[0]-this.coordinates[1][0]+rotateAround[1]],
                    [this.coordinates[2][1]-rotateAround[1]+rotateAround[0], rotateAround[0]-this.coordinates[2][0]+rotateAround[1]],
                    [this.coordinates[3][1]-rotateAround[1]+rotateAround[0], rotateAround[0]-this.coordinates[3][0]+rotateAround[1]],
                ];
                this.firstRotationI = false;
            }else{
                // rotate 90 degrees counter-clockwise with rotation matrix
                newCoordinates = [
                    [rotateAround[1]-this.coordinates[0][1]+rotateAround[0], this.coordinates[0][0]-rotateAround[0]+rotateAround[1]],
                    [rotateAround[1]-this.coordinates[1][1]+rotateAround[0], this.coordinates[1][0]-rotateAround[0]+rotateAround[1]],
                    [rotateAround[1]-this.coordinates[2][1]+rotateAround[0], this.coordinates[2][0]-rotateAround[0]+rotateAround[1]],
                    [rotateAround[1]-this.coordinates[3][1]+rotateAround[0], this.coordinates[3][0]-rotateAround[0]+rotateAround[1]],
                ];
                this.firstRotationI = true;
            }
        }else if(this.shape === 'O'){
            // no rotation
        }else{
            // rotate 90 degrees clockwise with rotation matrix
            newCoordinates = [
                [this.coordinates[0][1]-rotateAround[1]+rotateAround[0], rotateAround[0]-this.coordinates[0][0]+rotateAround[1]],
                [this.coordinates[1][1]-rotateAround[1]+rotateAround[0], rotateAround[0]-this.coordinates[1][0]+rotateAround[1]],
                [this.coordinates[2][1]-rotateAround[1]+rotateAround[0], rotateAround[0]-this.coordinates[2][0]+rotateAround[1]],
                [this.coordinates[3][1]-rotateAround[1]+rotateAround[0], rotateAround[0]-this.coordinates[3][0]+rotateAround[1]],
            ];
        }

        if(this.stayInside(newCoordinates)){
            this.coordinates = newCoordinates;
            return newCoordinates;
        }else{
            return [];
        }
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