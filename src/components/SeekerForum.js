import React from "react";

import '../styles/SeekerForum.css';
import RequestForum from "./RequestForum";
import SearchEntry from "./SearchEntry";
import { useHistory } from "react-router-dom";

export default function SeekerForum() {
    document.body.style.backgroundColor = "#b3c1d1";
    const history = useHistory();

    const config = {
        type: "S",
        next_btn: {
            background: "#142a50",
            borderColor: "#142a50"
        },
        submit_btn: {
            background: "#142a50",
            borderColor: "#142a50"
        },
        history: history
    }

    return (
        <div className="finder-form">
            <h2>
                Input the lost item
            </h2>
            <div className="form">
                <RequestForum config={config}/>
            </div>
            <SearchEntry type={config.type}/>
        </div>
    )
}
