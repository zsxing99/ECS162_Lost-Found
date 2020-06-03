import React from "react";

import '../styles/SeekerForum.css';
import RequestForum from "./RequestForum";
import SearchEntry from "./SearchEntry";

export default function SeekerForum() {
    document.body.style.backgroundColor = "#b3c1d1";

    const config = {
        type: "S",
        next_btn: {
            background: "#142a50",
            borderColor: "#142a50"
        },
        submit_btn: {
            background: "#142a50",
            borderColor: "#142a50"
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
            <SearchEntry type={config.type}/>
        </div>
    )
}
