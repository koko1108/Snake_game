// 初始化畫布
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// 定義遊戲單位大小和行列數量
const unit = 20;
const row = canvas.height / unit;
const column = canvas.width / unit;

// 創建貪吃蛇的初始狀態
let snake = [];
function createSnake() {
  //創建初始的貪吃蛇身體部分
  snake[0] = {
    x: 80,
    y: 0,
  };
  snake[1] = {
    x: 60,
    y: 0,
  };
  snake[2] = {
    x: 40,
    y: 0,
  };
  snake[3] = {
    x: 20,
    y: 0,
  };
}

// 定義水果的類別
class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }

  // 繪製水果
  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  // 選擇水果的位置
  pickALocation() {
    let overlapping = false;
    let new_x;
    let new_y;

    function checkOverlap(new_x, new_y) {
      for (let i = 0; i < snake.length; i++) {
        if (new_x == snake[i].x && new_y == snake[i].y) {
          overlapping = true;
          return;
        } else {
          overlapping = false;
        }
      }
    }

    do {
      new_x = Math.floor(Math.random() * column) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      checkOverlap(new_x, new_y);
    } while (overlapping);

    this.x = new_x;
    this.y = new_y;
  }
}

// 初始設定
createSnake(); // 創建初始的貪吃蛇
let myFruit = new Fruit(); // 創建水果

// 處理按鍵事件
window.addEventListener("keydown", changeDirection);
let d = "Right";
function changeDirection(e) {
  if (e.key == "ArrowRight" && d != "Left") {
    d = "Right";
  } else if (e.key == "ArrowDown" && d != "Up") {
    d = "Down";
  } else if (e.key == "ArrowLeft" && d != "Right") {
    d = "Left";
  } else if (e.key == "ArrowUp" && d != "Down") {
    d = "Up";
  }

  // 在按下一的指令之前，不接受任何keydown事件
  window.removeEventListener("keydown", changeDirection);

}

// 顯示分數和最高分數
let highestScore;
loadHighestScore();
let score = 0;
document.getElementById("myScore").innerHTML = "遊戲分數:" + score;
document.getElementById("myScore2").innerHTML = "最高分數:" + highestScore;

// 繪製遊戲場景
function draw() {
  // 每次畫圖之前確認蛇有沒有咬到自己
  for (let i=1;i<snake.length;i++){
    // 檢查蛇身是否有部分的位置和蛇頭的位置相同
    if(snake[i].x ==snake[0].x && snake[i].y == snake[0].y){
      clearInterval(myGame);
      alert("遊戲結束");
      return;
    }
  }

  // 清空畫布並繪製背景
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 繪製水果
  myFruit.drawFruit();

  // 繪製貪吃蛇
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "lightgreen";
    } else {
      ctx.fillStyle = "lightblue";
    }
    ctx.strokeStyle = "white";

    // 處理蛇穿牆的情況，讓蛇重新出現在畫布的另一邊
    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    }
    if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    }

    if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    }
    if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }

    // 繪製蛇的部分
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }

  // 更新蛇的位置
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;
  if (d == "Left") {
    snakeX -= unit;
  } else if (d == "Up") {
    snakeY -= unit;
  } else if (d == "Right") {
    snakeX += unit;
  } else if (d == "Down") {
    snakeY += unit;
  }
  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  // 確認蛇是否有吃到果實
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    myFruit.pickALocation();
    // 更新分數
    score++;
    setHighestScore(score);
    document.getElementById("myScore").innerHTML = "遊戲分數:" + score;
    document.getElementById("myScore2").innerHTML = "最高分數:" + highestScore;
  } else {
    snake.pop(); // 如果沒吃到水果，則移除蛇尾，使蛇移動
  }

  // unshift 它用於在陣列的開頭插入一個新元素。
  // snake.unshift(newHead) 把 newHead 插入到 snake 陣列的第一個位置，即作為新的蛇頭，以模擬蛇的移動
  snake.unshift(newHead);
  // 重新設定方向控制的事件監聽器
  window.addEventListener("keydown",changeDirection);
}

// 定時呼叫 draw 函數
let myGame = setInterval(draw, 100);


// 最高分數的儲存和載入
function loadHighestScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}
function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}