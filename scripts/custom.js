layers.push(new Layer());


function drawText(text, transform, layer) {
  layers[layer].context.fillStyle = "blue";
  layers[layer].context.font = "bold 60px sans-serif";
  layers[layer].context.fillText(text, transform.position.x, transform.position.y);
}
function drawRect(transform, layer) {
  layers[layer].context.fillStyle = "green";
  layers[layer].context.fillRect(
    transform.position.x - transform.size.x / 2,
    transform.position.y - transform.size.y / 2,
    transform.size.x,
    transform.size.y);
}


class Task extends GameObject {
  constructor() {
    super(500, 500, 700, 100);
    this.currentAnswer = "";
    this.rightAnswer = 0;

    layers[0].context.fillStyle = "black";
    layers[0].context.fillRect(
      1920 - 840,
      0,
      840,
      1080);

    this.updateTask();
  }

  updateTask() {
    const num_1 = float2int(random() * 20);
    const num_2 = float2int(random() * 20);
    this.rightAnswer = num_1 + num_2;

    clearTransform(this.transform, 0);
    drawText(num_1 + " + " + num_2 + " =", this.transform, 0);
  }

  updateAnswer(char) {
    this.currentAnswer += char; this.checkAnswer();
    if(this.currentAnswer.length > 2) this.currentAnswer = "";

    clearTransform(new Transform(800, 500, 150, 100), 0);
    drawText(this.currentAnswer, new Transform(800, 500, 0, 0), 0);
  }

  checkAnswer() {
    if(this.currentAnswer != this.rightAnswer) return;
    moneyText.updateText(1); this.currentAnswer = "";
    this.updateTask();
  }
}
class NumberButton extends Button {
  constructor(x, y, char) { super(x, y, 100, 100); this.char = char; drawRect(this.transform, 0); drawText(this.char, this.transform, 0); }

  animate(value) {
    clearTransform(this.transform, 0);
    this.transform.size.x += value;
    this.transform.size.y += value;
    drawRect(this.transform, 0); drawText(this.char, this.transform, 0);
  }

  onPress() { this.animate(-20); }
  onInterrupt() { this.animate(20); }
  onRelease() { this.animate(20); task.updateAnswer(this.char); }
}

class DraggableObject extends Button {
  constructor(x, y, width, height) { super(x, y, width, height); this.drag = false; this.clickPosition = new Vector2(0, 0); }

  update() {
    clearTransform(this.transform, 1);
    super.update();
    if(this.drag) {
      this.transform.position.x = mouse.transform.position.x + this.clickPosition.x;
      this.transform.position.y = mouse.transform.position.y + this.clickPosition.y;
    }
    drawRect(this.transform, 1);
  }

  onPress() {
    this.clickPosition.x = this.transform.position.x - mouse.transform.position.x;
    this.clickPosition.y = this.transform.position.y - mouse.transform.position.y;
    this.drag = true;
  }

  onRelease() { this.drag = false; }
}
class MoneyText extends GameObject {
  constructor() { super(100, 100, 100, 100); drawText(money, this.transform, 0); }
  updateText(value) { money += value; clearTransform(this.transform, 0); drawText(money, this.transform, 0); }
}
class BuyButton extends Button {
  constructor(x, y, cost, object) {
    super(x, y, 100, 100);
    this.cost = cost; this.object = object;
    drawRect(this.transform, 0);
    drawText(this.cost, this.transform, 0);
  }

  animate(value) {
    clearTransform(this.transform, 0);
    this.transform.size.x += value;
    this.transform.size.y += value;
    drawRect(this.transform, 0); drawText(this.cost, this.transform, 0);
  }

  onPress() { this.animate(-20); }
  onInterrupt() { this.animate(20); }
  onRelease() {
    this.animate(20);
    if(money >= this.cost) {
      objects.push(Object.assign(Object.create(Object.getPrototypeOf(this.object)), JSON.parse(JSON.stringify(this.object))));
      moneyText.updateText(-this.cost);
    }
  }
}


let money = 0;
const moneyText = new MoneyText(); objects.push(moneyText);
const task = new Task(); objects.push(task);
for (let x = 0; x < 3; x++) {
  for (let y = 0; y < 3; y++)
    objects.push(new NumberButton(1200 + 110 * x, 300 + 110 * y, y * 3 + x + 1));
}
objects.push(new NumberButton(50, 630, "-"));
objects.push(new NumberButton(160, 630, 0));
objects.push(new NumberButton(270, 630, "<  "));
objects.push(new BuyButton(300, 100, 3, new DraggableObject(100, 100, 100, 100)));
