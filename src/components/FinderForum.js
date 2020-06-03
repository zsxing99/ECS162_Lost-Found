import React from "react";

import '../styles/FinderForum.css';
import RequestForum from "./RequestForum";
import SearchEntry from "./SearchEntry";
import { useHistory } from "react-router-dom"

export default function FinderForum() {
    document.body.style.backgroundColor = "#feebb1"

    const history = useHistory();
    const config = {
        type: "F",
        next_btn: {
            background: "#daab27",
            borderColor: "#daab27"
        },
        submit_btn: {
            background: "#daab27",
            borderColor: "#daab27"
        },
        history: history
    }


    return (
        <div className="finder-form">
            <h2>
                Input the found item
            </h2>
            <div className="form">
                <RequestForum config={config}/>
            </div>
            <SearchEntry type={config.type}/>
        </div>
    )
}

