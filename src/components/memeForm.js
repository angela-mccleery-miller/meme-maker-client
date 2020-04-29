import React, {useState, useEffect, useRef} from "react";
import DropzoneComponent from "react-dropzone-component";
import axios from "axios";
import { navigate } from "hookrouter";
import request from "superagent";

import "../../node_modules/react-dropzone-component/styles/filepicker.css";
import "../../node_modules/dropzone/dist/min/dropzone.min.css";

export default function MemeForm(props) {
    const [caption, setCaption] = useState("")
    const [favorite, setFavorite] = useState(false)
    const [image, setImage] = useState("")
    const imageRef = useRef(null)

    const componentConfig = () => {
        return {
            iconFiletypes: [".jpg", ".png"],
            showFiletypeIcon: true,
            postUrl: "https://httpbin.org/post"
        };
    };

    const djsConfig = () => {
        return {
            addRemoveLinks: true,
            maxFiles: 1
        };
    };



    const handleDrop = () => {
        return {
            addedfile: file => {
                let upload = request
                .post("https://api.cloudinary.com/v1_1/angemam/image/upload")
                .field("upload_preset", "meme-images")
                .field("file", file)

            upload.end((err, res) => {
                if (err) {
                    console.log("Cloudinary error: ", err)
                } 
                if (res.body.secure_url !== ""){
                    setImage(res.body.secure_url);
                }
              });
            },
        };
    }

    const handleSubmit = e => {
        e.preventDefault();
        if(props.editMode){
            fetch(`http://localhost:5000/meme/${props.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application-json"
                },
                body: JSON.stringify({
                    text: caption,
                    favorite,
                }),
            })
            .then(() => {
                setCaption("");
                setImage("");
                setFavorite(false);
                imageRef.current.dropzone.removeAllFiles();
            })
            .then(() => navigate("/"))
            .catch((err) => console.log("Form submit error: ", err));
          } else {

            axios
            .post("http://localhost:5000/add-meme", {
                text: caption,
                image,
                favorite
            })
        }}
        
    useEffect(() => {
        if(props.editMode) {
            fetch(`http://localhost:5000/meme/${props.id}`)
            .then(res => res.json())
            .then(data => {
                setCaption(data.text)
                setFavorite(data.favorite)
            })
            .catch(err => console.log("Get One Meme Err: ", err));
        }
    }, []);
    
    return (
        <div>
            <h1>Add / Edit Meme</h1>
            <form onSubmit={handleSubmit}>
                <DropzoneComponent
                ref={imageRef}
                config={componentConfig()}
                djsConfig={djsConfig()}
                eventHandlers={handleDrop()}
                >
                    Drop Yo' Meme Son!
                </DropzoneComponent>

                <input
                  type="text"
                  placeholder="Enter a Caption"
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
               />

              <div>

                <input
                type="checkbox"
                checked={favorite}
                onChange={() => setFavorite(!favorite)}
                />
                <span>Favorite?</span>
              </div>

              <button type="submit">Post / Edit Meme</button>

            </form>
        </div>
    )
}
