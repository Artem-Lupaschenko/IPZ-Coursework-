export default class View {
    constructor(element, width, height, rows, columns){
        this.element = element;
        this.width = width;
        this.height = height;

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext('2d');

        this.playfieldBorderWidth = 3;
        this.playfieldX = this.playfieldBorderWidth;
        this.playfieldY = this.playfieldBorderWidth;
        this.playfieldWidth = this.width * 2 / 3;
        this.playfieldHeight = this.height;
        this.playfieldInnerWidth = this.playfieldWidth - this.playfieldBorderWidth * 2;
        this.playfieldInnerHeight = this.playfieldHeight - this.playfieldBorderWidth * 2;

        this.blockWidth = this.playfieldInnerWidth / columns;
        this.blockHeight = this.playfieldInnerHeight / rows; 

        this.panelX = this.playfieldWidth + 10;
        this.panelY = 0;
        this.panelWidth = this.width / 3;
        this.panelHeight = this.height;

        this.difficultyPanelX = {
            'easy': this.width / 2 - 80,
            'medium': this.width / 2,
            'hard': this.width / 2 + 80
        }
        this.difficultyPanelY = this.height / 2 + 70

        this.element.appendChild(this.canvas);
    }

    renderMainScreen(state) {
        this.clearScreen();
        this.renderPlayfield(state);
        this.renderPanel(state);
    }

    renderStartScreen() {
        this.clearScreen();
        this.context.fillStyle = 'saddlebrown';
        this.context.font = '36px "Arial"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText('Press ENTER to Start', this.width / 2, this.height / 2);
        this.context.font = '12px "Arial"';
        this.context.fillText('Press (E, M, H) to Change Difficulty', this.width / 2, this.height / 2 + 30);
        
        this.renderDifficultyPanel();
    }

    renderPauseScreen() {
        this.context.fillStyle = 'rgba(245,222,179,0.75)';
        this.context.fillRect(0, 0, this.width, this.height);

        this.context.fillStyle = 'saddlebrown';
        this.context.font = '36px "Arial"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText('Press ENTER to Resume', this.width / 2, this.height / 2);
        this.context.fillText('Press ESCAPE to Return', this.width / 2, this.height / 2 + 40);
    }

    renderEndScreen({score}) {
        this.clearScreen();

        this.context.fillStyle = 'saddlebrown';
        this.context.font = '36px "Arial"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText('GAME OVER', this.width / 2, this.height / 2 - 48);
        this.context.fillText(`Score: ${score}`, this.width / 2, this.height / 2);
        this.context.fillText('Press ENTER to Restart', this.width / 2, this.height / 2 + 48);
    }

    clearScreen() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    renderPlayfield({playfield}) {
        for (let y = 0; y < playfield.length; y++) {
            const line = playfield[y];
            
            for (let x = 0; x < line.length; x++) {
                const block = line[x];
                
                if (block) {
                    this.renderBlock(
                        this.playfieldX + (x * this.blockWidth), 
                        this.playfieldY + (y * this.blockHeight), 
                        this.blockWidth, 
                        this.blockHeight
                    );
                }
            }
        }
        this.context.strokeStyle = "saddlebrown";
        this.context.lineWidth = this.playfieldBorderWidth;
        this.context.strokeRect(0, 0, this.playfieldWidth, this.playfieldHeight);

    }

    renderPanel({level, difficulty, score, lines, nextPiece}) {
        this.context.textAlign = 'start';
        this.context.textBaseline = 'top';
        this.context.fillStyle = 'saddlebrown';
        this.context.font = '18px "Arial"';

        this.context.fillText(`Score: ${score}`, this.panelX, this.panelY + 0);
        this.context.fillText(`Lines: ${lines}`, this.panelX, this.panelY + 24);
        this.context.fillText(`Level: ${level}`, this.panelX, this.panelY + 48);
        this.context.fillText(`Difficulty: ${difficulty}`, this.panelX, this.panelY + 72);
        this.context.fillText('Next:', this.panelX, this.panelY + 96);

        for (let y = 0; y < nextPiece.blocks.length; y++) {
            for (let x = 0; x < nextPiece.blocks[y].length; x++) {
                const block = nextPiece.blocks[y][x];

                if (block) {
                    this.renderBlock(
                        this.panelX + (x * this.blockWidth * 0.5),
                        this.panelY + 110 + (y * this.blockHeight * 0.5),
                        this.blockWidth * 0.5,
                        this.blockHeight * 0.5
                    );
                }
            }
            
        }
    }

    renderBlock(x, y, width, height) {
        const innerWidth = width / 2;
        const innerHeight = height / 2;;
        const innerX = x + (width - innerWidth) / 2;
        const innerY = y + (height - innerHeight) / 2;

        this.context.fillStyle = 'wheat';
        this.context.strokeStyle = 'saddlebrown';
        this.context.lineWidth = 2;

        this.context.fillRect(x, y, width, height);
        this.context.strokeRect(x, y, width, height);

        this.context.fillStyle = 'saddlebrown';
        this.context.fillRect(innerX, innerY, innerWidth, innerHeight);
    }

    renderDifficultyPanel() {
        this.context.font = '16px "Arial"';

        this.context.fillText('EASY', this.difficultyPanelX['easy'], this.difficultyPanelY);
        this.context.fillText('MEDIUM', this.difficultyPanelX['medium'], this.difficultyPanelY);
        this.context.fillText('HARD', this.difficultyPanelX['hard'], this.difficultyPanelY);
    }

    addUnderline(text, x) {
        text = text.toUpperCase();
        const underlineOffset = 10;
        const textWidth = this.context.measureText(text).width;
        const textBoundingBoxDescent = this.context.measureText(text).fontBoundingBoxDescent;
        const startX = x - (textWidth / 2);
        const endX = startX + textWidth;

        this.context.clearRect(0, this.difficultyPanelY + textBoundingBoxDescent, this.width, this.height);
        this.context.beginPath();
        this.context.lineWidth = 1;
        this.context.strokeStyle = 'saddlebrown';
        this.context.moveTo(startX, this.difficultyPanelY + underlineOffset);
        this.context.lineTo(endX, this.difficultyPanelY + underlineOffset);
        this.context.stroke();
    }
}