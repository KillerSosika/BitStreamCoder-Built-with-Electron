// scrambler.js

/**
 * Скремблер на основі простого ключа (XOR).
 * bits: масив [0,1, ...]
 * key: масив [0,1,1,0] тощо
 */
export function scrambleBits(bits, key = [1,0,1,1]) {
    let scrambled = [];
    let keyIndex = 0;
    for (let i = 0; i < bits.length; i++) {
      // XOR біта з ключовим елементом
      let newBit = bits[i] ^ key[keyIndex];
      scrambled.push(newBit);
  
      keyIndex++;
      if (keyIndex >= key.length) {
        keyIndex = 0; // зациклюємо ключ
      }
    }
    return scrambled;
  }
  