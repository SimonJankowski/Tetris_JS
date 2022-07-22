const grid = document.querySelector(".grid");
let squares = Array.from(document.querySelectorAll(".grid div"));
const scoreDisplay = document.querySelector("#score");
const startBtn = document.querySelector("#start-btn");

const width = 10;
let nextRandom= 0;
let timerId;
let score = 0;
const colors = [
    "orange",
    "red",
    "purple",
    "blue",
    "green"
]

const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
]

const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ]

  const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]

  const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]

  const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

  let currentPosition = 3;
  let currentRotation = 0;

  // randomly select a Tetromino and it´s first roatation
  let random = Math.floor(Math.random() * theTetrominoes.length);
  
  let current = theTetrominoes[random][currentRotation];

  //draw the first rotation in the first tetromino
  const draw = () => {
    current.forEach((idx)=>{
        squares[currentPosition + idx].classList.add("tetromino");
        squares[currentPosition + idx].style.backgroundColor = colors[random]
    })
  }

  draw();

  //undraw
  const undraw = () => {
    current.forEach(idx =>{
        squares[currentPosition + idx].classList.remove("tetromino")
        squares[currentPosition + idx].style.backgroundColor = ""
    })
  }

  // move piece down every second
  const moveDown = () => {
    undraw();
    currentPosition+=width;
    draw();
    freeze();
  }

//   timerId = setInterval(moveDown, 500)

  const control = (e) => {
    if(e.keyCode ===37) {
        moveLeft();
    } else if (e.keyCode === 38) {
        rotate();
    } else if (e.keyCode === 39) {
        moveRight();
    } else if (e.keyCode === 40) {
        // drop?
    }
  }
  document.addEventListener("keyup", control)

  const freeze = () => {
    if(current.some(idx => squares[currentPosition + idx + width].classList.contains("taken"))){
        current.forEach(idx => squares[currentPosition + idx].classList.add("taken"));
        random = nextRandom
        nextRandom = Math.floor(Math.random() * theTetrominoes.length)
        current = theTetrominoes[random][currentRotation];
        currentPosition = 4;
        draw();
        displayShape();
        addScore();
        gameOver();
    }
  }

  const moveLeft = () => {
    undraw();
    const isAtLeftEdge = current.some(idx=> (currentPosition + idx) % width === 0)
    if(!isAtLeftEdge) currentPosition -=1;

    if(current.some(idx=>squares[currentPosition + idx].classList.contains("taken")))
        currentPosition +=1;
    draw();
  }

  const moveRight = () => {
    undraw();
    const isAtRightEdge = current.some(idx => (currentPosition + idx) % width === width-1)

    if(!isAtRightEdge) currentPosition +=1;

    if(current.some(idx=> squares[currentPosition + idx].classList.contains("taken"))){
        currentPosition -=1;
    }
    draw();
  }

  const rotate = () => {
    undraw();
    currentRotation ++;
    if(currentRotation === current.length){
        currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation]
    console.log(current, currentRotation)
    draw();
  }

  const displaySquares = document.querySelectorAll(".mini-grid div");
  const displayWidth = 4;
  let displayIdx = 0;

  const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2],
    [0,displayWidth,displayWidth+1,displayWidth*2+1],
    [1,displayWidth,displayWidth+1,displayWidth+2],
    [0,1,displayWidth,displayWidth+1],
    [1,displayWidth+1,displayWidth*2+1,displayWidth*3+1],
  ]


  const displayShape = () => {
    displaySquares.forEach(square=>{
        square.classList.remove("tetromino")
        square.style.backgroundColor="";
    })
    upNextTetrominoes[nextRandom].forEach(idx => {
        displaySquares[displayIdx+idx].classList.add("tetromino")
        displaySquares[displayIdx+idx].style.backgroundColor = colors[nextRandom]
    })
  }

  startBtn.addEventListener("click", ()=>{
    if(timerId){
        clearInterval(timerId)
        timerId = null;
    } else {
        draw();
        timerId = setInterval(moveDown, 200);
        nextRandom = Math.floor(Math.random() * theTetrominoes.length);
        displayShape()
    }
  })

  //add score

  const addScore = () => {
    for (let i=0; i < 199; i+=width) {
        const row = [i,i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

        if(row.every(idx=>squares[idx].classList.contains("taken"))){
            score+= 10;
            scoreDisplay.innerHTML = score;
            row.forEach(idx=>{
                squares[idx].classList.remove("taken");
                squares[idx].classList.remove("tetromino");
                squares[idx].style.backgroundColor = "";
            })
            const squaresRemoved = squares.splice(i,width)
            squares = squaresRemoved.concat(squares);
            squares.forEach(cell => grid.appendChild(cell))
            
        }
    }
  }

  const gameOver = () => {
    if(current.some(idx => squares[currentPosition+idx].classList.contains("taken"))){
        scoreDisplay.innerHTML = 'end';
        clearInterval(timerId)
    }
  }