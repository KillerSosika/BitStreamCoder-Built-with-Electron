// renderer.js
import { encodeNRZ, encodeNRZI, encodeAMI, encodeManchester, addSuperfluousBits } from './bitEncoding.js';
import { scrambleBits } from './scrambler.js';

window.addEventListener('DOMContentLoaded', () => {
  const inputField = document.getElementById('bitStringInput');
  const btnEncode = document.getElementById('btnEncode');
  const btnScramble = document.getElementById('btnScramble');
  const btnSuperfluous = document.getElementById('btnSuperfluous');
  const canvas = document.getElementById('mainCanvas');
  const ctx = canvas.getContext('2d');

  let currentBits = [];

  btnEncode.addEventListener('click', () => {
    const bitStr = inputField.value.trim();
    // Перетворимо на [0,1,...]:
    currentBits = bitStr.split('').map(x => parseInt(x, 10) || 0);

    // Приклад: кодування NRZ і відмалювання
    const encodedNRZ = encodeNRZ(currentBits);

    // Очищаємо Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Малюємо сітку чи фон (необов’язково)
    drawGrid(ctx);

    // Малюємо NRZ
    drawSignal(ctx, encodedNRZ, 50, 'blue');
  });

  btnScramble.addEventListener('click', () => {
    // Скремблюємо поточний набір бітів
    currentBits = scrambleBits(currentBits);
    // Оновимо відображення (наприклад, NRZ з уже скрембленими бітами)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx);
    const encodedNRZ = encodeNRZ(currentBits);
    drawSignal(ctx, encodedNRZ, 50, 'purple');
  });

  btnSuperfluous.addEventListener('click', () => {
    // Додаємо надлишковий біт 1 після кожних 4 біт (приклад)
    currentBits = addSuperfluousBits(currentBits, 1, 4);
    // Перемальовуємо
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx);
    const encodedNRZ = encodeNRZ(currentBits);
    drawSignal(ctx, encodedNRZ, 50, 'green');
  });
});

/**
 * Демо-функція малювання сітки
 */
function drawGrid(ctx) {
  ctx.strokeStyle = '#ccc';
  for (let x = 0; x < ctx.canvas.width; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, ctx.canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < ctx.canvas.height; y += 50) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(ctx.canvas.width, y);
    ctx.stroke();
  }
}

/**
 * Найпростіша функція малювання «драбинки»: послідовно з'єднує точки {x,y}
 * offsetY – зсув по вертикалі, color – колір лінії
 */
function drawSignal(ctx, dataPoints, offsetY = 0, color = 'black') {
  ctx.strokeStyle = color;
  ctx.beginPath();
  // Масштабуємо x і y для наочності
  // Напр., x-масштаб = 20 px на 1 бітовий інтервал, y-масштаб = 40 px на 1 рівень
  const scaleX = 20;
  const scaleY = 40;

  for (let i = 0; i < dataPoints.length; i++) {
    let px = dataPoints[i].x * scaleX;
    let py = dataPoints[i].y * scaleY;
    if (i === 0) {
      ctx.moveTo(px, offsetY + -py + 200); 
      // (200 – довільна «середина» для рівнів, щоб 0 був посередині)
    } else {
      ctx.lineTo(px, offsetY + -py + 200);
    }
  }
  ctx.stroke();
}
