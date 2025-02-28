import React, { useState, useEffect, useRef } from "react";

// =============== 1) Функції кодування та обробки ===============
function encodeNRZ(bits) {
  let result = [];
  let t = 0;
  bits.forEach((bit) => {
    const level = bit === 1 ? 1 : 0;
    result.push({ x: t, y: level });
    result.push({ x: t + 1, y: level });
    t += 1;
  });
  return result;
}

function encodeNRZI(bits, invertOn = "1") {
  let result = [];
  let t = 0;
  let currentLevel = 0; // Початковий рівень
  bits.forEach((bit) => {
    if (
      (invertOn === "1" && bit === 1) ||
      (invertOn === "0" && bit === 0)
    ) {
      currentLevel = currentLevel === 0 ? 1 : 0;
    }
    result.push({ x: t, y: currentLevel });
    result.push({ x: t + 1, y: currentLevel });
    t += 1;
  });
  return result;
}

function encodeAMI(bits) {
  let result = [];
  let t = 0;
  let polarity = 1;
  bits.forEach((bit) => {
    let level;
    if (bit === 1) {
      level = polarity;
      polarity = -polarity;
    } else {
      level = 0;
    }
    result.push({ x: t, y: level });
    result.push({ x: t + 1, y: level });
    t += 1;
  });
  return result;
}

function encodeManchester(bits) {
  let result = [];
  let t = 0;
  bits.forEach((bit) => {
    if (bit === 1) {
      // 1 = перша половина вгорі, друга вниз
      result.push({ x: t, y: 1 });
      result.push({ x: t + 0.5, y: 1 });
      result.push({ x: t + 0.5, y: 0 });
      result.push({ x: t + 1, y: 0 });
    } else {
      // 0 = перша половина внизу, друга вверх
      result.push({ x: t, y: 0 });
      result.push({ x: t + 0.5, y: 0 });
      result.push({ x: t + 0.5, y: 1 });
      result.push({ x: t + 1, y: 1 });
    }
    t += 1;
  });
  return result;
}

// (Додаткові приклади)
function scrambleBits(bits) {
  // Надзвичайно простий «скремблер» (XOR з 1010...)
  const key = [1, 0, 1, 0]; 
  let scrambled = [];
  let k = 0;
  for (let i = 0; i < bits.length; i++) {
    scrambled.push(bits[i] ^ key[k]);
    k = (k + 1) % key.length;
  }
  return scrambled;
}

function addSuperfluousBits(bits, insertBit = 1, afterN = 4) {
  let extended = [];
  for (let i = 0; i < bits.length; i++) {
    extended.push(bits[i]);
    if ((i + 1) % afterN === 0) {
      extended.push(insertBit);
    }
  }
  return extended;
}

// =============== 2) React-компонент ===============
const BitStreamCoder = () => {
  // -- Стан для вхідного рядка бітів:
  const [bitString, setBitString] = useState("1011010");
  // -- Стан для масиву бітів, який будемо відображати (може змінюватись після scramble/superfluous):
  const [bits, setBits] = useState([1, 0, 1, 1, 0, 1, 0]);

  // -- Стан для вибору, які коди показувати:
  const [showNRZ, setShowNRZ] = useState(true);
  const [showNRZI, setShowNRZI] = useState(false);
  const [showAMI, setShowAMI] = useState(true);
  const [showManchester, setShowManchester] = useState(false);

  // Реф на canvas
  const canvasRef = useRef(null);

  // =============== 3) Обробники подій ===============
  // Коли змінюється поле введення
  const handleBitStringChange = (e) => {
    setBitString(e.target.value);
  };

  // Кнопка "Застосувати бітстрінг" (оновлює bits зі звичайного рядка)
  const handleApplyBits = () => {
    // Фільтр, аби не зіпсуватись, якщо введуть "abc"
    const arr = bitString.split("").map((ch) => (ch === "1" ? 1 : 0));
    setBits(arr);
  };

  // Кнопка "Scramble"
  const handleScramble = () => {
    setBits((prev) => scrambleBits(prev));
  };

  // Кнопка "Add superfluous bits"
  const handleAddSuperBits = () => {
    setBits((prev) => addSuperfluousBits(prev, 1, 4));
  };

  // =============== 4) Малювання на Canvas ===============
  // Функція, що відмальовує "step-like" сигнал
  const drawSignal = (ctx, dataPoints, offsetY, color) => {
    ctx.strokeStyle = color;
    ctx.beginPath();
    // Масштаби:
    const scaleX = 20; // 20 px на біт
    const scaleY = 40; // 40 px на "рівень"

    for (let i = 0; i < dataPoints.length; i++) {
      let px = dataPoints[i].x * scaleX;
      let py = dataPoints[i].y * scaleY;

      // (200 - базова лінія, мінус py, щоб 1 ішло вверх)
      if (i === 0) {
        ctx.moveTo(px, offsetY + (200 - py));
      } else {
        ctx.lineTo(px, offsetY + (200 - py));
      }
    }
    ctx.stroke();
  };

  // Малювання сітки (для краси)
  const drawGrid = (ctx) => {
    ctx.strokeStyle = "#ddd";
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
  };

  // =============== 5) useEffect: малюємо, коли змінюються дані чи налаштування ===============
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    // Очищаємо
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Малюємо сітку
    drawGrid(ctx);

    // Далі обчислюємо кожен сигнал і малюємо його, якщо "прапорець" увімкнено
    let offsetStep = 100; // Крок між сигналами по вертикалі
    let currentOffset = 0;

    if (showNRZ) {
      const dataNRZ = encodeNRZ(bits);
      drawSignal(ctx, dataNRZ, currentOffset, "blue");
      currentOffset += offsetStep;
    }

    if (showNRZI) {
      const dataNRZI = encodeNRZI(bits);
      drawSignal(ctx, dataNRZI, currentOffset, "green");
      currentOffset += offsetStep;
    }

    if (showAMI) {
      const dataAMI = encodeAMI(bits);
      drawSignal(ctx, dataAMI, currentOffset, "red");
      currentOffset += offsetStep;
    }

    if (showManchester) {
      const dataMan = encodeManchester(bits);
      drawSignal(ctx, dataMan, currentOffset, "purple");
      currentOffset += offsetStep;
    }
  }, [bits, showNRZ, showNRZI, showAMI, showManchester]);

  // =============== 6) JSX-розмітка ===============
  return (
    <div style={{ margin: "1rem" }}>
      <h1>BitStreamCoder (React Demo)</h1>

      <div style={{ marginBottom: "1rem" }}>
        <label>Біти:</label>
        <input
          type="text"
          value={bitString}
          onChange={handleBitStringChange}
          style={{ width: "150px", marginLeft: "0.5rem" }}
        />
        <button onClick={handleApplyBits} style={{ marginLeft: "0.5rem" }}>
          Застосувати
        </button>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <button onClick={handleScramble}>Scrambler</button>
        <button onClick={handleAddSuperBits} style={{ marginLeft: "0.5rem" }}>
          Add Superfluous Bits
        </button>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <span>Відображати коди:</span>
        <label style={{ marginLeft: "1rem" }}>
          <input
            type="checkbox"
            checked={showNRZ}
            onChange={(e) => setShowNRZ(e.target.checked)}
          />{" "}
          NRZ
        </label>
        <label style={{ marginLeft: "1rem" }}>
          <input
            type="checkbox"
            checked={showNRZI}
            onChange={(e) => setShowNRZI(e.target.checked)}
          />{" "}
          NRZI
        </label>
        <label style={{ marginLeft: "1rem" }}>
          <input
            type="checkbox"
            checked={showAMI}
            onChange={(e) => setShowAMI(e.target.checked)}
          />{" "}
          AMI
        </label>
        <label style={{ marginLeft: "1rem" }}>
          <input
            type="checkbox"
            checked={showManchester}
            onChange={(e) => setShowManchester(e.target.checked)}
          />{" "}
          Manchester
        </label>
      </div>

      <canvas
        ref={canvasRef}
        width={1200}
        height={600}
        style={{ border: "1px solid #000" }}
      ></canvas>
    </div>
  );
};

export default BitStreamCoder;
