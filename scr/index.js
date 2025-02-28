// scr/index.js (React + JSX)

// Забираємо змінні з глобального React (CDN)
const { useState } = React;

function App() {
  const [bitString, setBitString] = useState("1011010");
  
  return (
    <div style={{ padding: "1rem" }}>
      <h1>BitStreamCoder + React (через CDN)!</h1>
      <p>Поточні біти: {bitString}</p>
      <input
        value={bitString}
        onChange={(e) => setBitString(e.target.value)}
      />
      {/* Тут можна додати Canvas, чекбокси тощо */}
    </div>
  );
}

// Рендеримо в #root
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
