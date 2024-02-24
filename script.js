document.addEventListener("DOMContentLoaded", function() {
    const boxes = document.querySelectorAll(".box");
    const resetBtn = document.querySelector("#reset-button");
    const newGameBtn = document.querySelector("#new-btn");
    const msgContainer = document.querySelector(".msg-container");
    const msg = document.querySelector("#msg");
    const compCheckbox = document.querySelector("#comp-checkbox");
    const player1Name = document.querySelector("#player1");
    const player2Name = document.querySelector("#player2");
    const startGameBtn = document.querySelector("#start-game-btn");
    const sidebar = document.querySelector("#sidebar");
    const toggleBtn = document.querySelector("#toggle-btn");
    const crossBtn = document.querySelector("#cross-btn");

    let currentPlayer;
    let player1 = "Player 1";
    let player2 = "Player 2";
    let isComputer = false;
    let turnO = true;
    let count = 0;
    let gameStarted = false;

    const winPattern = [
        [0, 1, 2],
        [0, 3, 6],
        [0, 4, 8],
        [1, 4, 7],
        [2, 5, 8],
        [2, 4, 6],
        [3, 4, 5],
        [6, 7, 8]
    ];

    const resetGame = () => {
        turnO = true;
        count = 0;
        enableBoxes();
        msgContainer.classList.add("hide");
        currentPlayer = null;
        gameStarted = false;
    };

    const togglePlayer = () => {
        turnO = !turnO;
        if (!turnO && isComputer) {
            setTimeout(makeComputerMove, 500);
        }
    };

    const makeComputerMove = () => {
        const winningMove = getWinningMove();
        const blockingMove = getBlockingMove();
        const move = winningMove || blockingMove || getRandomMove();
        move.innerText = "X";
        move.disabled = true;
        count++;
        togglePlayer();
        checkWinner();
    };

    const getWinningMove = () => {
        for (let pattern of winPattern) {
            const [pos1, pos2, pos3] = pattern;
            const val1 = boxes[pos1].innerText;
            const val2 = boxes[pos2].innerText;
            const val3 = boxes[pos3].innerText;

            if ((val1 === "X" && val2 === "X" && val3 === "") ||
                (val1 === "X" && val3 === "X" && val2 === "") ||
                (val2 === "X" && val3 === "X" && val1 === "")) {
                return boxes[val1 === "" ? pos1 : (val2 === "" ? pos2 : pos3)];
            }
        }
        return null;
    };

    const getBlockingMove = () => {
        for (let pattern of winPattern) {
            const [pos1, pos2, pos3] = pattern;
            const val1 = boxes[pos1].innerText;
            const val2 = boxes[pos2].innerText;
            const val3 = boxes[pos3].innerText;

            if ((val1 === "O" && val2 === "O" && val3 === "") ||
                (val1 === "O" && val3 === "O" && val2 === "") ||
                (val2 === "O" && val3 === "O" && val1 === "")) {
                return boxes[val1 === "" ? pos1 : (val2 === "" ? pos2 : pos3)];
            }
        }
        return null;
    };

    const getRandomMove = () => {
        const emptyBoxes = [...boxes].filter(box => box.innerText === "");
        const randomIndex = Math.floor(Math.random() * emptyBoxes.length);
        return emptyBoxes[randomIndex];
    };

    const savePlayerNames = () => {
        player1 = player1Name.value.trim() || "Player 1";
        player2 = player2Name.value.trim() || "Player 2";
    };

    const startGame = () => {
        savePlayerNames();
        currentPlayer = turnO ? player1 : player2;
        sidebar.classList.remove("show-sidebar");
        resetGame();
        enableBoxes();
        gameStarted = true;
    };

    const gameDraw = () => {
        msgContainer.classList.remove("hide");
        msg.innerText = `Game was a Draw.`;
        disableBoxes();
    };

    const disableBoxes = () => {
        for (let box of boxes) {
            box.disabled = true;
        }
    };

    const enableBoxes = () => {
        for (let box of boxes) {
            box.disabled = false;
            box.innerText = "";
        }
    };

    const showWinner = (winner) => {
        msg.innerText = `Congratulations, ${winner} is the Winner!`;
        msgContainer.classList.remove("hide");
        disableBoxes();
    };

    const checkWinner = () => {
        for (let pattern of winPattern) {
            let pos1Val = boxes[pattern[0]].innerText;
            let pos2Val = boxes[pattern[1]].innerText;
            let pos3Val = boxes[pattern[2]].innerText;
            if (pos1Val !== "" && pos2Val !== "" && pos3Val !== "") {
                if (pos1Val === pos2Val && pos2Val === pos3Val) {
                    // Check if Player 1 wins
                    if (pos1Val === "O") {
                        showWinner(player1);
                        return true;
                    }
                    // If not Player 1, check if it's Player 2 (computer)
                    else if (pos1Val === "X") {
                        showWinner(player2);
                        return true;
                    }
                }
            }
        }
        if (count === 9) {
            gameDraw();
            return true;
        }
        return false;
    };
    

    boxes.forEach(box => {
        box.addEventListener("click", () => {
            if (gameStarted && box.innerText === "" && !checkWinner()) {
                box.innerText = turnO ? "O" : "X";
                // Increment the move count
                count++;
                // Toggle the player after each move
                togglePlayer();
                // Check for a winner after the current player's move
                if(checkWinner()){
                    return;
                }
                // If playing against the computer, let the computer make its move
                if (isComputer && currentPlayer === player2) {
                    makeComputerMove();
                    if(checkWinner()){
                        return;
                    }
                    else{
                        togglePlayer();
                    }
                }
            }
        });
    });
     

    newGameBtn.addEventListener("click", () => {
        sidebar.classList.remove("show-sidebar");
        resetGame();
        toggleBtn.style.display = "block";
    });

    resetBtn.addEventListener("click", () => {
        //sidebar.classList.remove("show-sidebar");
        resetGame();
        resetPlayerNames();
        toggleBtn.style.display = "block";
    });

    const resetPlayerNames = () => {
        player1Name.value = "";
        player2Name.value = "";
        compCheckbox.checked = false;
        isComputer = false;
        player2Name.disabled = false;
    };

    const showSidebar = () => {
        sidebar.classList.add("show-sidebar");
        toggleBtn.style.display = "none"; 
    };

    const hideSidebar = () => {
        sidebar.classList.remove("show-sidebar");
        toggleBtn.style.display = "block"; 
    };
    
    startGameBtn.addEventListener("click", () => {
        startGame();
        toggleBtn.style.display = "block";
    });
    crossBtn.addEventListener("click", hideSidebar);
    toggleBtn.addEventListener("click", showSidebar);

    compCheckbox.addEventListener("change", () => {
        isComputer = compCheckbox.checked;
        if (isComputer) {
            player2Name.value = "Computer";
            player2Name.disabled = true;
        } else {
            player2Name.value = "";
            player2Name.disabled = false;
        }
    });
});