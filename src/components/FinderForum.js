import React from "react";

import '../styles/FinderForum.css';
import RequestForum from "./RequestForum";
import SearchEntry from "./SearchEntry";

export default function FinderForum() {
    document.body.style.backgroundColor = "#feebb1"

    const config = {
        type: "F",
        next_btn: {
            background: "#daab27",
            borderColor: "#daab27"
        },
        submit_btn: {
            background: "#daab27",
            borderColor: "#daab27"
        }
    }


    return (
        <div className="finder-form">
            <h2>
                Input the found item
            </h2>
            <div className="form">
                <RequestForum config={config}/>
            </div>
            <SearchEntry type="F"/>
        </div>
    )
}

