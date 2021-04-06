import {Button} from "antd";

import {getAllStudents} from "./client";

import './App.css';

function App() {

    getAllStudents()
        .then(res => res.json())
        .then(console.log);
    return <>
        "Hello world"
    </>;
}

export default App;
