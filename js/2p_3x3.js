//board setting
let BLANK=new Image()
let BOARD_SIZE=9;
let NOT_OCCUPIED=' ';
let HUMAN1='O';
let HUMAN2='X';

let board=new Array()
let choice;
let active_turn="";

let human1ImgPath='./images/astro2.jpg';
let human2ImgPath = './images/astro3.jpg';

let human1Img=new Image()
let human2Img=new Image()

let blank_src = './images/blank2.png'
let blank_on_hover_src = './images/blank.png'

human1Img.src = human1ImgPath;
human2Img.src = human2ImgPath;

let params = (new URL(document.location)).searchParams;
let human1=params.get('human1');
let human2=params.get('human2');

let messages=["It is a Tie",
    "Congratulations! HUMAN1 You won",
    "Congratulations! HUMAN2 You won"]

var moveSound = new Audio('./music/soundeffects.wav')
var loseSound = new Audio('./music/lose.wav')
var tieSound = new Audio('./music/drawresult.wav')
var winSound = new Audio('./music/win.wav')

var TURN=0;
module.exports.TURN=TURN;
function newboard()
{
    for(let i=0;i<BOARD_SIZE;i++)
    {
        board[i] = NOT_OCCUPIED;
        document.images[i].src = blank_src;

        tile = document.images[i];
        tile.onmouseover = function(){
            this.src = blank_on_hover_src;
            this.style.cursor="pointer";
        };

        tile.onmouseout = function(){
            this.src = blank_src;
            this.style.cursor="default";
        };
    }

    if (BOARD_SIZE == 9) {
        document.getElementById("size3").disabled = true;;
    }

    var turnInfo = document.getElementById("turnInfo");
    turnInfo.innerHTML='HUMAN1 as first Player';
    active_turn="HUMAN1";
}

function makeMove(pieceMove)
{
    TURN++;
    if(TURN%2!=0)
    {
        if(!isGameOver(board) && board[pieceMove]===NOT_OCCUPIED)
        {
            board[pieceMove]=HUMAN1;
            document.images[pieceMove].src = human1ImgPath;
            document.images[pieceMove].setAttribute("onmouseover", human1ImgPath)
        document.images[pieceMove].setAttribute("onmouseout", human1ImgPath)
        document.images[pieceMove].style.cursor="default";
        moveSound.play();
        }
        if(!isGameOver(board))
        {
            var alert=document.getElementById("turnInfo");
            active_turn="HUMAN2";
            alert.innerHTML=human2+" turn";
        }
    }

    if(TURN%2==0)
    {
        if(!isGameOver(board) && board[pieceMove]===NOT_OCCUPIED)
        {
            board[pieceMove]=HUMAN2;
            document.images[pieceMove].src = human2ImgPath;
            document.images[pieceMove].setAttribute("onmouseover", human2ImgPath)
        document.images[pieceMove].setAttribute("onmouseout", human2ImgPath)
        document.images[pieceMove].style.cursor="default";
        moveSound.play();
        }
        if(!isGameOver(board))
        {
            var alert=document.getElementById("turnInfo");
            active_turn="HUMAN1";
            alert.innerHTML=human1+" turn";
        }
    }

}

function gameScore(currentBoard, depth) {
    var score = checkWinningCondition(currentBoard);
    if (score === 1) {
        return 0;
    } else if (score === 2) {
        return depth - 10;
    } else if (score === 3) {
        return 10 - depth;
    }else {
        return 0;
    }
}

function hint()
{
    TURN++;
    console.log(TURN);
    if(TURN%2!=0)
    {
        active_turn="HUMAN1";
        minimax(board,0,-Infinity,+Infinity);
        var move=choice;
        board[move]=HUMAN1;
        document.images[move].src=human1ImgPath;
        document.images[move].setAttribute("onmouseover",human1ImgPath);
        document.images[move].setAttribute("onmouseout",human1ImgPath);
        document.images[move].style.cursor="default";
        choice=[];
        active_turn="HUMAN2";
        if (!isGameOver(board)) {
            var alert = document.getElementById("turnInfo");
            alert.innerHTML = "Think of the best strategy";
        }

    }
    if(TURN%2==0)
    {
        active_turn="HUMAN2";
        minimax(board,0,-Infinity,+Infinity);
        var move=choice;
        board[move]=HUMAN1;
        document.images[move].src=human2ImgPath;
        document.images[move].setAttribute("onmouseover",human2ImgPath);
        document.images[move].setAttribute("onmouseout",human2ImgPath);
        document.images[move].style.cursor="default";
        choice=[];
        active_turn="HUMAN2";
        if (!isGameOver(board)) {
            var alert = document.getElementById("turnInfo");
            alert.innerHTML = "Think of the best strategy";
        }
    }
}

function minimax(node,depth,alpha,beta)
{
    if (checkWinningCondition(node) === 1 ||
    checkWinningCondition(node) === 2 ||
    checkWinningCondition(node) === 3 ||depth==6)
    {
        return gameScore(node,depth);
    }
    depth+=1;

    var availableMoves=getAvailableMoves(node);

    if(active_turn=='HUMAN1')
    {
        for(var i=0;i<availableMoves.length;i++)
        {
            move=availableMoves[i];
            possibleGameResult=getNewState(move,node);
            result=minimax(possibleGameResult,depth,alpha,beta);
            node=undoMove(node,move);
            if(result>alpha)
            {
                alpha=result;
                if(depth===1)
                {
                    choice=move;
                }
                else if(alpha>=beta)
                {
                    return alpha;
                }
            }
           
        }
        return alpha;
    }
    else if(active_turn="HUMAN2")
    {
        for(var i=0;i<availableMoves.length;i++)
        {
            move=availableMoves[i];
            possibleGameResult=getNewState(move,node);
            result=minimax(possibleGameResult,depth,alpha,beta);
            node=undoMove(node,move);
            if(result<beta)
            {
                beta=result;
                if(depth===1)
                {
                    choice=move;
                }
                else if(beta<=alpha)
                {
                    return beta;
                }
            }
           
        }
        return beta;
    }


}

function undoMove(currentBoard, move) {
    currentBoard[move] = NOT_OCCUPIED;
    changeTurn();
    return currentBoard;
}

function getNewState(move, currentBoard) {
    var piece = changeTurn();
    currentBoard[move] = piece;
    return currentBoard;
}

function changeTurn() {
    var piece;
    if (active_turn === "HUMAN2") {
        piece = 'X';
        active_turn = "HUMAN1";
    } else {
        piece = 'O';
        active_turn = 'HUMAN2';
    }
    return piece;
}


function getAvailableMoves(currentBoard) {
    var possibleMoves = new Array();
    for (var i = 0; i < BOARD_SIZE; i++) {
        if (currentBoard[i] === NOT_OCCUPIED) {
            possibleMoves.push(i);
        }
    }
    return possibleMoves;
}

// Check for a winner.  Return
//   0 if no winner or tie yet
//   1 if it's a tie
//   2 if HUMAN1 wins
//   3 if HUMAN2 wins


function checkWinningCondition(currentBoard) {

    // checking for horizontal conditions
    for (i = 0; i <= 6; i += 3) {
        if (currentBoard[i] === HUMAN1 && currentBoard[i + 1] === HUMAN1 && currentBoard[i + 2] === HUMAN1)
            return 2;
        if (currentBoard[i] === HUMAN2 && currentBoard[i + 1] === HUMAN2 && currentBoard[i + 2] === HUMAN2)
            return 3;
    }

    // Check for vertical wins
    for (i = 0; i <= 2; i++) {
        if (currentBoard[i] === HUMAN1 && currentBoard[i + 3] === HUMAN1 && currentBoard[i + 6] === HUMAN1)
            return 2;
        if (currentBoard[i] === HUMAN2 && currentBoard[i + 3] === HUMAN2 && currentBoard[i + 6] === HUMAN2)
            return 3;
    }

    // Check for diagonal wins
    if ((currentBoard[0] === HUMAN1 && currentBoard[4] === HUMAN1 && currentBoard[8] === HUMAN1) ||
        (currentBoard[2] === HUMAN1 && currentBoard[4] === HUMAN1 && currentBoard[6] === HUMAN1))
        return 2;

    if ((currentBoard[0] === HUMAN2 && currentBoard[4] === HUMAN2 && currentBoard[8] === HUMAN2) ||
        (currentBoard[2] === HUMAN2 && currentBoard[4] === HUMAN2 && currentBoard[6] === HUMAN2))
        return 3;

    // Check for tie
    for (i = 0; i < BOARD_SIZE; i++) {
        if (currentBoard[i] !== HUMAN1 && currentBoard[i] !== HUMAN2)
            return 0;
    }
    return 1;
}

// Check for a winner.  Return
//   0 if no winner or tie yet
//   1 if it's a tie
//   2 if HUMAN wins
//   3 if COMPUTER wins
function isGameOver(board) {
    if (checkWinningCondition(board) === 0) {
        return false
    } else if (checkWinningCondition(board) === 1) {
        var turnInfo = document.getElementById("turnInfo");
        tieSound.play()
        turnInfo.innerHTML = messages[0];
    } else if (checkWinningCondition(board) === 2) {
        var turnInfo = document.getElementById("turnInfo");
        winSound.play();
        turnInfo.innerHTML = messages[1];
    } else {
        var turnInfo = document.getElementById("turnInfo");
        loseSound.play();
        turnInfo.innerHTML = messages[2];
    }
    return true;
}

