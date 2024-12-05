import './style.css'
import Matter from 'matter-js'

var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Mouse = Matter.Mouse,
    Composite = Matter.Composite;

const container = document.querySelector('.container');
const containerWidth = container.clientWidth;
const containerHeight = container.clientHeight;

// создаем движок
var engine = Engine.create();

// создаем рендерер с прозрачным фоном
var render = Render.create({
    element: container,
    engine: engine,
    options: {
        width: containerWidth,
        height: containerHeight,
        background: 'transparent',
        wireframes: false
    }
});

// создаем границы
const walls = [
    Bodies.rectangle(containerWidth/2, -10, containerWidth, 20, { isStatic: true }), // верх
    Bodies.rectangle(containerWidth/2, containerHeight + 10, containerWidth, 20, { isStatic: true }), // низ
    Bodies.rectangle(-10, containerHeight/2, 20, containerHeight, { isStatic: true }), // левая
    Bodies.rectangle(containerWidth + 10, containerHeight/2, 20, containerHeight, { isStatic: true }) // правая
];

// добавляем границы в мир
Composite.add(engine.world, [...walls]);


// обработчик для движения мыши
container.addEventListener('mousemove', (event) => {
    if (event.buttons === 1) { // проверяем, что зажата левая кнопка мыши
      const newCircle = Bodies.circle(event.offsetX, event.offsetY, 10, {
              render: {
                 sprite: {
                   texture: 'flake.svg',
                   xScale: 0.1,
                   yScale: 0.1
                 }
              }
          });
          Composite.add(engine.world, newCircle);
    }
});

// обработчик для тачскрина
container.addEventListener('touchmove', (event) => {
    event.preventDefault();

    const touch = event.touches[0];
    const rect = container.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const newCircle = Bodies.circle(event.offsetX, event.offsetY, 30, {
      render: {
          fillStyle: 'blue'
      }
  });
  Composite.add(engine.world, newCircle);
});

// запускаем рендерер и движок
Render.run(render);
var runner = Runner.create();
Runner.run(runner, engine);


