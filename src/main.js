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


var engine = Engine.create();


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


const walls = [
    Bodies.rectangle(containerWidth/2, -10, containerWidth, 20, { isStatic: true }), // верх
    Bodies.rectangle(containerWidth/2, containerHeight + 10, containerWidth, 20, { isStatic: true }), // низ
    Bodies.rectangle(-10, containerHeight/2, 20, containerHeight, { isStatic: true }), // левая
    Bodies.rectangle(containerWidth + 10, containerHeight/2, 20, containerHeight, { isStatic: true }) // правая
];


function getSnowmanSizes() {
    if (containerWidth <= 576) {
        return {
            bottom: 0.26,    
            middle: 0.22,   
            head: 0.19   
        };
    } else if (containerWidth <= 768) {
        return {
            bottom: 0.25,    
            middle: 0.17,   
            head: 0.12   
        };
    } else if (containerWidth <= 900) {
        return {
            bottom: 0.2,   
            middle: 0.16,  
            head: 0.12       
        };
    } 
    else if (containerWidth <= 1200) {
        return {
            bottom: 0.15,   
            middle: 0.12,  
            head: 0.08       
        };
    } 
    else if (containerWidth <= 1900) {
        return {
            bottom: 0.10,   
            middle: 0.07,  
            head: 0.05       
        };
    }
    else {
        return {
            bottom: 0.08,   
            middle: 0.06,   
            head: 0.04      
        };
    }
}

const sizes = getSnowmanSizes();

const bottomBall = Bodies.circle(
    containerWidth/2, 
    containerHeight - containerWidth * sizes.bottom, 
    containerWidth * sizes.bottom, 
    {
        render: { fillStyle: '#F8F8F8' }, 
        isStatic: true
    }
);

const middleBall = Bodies.circle(
    containerWidth/2, 
    containerHeight - containerWidth * (sizes.bottom * 1.7 + sizes.middle), 
    containerWidth * sizes.middle, 
    {
        render: { fillStyle: '#F8F8F8' }, 
        isStatic: true
    }
);

const face = Bodies.circle(
    containerWidth/2, 
    containerHeight - containerWidth * (sizes.bottom * 1.7 + sizes.middle * 1.7 + sizes.head), 
    containerWidth * sizes.head, 
    {
        render: { 
            fillStyle: '#FFFFFF4D',                  
            sprite: {
                texture: 'face.svg',
                xScale: 0.5,
                yScale: 0.5,
            } 
        }, 
        isStatic: true
    }
);

const head = Bodies.circle(
    containerWidth/2, 
    containerHeight - containerWidth * (sizes.bottom * 1.7 + sizes.middle * 1.7 + sizes.head), 
    containerWidth * sizes.head, 
    {
        render: { fillStyle: '#F8F8F8' }, 
        isStatic: true
    }
);


const armLength = containerWidth * (sizes.bottom * 0.8); // увеличили с 0.5 до 0.8
const leftArm = Bodies.rectangle(
    containerWidth/2 - armLength,
    containerHeight - containerWidth * (sizes.bottom * 1.8 + sizes.middle),
    armLength, 
    10, 
    {
        render: { fillStyle: '#9A6AFF4D' },
        angle: Math.PI / 6,  
        isStatic: true
    }
);

const rightArm = Bodies.rectangle(
    containerWidth/2 + armLength * 1.2,
    containerHeight - containerWidth * (sizes.bottom * 1.8 + sizes.middle),
    armLength, 
    10, 
    {
        render: { fillStyle: '#9A6AFF4D' },
        angle: -Math.PI/ 30,  
        isStatic: true
    }
);


Composite.add(engine.world, [...walls, leftArm, rightArm, bottomBall, middleBall, head, face]);



container.addEventListener('mousemove', (event) => {
    if (event.buttons === 1) { // проверяем, что зажата левая кнопка мыши
      const newCircle = Bodies.circle(event.offsetX, event.offsetY, 10, {
              render: {
                 sprite: {
                   texture: 'flake.svg',
                   xScale: 0.15,
                   yScale: 0.15 
                 }
              }
          });
          Composite.add(engine.world, newCircle);
    }
});


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


Render.run(render);
var runner = Runner.create();
Runner.run(runner, engine);


function declensionNum(num, words) {
    return words[(num % 100 > 4 && num % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(num % 10 < 5) ? num % 10 : 5]];
}

function updateCountdown() {
    const holidayDate = new Date('2024-12-28T18:00:00+03:00');
    const now = new Date();
    const diff = holidayDate - now;

    if (diff <= 0) {
        document.querySelector('.countdown').innerHTML = '<div class="countdown-item"><span>Каникулы начались!</span></div>';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

    // Обновляем склонения
    document.querySelector('.countdown-item:nth-child(1) .label').textContent = 
        declensionNum(days, ['день', 'дня', 'дней']);
    document.querySelector('.countdown-item:nth-child(2) .label').textContent = 
        declensionNum(hours, ['час', 'часа', 'часов']);
    document.querySelector('.countdown-item:nth-child(3) .label').textContent = 
        declensionNum(minutes, ['минута', 'минуты', 'минут']);
    document.querySelector('.countdown-item:nth-child(4) .label').textContent = 
        declensionNum(seconds, ['секунда', 'секунды', 'секунд']);
}


setInterval(updateCountdown, 1000);
updateCountdown(); 


