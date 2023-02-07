import ReactDOM from "react-dom/client";
import { React } from "react";
import Main from "./Main";
import "./index.css";

export default function App() {
	return <Main />;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
