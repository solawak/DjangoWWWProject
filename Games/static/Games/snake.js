const board_border = 'black';
const board_background = "white";
const snake_col = 'lightblue';
const snake_border = 'darkblue';

let snake = [
    {x: 200, y: 200},
    {x: 190, y: 200},
    {x: 180, y: 200},
    {x: 170, y: 200},
    {x: 160, y: 200}
]

let score = 0;
let changing_direction = false;
let food_x;
let food_y;
let dx = 10;
let dy = 0;

const snakeboard = document.getElementById("snakeboard");
const snakeboard_ctx = snakeboard.getContext("2d");
main();

gen_food();

document.addEventListener("keydown", function (event) {
    handle_arrows(event);
    event.preventDefault();
});

document.addEventListener("touchstart", function (e) {
    touchHandler(e);
});

function handleCursorPosition(x, y) {
    let pos = '';
    if (x > Math.abs(y)) {
        pos = 'right';
    } else if (y > Math.abs(x)) {
        pos = 'down';
    } else if (-x > Math.abs(y)) {
        pos = 'left';
    } else if (-y > Math.abs(x)) {
        pos = 'up';
    }
    if (pos !== '') {
        change_direction(pos);
    }
}

function touchHandler(e) {
    const screen_width = document.documentElement.clientWidth;
    const screen_height = document.documentElement.clientHeight;
    var ratio = window.devicePixelRatio || 1;
    var w = screen.width / ratio;
    var h = screen.height / ratio;
    let touchX;
    let touchY;
    let X;
    let Y;
    if (e.touches) {
        X = e.touches[0].screenX;
        Y = e.touches[0].screenY;
        touchX = e.touches[0].screenX - screen_width / 2;
        touchY = e.touches[0].screenY - screen_height / 2;
        document.getElementById("1").innerHTML = "width: " + w.toString() + " | height: " + h.toString() + " ratio:" + ratio.toString();
        document.getElementById("2").innerHTML = "touchx: " + X.toString() + " | touchy: " + Y.toString();
        document.getElementById("3").innerHTML = (X - screen_width / 2).toString() + " | " + (Y- screen_width / 2).toString();
        document.getElementById("4").innerHTML = (X - screen_width).toString() + " | " + (Y- screen_width).toString();
        handleCursorPosition(touchX, touchY);
    }
}


function main() {
    if (has_game_ended())
        return;

    changing_direction = false;
    setTimeout(function onTick() {
        clear_board();
        drawFood();
        move_snake();
        drawSnake();
        document.getElementById("id_score").value = score.toString();
        main();
    }, 100)
}

function clear_board() {
    snakeboard_ctx.fillStyle = board_background;
    snakeboard_ctx.strokestyle = board_border;
    snakeboard_ctx.fillRect(0, 0, snakeboard.width, snakeboard.height);
    snakeboard_ctx.strokeRect(0, 0, snakeboard.width, snakeboard.height);
}

function drawSnake() {
    snake.forEach(drawSnakePart)
}

function drawFood() {
    snakeboard_ctx.fillStyle = 'lightgreen';
    snakeboard_ctx.strokestyle = 'darkgreen';
    snakeboard_ctx.fillRect(food_x, food_y, 10, 10);
    snakeboard_ctx.strokeRect(food_x, food_y, 10, 10);
}

function drawSnakePart(snakePart) {
    snakeboard_ctx.fillStyle = snake_col;
    snakeboard_ctx.strokestyle = snake_border;
    snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function has_game_ended() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > snakeboard.width - 10;
    const hitToptWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > snakeboard.height - 10;
    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
}

function random_food(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function gen_food() {
    food_x = random_food(0, snakeboard.width - 10);
    food_y = random_food(0, snakeboard.height - 10);
    snake.forEach(function has_snake_eaten_food(part) {
        const has_eaten = part.x == food_x && part.y == food_y;
        if (has_eaten) gen_food();
    });
}

function handle_arrows(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    const W_KEY = 87;
    const S_KEY = 83;
    const A_KEY = 65;
    const D_KEY = 68;
    const keyPressed = event.keyCode;
    let direction
    if (keyPressed === LEFT_KEY || keyPressed === A_KEY) {
        direction = 'left'
    } else if (keyPressed === UP_KEY || keyPressed === W_KEY) {
        direction = 'up'
    } else if (keyPressed === RIGHT_KEY || keyPressed === D_KEY) {
        direction = 'right'
    } else if (keyPressed === DOWN_KEY || keyPressed === S_KEY) {
        direction = 'down'
    }
    change_direction(direction)
}

function change_direction(direction) {

    if (changing_direction) return;
    changing_direction = true;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;
    if (direction === 'left' && !goingRight) {
        dx = -10;
        dy = 0;
    }
    if (direction === 'up' && !goingDown) {
        dx = 0;
        dy = -10;
    }
    if (direction === 'right' && !goingLeft) {
        dx = 10;
        dy = 0;
    }
    if (direction === 'down' && !goingUp) {
        dx = 0;
        dy = 10;
    }
}

function move_snake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;
    if (has_eaten_food) {
        score += 10;
        document.getElementById('score').innerHTML = score;
        gen_food();
    } else {
        snake.pop();
    }
}
   