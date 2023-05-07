<script>
    const pieceURL = "https://www.chess.com/chess-themes/pieces/neo/150/";
    const boardTemplate = ["wk", "wn", "wr", "", "", "", "br", "bn", "bk", ""];
    const colors = ["rgb(181, 136, 99)", "rgb(240, 217, 181)"];
    const selectedColors = ["rgb(219, 195, 73)", "rgb(248, 236, 117)"];
    let board = boardTemplate;
    let highlightedSquare;
    let currentLegalMoves = [];
    const boardHTML = document.querySelector("#chess-board");
    const over = document.querySelector("#game-over");
    let currentSquare = 9;
    let turn = "w";

    for(let i = 0; i < boardTemplate.length - 1; i++) {
        boardHTML.children[i].setAttribute("piece", boardTemplate[i]);
        boardHTML.children[i].addEventListener("click", function() {
            let match = 0;
            let square = 0;
            for(let j = 0; j < boardHTML.childElementCount; j++) {
                match = (this === boardHTML.children[j]) ? j : match;
            }
            if(board[currentSquare][0] !== turn && board[match][0] !== turn) return;
            square = (board[match][0] !== turn) ? currentSquare : match;
            let color = board[square][0];
            let legalMove = false;
            let gotHint = [];
            if((currentSquare != 9 && turn == color) || (board[currentSquare][0] == color && turn == color)) {
                for(let k = 0; k < boardHTML.childElementCount; k++) {
                    try {
                        boardHTML.children[k].querySelector(".legal-move").parentNode.removeChild(boardHTML.children[k].querySelector(".legal-move"));
                    } catch {}
                }
            }
            for(let n = 0; n < 2; n++) {
                for(let k = 0; k < getLegalMoves(board[square][1], square, color)[n].length; k++) {
                    let move = getLegalMoves(board[square][1], square, color)[n][k];
                    if(move == match && currentSquare != 9) {
                        legalMove = true;
                        currentLegalMoves.push(move);
                    }
                    try {
                        if(currentSquare == 9 || board[currentSquare][0] == color) {
                            boardHTML.children[move].appendChild(getHint());
                        }
                    } catch {}
                }
            }
            for(let k = 0; k < boardHTML.childElementCount; k++) {
                if(!!boardHTML.children[k].querySelector(".legal-move")) {
                    gotHint.push(k);
                }
            }
            color = board[match][0];
            if(board[currentSquare] != "" && board[currentSquare][0] != color && legalMove) {
                updateBoard(movePiece(board, currentSquare, match));
                turn = (turn == "w") ? "b" : "w";
                boardHTML.children[highlightedSquare].style.background = colors[highlightedSquare % 2];
                currentSquare = 9;
            } else {
                if(board[currentSquare] == board[match]) {
                    currentSquare = 9;
                } else if(turn == color) {
                    try {
                        boardHTML.children[highlightedSquare].style.background = colors[highlightedSquare % 2];
                    } catch {}
                    highlightedSquare = match;
                    currentSquare = match;
                    boardHTML.children[match].style.background = selectedColors[match % 2];
                }
            }
            isOpressed(currentSquare, color, true);
        });
        if(boardTemplate[i] != "") {
            let piece = document.createElement("img");
            piece.classList.add("chess-piece");
            piece.src = `${pieceURL}${boardTemplate[i]}.png`;
            boardHTML.children[i].appendChild(piece);
        }
    }
    function getHint() {
        var hint = document.createElement("div");
        hint.classList.add("legal-move");
        return hint;
    }
    function movePiece(position, start, end) {
        var pos = position;
        pos[end] = pos[start];
        pos[start] = "";
        return pos;
    }
    function getLegalMoves(piece, position, color) {
        var before = [];
        var after = [];
        if(piece == "r") {
            try {
                for(let i = 0; i < position - 1; i++) {
                    if(board[position - 1 - i][0] == color) {
                        break;
                    }
                    if(board[position - 1 - i] == "") {
                        before.push(position - 1 - i);
                    } else {
                        before.push(position - 1 - i);
                        break;
                    }
                }
            } catch {}
            try {
                for(let i = 0; i < board.length - position; i++) {
                    if(board[position + 1 + i][0] == color) {
                        break;
                    }
                    if(board[position + 1 + i] == "") {
                        after.push(position + 1 + i);
                    } else {
                        after.push(position + 1 + i);
                        break;
                    }
                }
            } catch {}
            return [before, after];
        }
        if(piece == "n") {
            try {
                if(board[position - 2] == "" || board[position - 2][0] != color) {
                    before.push(position - 2);
                }
            } catch {}
            try {
                if(board[position + 2] == "" || board[position + 2][0] != color) {
                    before.push(position + 2);
                }
            } catch {}
            return [before, after];
        }
        if(piece == "k") {
            try {
                let behind = isOpressed(position - 1, color, false);
                let front = isOpressed(position + 1, color, false);
                if(behind) {
                    before.push(position - 1);
                }
                if(front) {
                    before.push(position + 1);
                }
            } catch {}
            return [before, after];
        }
    }
    function updateBoard(update) {
        board = update;
        for(var i = 0; i < boardHTML.childElementCount; i++) {
            boardHTML.children[i].setAttribute("piece", update[i]);
            var element = boardHTML.children[i];
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
            if(update[i] != "") {
                let piece = document.createElement("img");
                piece.classList.add("chess-piece");
                piece.src = `${pieceURL}${update[i]}.png`;
                boardHTML.children[i].appendChild(piece);
            }
        }
    }
    function isOpressed(square, color, mate) {
        if(!mate) {
            let oppositeColor = (color == "w") ? "b" : "w";
            let rook = getLegalMoves("r", board.indexOf(`${oppositeColor}r`), oppositeColor);
            for(let i = 0; i < rook.length; i++) {
                for(let k = 0; k < rook[i].length; k++) {
                    if(square == rook[i][k]) {
                        return true;
                    }
                }
            }
            let knight = getLegalMoves("n", board.indexOf(`${oppositeColor}n`), oppositeColor);
            for(let i = 0; i < knight.length; i++) {
                for(let k = 0; k < knight[i].length; k++) {
                    if(square == knight[i][k]) {
                        return true;
                    }
                }
            }
            let king = board.indexOf(`${oppositeColor}k`);
            if(square == king || square == king + 1 || square == king - 1) {
                return true;
            }
            return false;
        } else {
            let king = board.indexOf(`${color}k`);
            let check = isOpressed(king, color, false);
            if(check) {
                let possibleSquares = [];
                if(king == 8) {
                    possibleSquares = [king - 1];
                } else if(king == 0) {
                    possibleSquares = [king + 1];
                }
                let allOppressed = true;
                for(let k = 0; k < possibleSquares.length; k++) {
                    if(!isOpressed(possibleSquares[k], color, false)) {
                        allOppressed = false;
                    }
                }
                if(allOppressed) {
                    over.style.display = "block";
                    over.textContent = ((color == "w") ? "White" : "Black") + " has lost";
                    if(color == "b") {
                        over.textContent += ". Just like the 1800s!";
                    }
                }
            }
        }
    }
</script>

<style>
    #chess-board {
        display: flex;
        flex-direction: row;
    }
    .square {
        width: 5em;
        height: 5em;
        display: flex;
        justify-content: center;
        align-items: center;
        background-position: center;
        background-size: contain;
    }
    .square > img {
        cursor: pointer;
    }
    .square:nth-of-type(2n - 1) {
        background-color: rgb(181, 136, 99);
    }
    .square:nth-of-type(2n) {
        background-color: rgb(240, 217, 181);
    }
    .chess-piece {
        width: 100%;
        height: 100%;
    }
    .legal-move {
        background-color: rgba(0,0,0,.1);
        width: 35%;
        height: 35%;
        border-radius: 50%;
    }
</style>


<section id="chess-board">
    <div class="square"></div>
    <div class="square"></div>
    <div class="square"></div>
    <div class="square"></div>
    <div class="square"></div>
    <div class="square"></div>
    <div class="square"></div>
    <div class="square"></div>
    <div class="square"></div>
</section>
<script src="embed.js"></script>
