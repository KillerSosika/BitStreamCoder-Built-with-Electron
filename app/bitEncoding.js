// bitEncoding.js

/**
 * Приймає масив бітів [0,1,1,0,...].
 * Повертає масив точок {x, y} для відмалювання NRZ.
 */
export function encodeNRZ(bits) {
    let result = [];
    let t = 0;
    bits.forEach(bit => {
      let level = (bit === 1) ? 1 : 0;
      result.push({ x: t, y: level });
      result.push({ x: t + 1, y: level });
      t += 1;
    });
    return result;
  }
  
  /**
   * NRZI: коли біт = 1 (за замовчуванням), інвертуємо рівень.
   * Якщо потрібно навпаки (invertOn='0'), тоді інвертуємо на біті 0.
   */
  export function encodeNRZI(bits, invertOn = '1') {
    let result = [];
    let t = 0;
    let currentLevel = 0; // Початковий рівень
    bits.forEach(bit => {
      if ((invertOn === '1' && bit === 1) || (invertOn === '0' && bit === 0)) {
        currentLevel = (currentLevel === 0) ? 1 : 0;
      }
      result.push({ x: t, y: currentLevel });
      result.push({ x: t + 1, y: currentLevel });
      t += 1;
    });
    return result;
  }
  
  /**
   * AMI: чергуємо +1 та -1 для «1», залишаємо 0 для «0».
   */
  export function encodeAMI(bits) {
    let result = [];
    let t = 0;
    let polarity = 1;
    bits.forEach(bit => {
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
  
  /**
   * Манчестер-кодування
   */
  export function encodeManchester(bits) {
    let result = [];
    let t = 0;
    bits.forEach(bit => {
      if (bit === 1) {
        // Перша половина 1, друга 0
        result.push({ x: t, y: 1 });
        result.push({ x: t + 0.5, y: 1 });
        result.push({ x: t + 0.5, y: 0 });
        result.push({ x: t + 1, y: 0 });
      } else {
        // Перша половина 0, друга 1
        result.push({ x: t, y: 0 });
        result.push({ x: t + 0.5, y: 0 });
        result.push({ x: t + 0.5, y: 1 });
        result.push({ x: t + 1, y: 1 });
      }
      t += 1;
    });
    return result;
  }
  
  /**
   * Приклад «вставки надлишкових бітів»: додає кожні N біт 1 "service bit".
   */
  export function addSuperfluousBits(bits, insertBit = 1, afterNbits = 4) {
    let extended = [];
    for (let i = 0; i < bits.length; i++) {
      extended.push(bits[i]);
      // Кожні `afterNbits` додаємо service bit
      if ((i + 1) % afterNbits === 0) {
        extended.push(insertBit);
      }
    }
    return extended;
  }
  