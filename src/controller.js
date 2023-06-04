export default class Controller {
    constructor(game, view) {
        this.game = game;
        this.view = view;
        this.intervalId = null;
        this.isPlaying = false;
        this.difficulties = {
            'easy': -1000,
            'medium': -200,
            'hard': 100
        };

        document.addEventListener('keydown', this.handleKeyDown.bind(this)); 
        document.addEventListener('keyup', this.handleKeyUp.bind(this)); 
        document.addEventListener('keypress', this.handleKeyPress.bind(this));  
        
        this.view.renderStartScreen();
        this.changeDifficulty('easy');
    }

    update() {
        this.game.movePieceDown();
        this.updateView();
    }

    play() {
        this.isPlaying = true;
        this.startTimer();
        this.updateView();
    }

    pause() {
        this.isPlaying = false;
        this.stopTimer();
        this.updateView();
    }

    reset() {
        this.game.reset();
        this.play();
    }

    return() {
        const difficulty = this.game.getState()['difficulty'];

        this.game.reset();
        this.view.renderStartScreen();
        this.changeDifficulty(difficulty);
    }

    changeDifficulty(value) {
        this.game.difficulty = value;
        this.view.addUnderline(value, this.view.difficultyPanelX[value]);
    }

    updateView() {
        const state = this.game.getState();

        if (state.isGameOver) {
            this.view.renderEndScreen(state)
        } else if (!this.isPlaying) {
            this.view.renderPauseScreen();
        } else {
            this.view.renderMainScreen(state);
        }
        
    }

    startTimer() {
        const difficulty = this.game.getState()['difficulty'];
        const speed = 1000 - this.difficulties[difficulty] - this.game.getState().level * 100;

        if (!this.intervalId) {
            this.intervalId = setInterval(() => {
                this.update();
            }, speed > 0 ? speed : 100);
        }
    }

    stopTimer() {
        if (this.intervalId) {
            clearInterval(this.intervalId)
            this.intervalId = null;
        }
    }

    handleKeyDown(event) {
        const state = this.game.getState();

        switch (event.key) {
            case 'Enter':
                if (state.isGameOver) {
                    this.reset();
                } else if (this.isPlaying) {
                    this.pause();
                } else {
                    this.play();
                }
                break;
            case 'Escape':
                if (!this.isPlaying) {
                    this.return();
                } 
                break;
            case 'ArrowLeft':
                if (this.isPlaying) {
                    this.game.movePieceLeft();
                    this.updateView();
                    break;
                }
            case 'ArrowUp':
                if (this.isPlaying) {
                    this.game.rotatePiece();
                    this.updateView();
                    break;
                }
            case 'ArrowRight':
                if (this.isPlaying) {
                    this.game.movePieceRight();
                    this.updateView();
                    break;
                }
            case 'ArrowDown':
                if (this.isPlaying) {
                    this.stopTimer();
                    this.game.movePieceDown();
                    this.updateView();
                    break;
                }
        }
    }

    handleKeyUp(event) {
        switch (event.key) {
            case 'ArrowDown':
                if (this.isPlaying) {
                    this.startTimer();
                    break;
                }
        }
    }

    handleKeyPress(event) {
        switch (event.key) {
            case 'e':
                if (!this.isPlaying) {
                    this.changeDifficulty('easy')
                    break;
                }
            case 'h':
                if (!this.isPlaying) {
                    this.changeDifficulty('hard')
                    break;
                }
            case 'm':
                if (!this.isPlaying) {
                    this.changeDifficulty('medium')
                    break;
                }
        }
    }
}