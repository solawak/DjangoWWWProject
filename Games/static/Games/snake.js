
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
    // True if changing direction
    let changing_direction = false;
    // Horizontal velocity
    let food_x;
    let food_y;
    let dx = 10;
    // Vertical velocity
    let dy = 0;
    
    
    // Get the canvas element
    const snakeboard = document.getElementById("snakeboard");
    // Return a two dimensional drawing context
    const snakeboard_ctx = snakeboard.getContext("2d");
    // Start game
    main();

    gen_food();

    if (window.DeviceOrientationEvent) {
        document.getElementById("alpha").innerText = "alpha1";
        console.log("support")
        window.addEventListener('deviceorientation', function(e){
            document.getElementById("alpha").innerText = e.alpha.toString();
            document.getElementById("beta").innerText = e.beta.toString();
            document.getElementById("gamma").innerText = e.gamma.toString();
            console.log(e.alpha)
            console.log(e.beta)
            console.log(e.gamma)
        }, false);

    }


    document.addEventListener("keydown", function(event){
        handle_arrows(event);
        event.preventDefault();
    });

    document.addEventListener("touchstart", function(e) {
        touchHandler(e);
    });

//     document.addEventListener("touchmove", function(e) {
//     touchHandler(e);
// });

//     snakeboard.addEventListener('mousedown', function(e) {
//     getCursorPosition(snakeboard, e);
// })

    function gyroscopeHandler(event){
        let pos = '';
        // if (){
        //     pos = 'right'
        // } else if (){
        //     pos = 'up'
        // } else if (){
        //     pos = 'left'
        // } else if (){
        //     pos = 'down'
        // }
        if (pos !== ''){
            change_direction(pos);
        }
    }

    function getCursorPosition(canvas, event){
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width/2;
        const y = (event.clientY - rect.top - rect.height/2)*(-1);
        handleCursorPosition(x,y);
    }

    function handleCursorPosition(x,y) {
        let pos = '';
        if (x>Math.abs(y)){
            pos = 'right';
        } else if (y>Math.abs(x)){
            pos = 'up';
        } else if (-x>Math.abs(y)){
            pos = 'left';
        } else if (-y>Math.abs(x)){
            pos = 'down';
        }
        let txt;
        if (pos !== '') {
            txt = document.getElementById("touched").innerText;
            document.getElementById("touched").innerText = txt + " touched: " + pos + "|";
            change_direction(pos);
        }
    }

    function touchHandler(e) {
        const ratio = window.devicePixelRatio || 1;
        const w = screen.width * ratio;
        const h = screen.height * ratio;
        const screen_width = document.documentElement.clientWidth;
        const screen_height = document.documentElement.clientHeight;
        let touchX;
        let touchY;
        let txt;
        document.getElementById("alpha").innerText = screen_width.toString() +" "+ screen_height.toString() ;
        txt = document.getElementById("touched").innerText;
        txt = txt + " W:" + w + " H:" + h + " Ratio:" + ratio;
        if (e.touches) {
            document.getElementById("touched").innerText = txt + " [X:" + e.touches[0].clientX+"][Y:" + e.touches[0].clientY + "]";
            touchX = e.touches[0].clientX - screen_width / 2;
            touchY = e.touches[0].clientY - screen_height / 2;
            handleCursorPosition(touchX, touchY);
        }
}

    
    // main function called repeatedly to keep the game running
    function main() {

        if (has_game_ended()) 
			return;

        changing_direction = false;
        setTimeout(function onTick() {
			clear_board();
			drawFood();
			move_snake();
			drawSnake();
			// Repeat
			main();
			}, 100)
    }

    // draw a border around the canvas
    function clear_board() {
      //  Select the colour to fill the drawing
      snakeboard_ctx.fillStyle = board_background;
      //  Select the colour for the border of the canvas
      snakeboard_ctx.strokestyle = board_border;
      // Draw a "filled" rectangle to cover the entire canvas
      snakeboard_ctx.fillRect(0, 0, snakeboard.width, snakeboard.height);
      // Draw a "border" around the entire canvas
      snakeboard_ctx.strokeRect(0, 0, snakeboard.width, snakeboard.height);
    }
    
    // Draw the snake on the canvas
    function drawSnake() {
      // Draw each part
      snake.forEach(drawSnakePart)
    }

    function drawFood() {
      snakeboard_ctx.fillStyle = 'lightgreen';
      snakeboard_ctx.strokestyle = 'darkgreen';
      snakeboard_ctx.fillRect(food_x, food_y, 10, 10);
      snakeboard_ctx.strokeRect(food_x, food_y, 10, 10);
    }
    
    // Draw one snake part
    function drawSnakePart(snakePart) {

      // Set the colour of the snake part
      snakeboard_ctx.fillStyle = snake_col;
      // Set the border colour of the snake part
      snakeboard_ctx.strokestyle = snake_border;
      // Draw a "filled" rectangle to represent the snake part at the coordinates
      // the part is located
      snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
      // Draw a border around the snake part
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
      return Math.round((Math.random() * (max-min) + min) / 10) * 10;
    }

    function gen_food() {
      // Generate a random number the food x-coordinate
      food_x = random_food(0, snakeboard.width - 10);
      // Generate a random number for the food y-coordinate
      food_y = random_food(0, snakeboard.height - 10);
      // if the new food location is where the snake currently is, generate a new food location
      snake.forEach(function has_snake_eaten_food(part) {
        const has_eaten = part.x == food_x && part.y == food_y;
        if (has_eaten) gen_food();
      });
    }

    function handle_arrows(event){
        const LEFT_KEY = 37;
        const RIGHT_KEY = 39;
        const UP_KEY = 38;
        const DOWN_KEY = 40;
        const keyPressed = event.keyCode;
        let direction
        if (keyPressed === LEFT_KEY){
              direction = 'left'
        }
        else if (keyPressed === UP_KEY) {
                direction = 'up'
        }
        else if (keyPressed === RIGHT_KEY) {
                direction = 'right'
        }
        else if (keyPressed === DOWN_KEY) {
                direction = 'down'
        }
        change_direction(direction)
    }

    function change_direction(direction) {

    // Prevent the snake from reversing
    
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
      // Create the new Snake's head
      const head = {x: snake[0].x + dx, y: snake[0].y + dy};
      // Add the new head to the beginning of snake body
      snake.unshift(head);
      const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;
      if (has_eaten_food) {
        // Increase score
        score += 10;
        // Display score on screen
        document.getElementById('score').innerHTML = score;
		document.getElementById("id_score").value = score.toString();
        // Generate new food location
        gen_food();
      } else {
        // Remove the last part of snake body
        snake.pop();
      }
    }
   