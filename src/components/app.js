import React, {useEffect, useState } from "react";

import Meme from "./meme";
import Axios from "axios";
import {navigate } from "hookrouter";

import "../style/main.scss";

export default function App() {
    const [memes, setMemes] = useState([]);

    const deleteMeme = id => {
        axios
        .delete(`http://localhost:5000/meme/${id}`)
        .then(setMemes(memes.filter(meme => meme.id !== id)))
        .catch(err => console.log("Delete Meme err: ", err))
    }

    const editMeme = id => {
        navigate(`/form/${id}`)

    }

    const renderMemes = () => {
        return memes.map((meme) => {
            return (
            <Meme 
            key={meme.id}
            meme={meme} 
            editMeme={editMeme} 
            deleteMeme={deleteMeme} />
            );
        })
    }

    const getMemes =() => {
        fetch("http://localhost:5000/memes")
        .then((res) => res.json())
        .then((data) => setMemes(data))
        .catch((err) => console.log(err));
    };

    useEffect(() =>{
        getMemes();
    }, [])

    return (
        <div className="app">
        {renderMemes()}
        </div>
    );
}

