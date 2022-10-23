let xPos = 0;
let yPos = 0;

mainLoop();

function mainLoop() {
  app;

  //scenario
  moving("up");
  moving("up");
  moving("up");
  moving("right");
  moving("right");
  moving("right");
  console.log("xPos: " + xPos + " yPos: " + yPos);
}

function moving(moveDirection) {
  //update the position here
  switch (moveDirection) {
    case "up":
      callUp();
      break;
    case "down":
      callDown();
      break;
    case "right":
      callRight();
      break;
    case "Left":
      callLeft();
      break;
    default:
      break;
  }
}

function callUp() {
  yPos += 1;
}

function callDown() {
  yPos -= 1;
}

function callLeft() {
  xPos -= 1;
}

function callRight() {
  xPos += 1;
}
