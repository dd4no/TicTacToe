// Dave Defourneaux
// dave.defourneaux@gmail.com
// github.com/dd4no


// GLOBAL VARIABLES

// Initialize active player
let activePlayer = "X";  
// Store array of squares played
let squaresPlayed = []; 


// MAIN PROGRAM

// Choose Square
function chooseSquare(number) {
    // If square selected is NOT in the array proceed
    if (!squaresPlayed.some(element => element.includes(number))) {
        // Select the HTML element with the id of the square number chosen
        let select = document.getElementById(number);
        // Change element style to display appropriate image
        if (activePlayer === "X") {
            select.style.backgroundImage = "url('./images/x.png')";
        }
        else {
            select.style.backgroundImage = "url('images/o.png')";
        }
        // Play sound effect
        audio("./media/place.mp3");
        // Add played square to the array
        squaresPlayed.push(number + activePlayer);
        // Check for win
        checkWin();
        // Switch active players
        if (activePlayer === "X") {
            activePlayer = "O";
        }
        else {
            activePlayer = "X";
        }
        // Disable interface and pause 1 second and run computer turn        
        if (activePlayer === "O") {
            disableClick();
            setTimeout(function() { computerTurn(); }, 1000);
        }
        // Returns to computerTurn()
        return true;
    }

    // Computer Turn
    function computerTurn() {
        // Initialize loop variable
        let success = false;
        // Store a random number
        let pickSquare;
        // While number is NOT in array continue trying
        while (!success) {
            // Generate a random number between 0 and 8
            pickSquare = String(Math.floor(Math.random() * 9));
            // Check if number is in array of played squares
            if (chooseSquare(pickSquare)) {
                // Call function if true
                chooseSquare(pickSquare);
                // End the loop
                success = true;
            }
        }
    }
}


// Check For Win
function checkWin() {
    //console.log(squaresPlayed);
    // Check all conditions for win and call function to draw line
    // ROW WIN "X"
    if      (arrayIncludes("0X", "1X", "2X")) { drawWin(50,100,558,100);}    
    else if (arrayIncludes("3X", "4X", "5X")) { drawWin(50,304,558,304);}
    else if (arrayIncludes("6X", "7X", "8X")) { drawWin(50,508,558,508);}
    // COLUMN WIN "X"
    else if (arrayIncludes("0X", "3X", "6X")) { drawWin(100,50,100,558);}
    else if (arrayIncludes("1X", "4X", "7X")) { drawWin(304,50,304,558);}
    else if (arrayIncludes("2X", "5X", "8X")) { drawWin(508,50,508,558);}
    // DIAGONAL WIN "X"
    else if (arrayIncludes("6X", "4X", "2X")) { drawWin(100,508,510,90);}
    else if (arrayIncludes("0X", "4X", "8X")) { drawWin(100,100,508,508);}
    
    // ROW WIN "O"
    else if (arrayIncludes("0O", "1O", "2O")) { drawWin(50,100,558,100);}
    else if (arrayIncludes("3O", "4O", "5O")) { drawWin(50,304,558,304);}
    else if (arrayIncludes("6O", "7O", "8O")) { drawWin(50,508,558,508);}
    // COLUMN WIN "O"
    else if (arrayIncludes("0O", "3O", "6O")) { drawWin(100,50,100,558);}
    else if (arrayIncludes("1O", "4O", "7O")) { drawWin(304,50,304,558);}
    else if (arrayIncludes("2O", "5O", "8O")) { drawWin(508,50,508,558);}
    // DIAGONAL WIN "O"
    else if (arrayIncludes("6O", "4O", "2O")) { drawWin(100,508,508,100);}
    else if (arrayIncludes("0O", "4O", "8O")) { drawWin(100,100,508,508);}
    // TIE CONDITIONS
    else if (squaresPlayed.length >= 9) {
        // Play sound effect
        audio("./media/tie.mp3");
        // Pause 1 second and reset game
        setTimeout(function() { resetGame(); }, 1000)
    }
    // Evaluate winning conditions
    function arrayIncludes(A, B, C) {
        const a = squaresPlayed.includes(A);
        const b = squaresPlayed.includes(B);
        const c = squaresPlayed.includes(C);
        //console.log(a,b,c)
        // All three must be present in the array of played squares for a win
        if (a === true && b === true && c === true) { return true; }
    }
}


// Disable interaction
function disableClick() {
    body.style.pointerEvents = "none";
    // Restore interaction after 1 second
    setTimeout(function() {body.style.pointerEvents = "auto"; }, 1000);
}


// Play audio clips
function audio(url) {
    let audio = new Audio(url);
    audio.play();
}


// Draw win line
function drawWin(X1,Y1,X2,Y2) {
    // Access the canvas element and methods
    const canvas = document.getElementById("overlay");
    const c = canvas.getContext("2d");
    // Assign win coordinates
    // Starting and ending points
    let x1 = X1, y1 = Y1, x2 = X2, y2 = Y2, 
    // Temp storage for animation
    x = x1, y = y1;
    // Draw line
    function draw() {
        // Establish the animation and clear the canvas
        const loop = requestAnimationFrame(draw);
        c.clearRect(0,0,608,608);
        c.beginPath();
        // Move starting position
        c.moveTo(x1,y1);
        c.lineTo(x,y);
        // Style the line
        c.lineWidth = 10;
        c.strokeStyle = "rgba(70,255,33,.8)";
        // Draw the line
        c.stroke();
        // If starting point is less than ending point keep drawing
        // Rows and Columns
        if (x1 <= x2 && y1 <= y2) {
            // Lengthen the line each iteration
            if (x < x2) { x += 10; }
            if (y < y2) { y += 10; }
            // End loop when ending point is met or exeeded
            if (x >= x2 && y >= y2) { cancelAnimationFrame(loop); }
        }
        // Diagonal
        if (x1 <= x2 && y1 >= y2) {
            if (x < x2) { x += 10; }
            if (y > y2) { y -= 10; }
            if (x >= x2 && y <= y2) { cancelAnimationFrame(loop); }
        }

    }

    // Clear the canvas
    function clear() {
        const loop = requestAnimationFrame(clear);
        c.clearRect(0,0,608,608);
        cancelAnimationFrame(loop);
    }
    // Disable the interface
    disableClick();
    // Play the sound effect
    audio("./media/winGame.mp3");
    // Call to draw the line
    draw();
    // Pause 1 second, clear the canvas, and call for reset
    setTimeout(function() { clear(); resetGame(); }, 1000);
}


// Reset the board
function resetGame() {
    // Loop through all squares and remove images
    for (let i=0; i<9; i++) {
        let square = document.getElementById(String(i));
        square.style.backgroundImage = "none";
    }
    // Reset the array
    squaresPlayed = [];
}