import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";

const ITEM_TYPES = ["number", "word", "time", "alphanumeric"];
const TOTAL_QUESTIONS = 77;
const TOTAL_TIME = 720; // 12 minutes

const generateNumberItem = () => String(Math.floor(10000 + Math.random() * 90000));
const generateWordItem = () => {
  const words = ["apple", "grape", "table", "chair", "zebra", "plant", "cloud"];
  return words[Math.floor(Math.random() * words.length)];
};
const generateTimeItem = () => {
  const hour = String(Math.floor(Math.random() * 24)).padStart(2, "0");
  const minute = String(Math.floor(Math.random() * 60)).padStart(2, "0");
  return `${hour}:${minute}`;
};
const generateAlphaNumeric = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 5; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

const generateItem = (type: string) => {
  switch (type) {
    case "number":
      return generateNumberItem();
    case "word":
      return generateWordItem();
    case "time":
      return generateTimeItem();
    case "alphanumeric":
      return generateAlphaNumeric();
    default:
      return "";
  }
};

const sortItems = (items: string[], type: string) => {
  switch (type) {
    case "number":
      return [...items].sort((a, b) => Number(a) - Number(b));
    case "word":
    case "alphanumeric":
      return [...items].sort();
    case "time":
      return [...items].sort((a, b) => {
        const [h1, m1] = a.split(":").map(Number);
        const [h2, m2] = b.split(":").map(Number);
        return h1 * 60 + m1 - (h2 * 60 + m2);
      });
    default:
      return items;
  }
};

export default function App() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questionType, setQuestionType] = useState("");
  const [items, setItems] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (questionIndex >= TOTAL_QUESTIONS || timeLeft <= 0) {
      setFinished(true);
      return;
    }
    const type = ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)];
    const generated = Array.from({ length: 5 }, () => generateItem(type));
    setQuestionType(type);
    setItems(generated);
    setSelected([]);
  }, [questionIndex]);

  useEffect(() => {
    if (finished) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setFinished(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [finished]);

  const handleSelect = (item: string) => {
    if (selected.includes(item) || finished) return;
    const newSelected = [...selected, item];
    setSelected(newSelected);
    if (newSelected.length === 5) {
      const correctOrder = sortItems(items, questionType);
      const isCorrect = newSelected.every((val, i) => val === correctOrder[i]);
      if (isCorrect) setScore((s) => s + 1);
      setTimeout(() => setQuestionIndex((q) => q + 1), 500);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">LATIHAN CEPET!</h1>
      {!finished ? (
        <>
          <div className="text-lg mb-2">Soal {questionIndex + 1} / {TOTAL_QUESTIONS}</div>
          <div className="text-sm mb-4">Tipe: {questionType}</div>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {items.map((item, idx) => (
              <Button
                key={idx}
                onClick={() => handleSelect(item)}
                disabled={selected.includes(item)}
                className="text-lg p-4"
              >
                {item}
              </Button>
            ))}
          </div>
          <div className="text-sm">Klik dalam urutan dari yang terkecil ke terbesar</div>
          <div className="mt-4 text-lg">Waktu tersisa: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}</div>
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Selesai!</h2>
          <p className="text-lg">Skor kamu: {score} / {TOTAL_QUESTIONS}</p>
        </div>
      )}
    </div>
  );
}
