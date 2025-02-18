# BitStreamCoder-Built-with-Electron

# 📡 Project: Encoding and Scrambling in Digital Networks

## 🔍 Project Description
This project implements **bitstream encoding** using **physical** and **logical codes**, as well as **scrambling**. It allows visualizing data encoding and experimenting with different signal transformation methods.

📌 **Key Features:**
- Support for various encoding methods (physical, logical)
- Scrambling with configurable `n` and `m`
- Visualization of the output signal
- `.exe` generation for Windows

---

## ⚡ Supported Codes

### **Physical Codes:**
✅ Manchester
✅ Bipolar
✅ 2B1Q
✅ NRZI (1), NRZI (0)
✅ AMI (1), AMI (0)

### **Logical Codes:**
✅ 3b/4b
✅ 4b/5b
✅ 2b/3b

### **Scrambling:**
✅ (n=2, m=5)
✅ (n=3, m=7)
✅ (n=4, m=6)
✅ (n=3, m=9)
✅ (n=4, m=7)

---

## 🔧 How to Run the Project

1. Install [Node.js](https://nodejs.org/) (if not installed)
2. Clone this repository
3. Install dependencies:
   ```sh
   npm install
   ```
4. Run the application in development mode:
   ```sh
   npm start
   ```

---

## 🛠 How to Build `.exe`
1. Install `electron-builder`:
   ```sh
   npm install -g electron-builder
   ```
2. Run the command to generate `.exe`:
   ```sh
   npx electron-builder --win portable
   ```
3. The final `.exe` will be available in the `dist/` folder

---

## 🎨 Development Roadmap
- ✅ Add support for all codes from the manual
- ✅ Add signal visualization
- 🔄 Implement result saving in `.csv`
- 🔄 Develop a Docker container for cross-platform execution (optional)

🚀 **Join the development!**

