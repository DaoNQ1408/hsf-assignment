import "./App.css";
import { Button } from "@heroui/react";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          HSF ASSIGNMENT
        </h1>
        <Button
          color="primary"
          size="lg"
          className="border border-blue-500"
          style={{ padding: "12px 24px", borderRadius: "8px" }}
        >
          Click Me
        </Button>
      </div>
    </div>
  );
}

export default App;
