import React from "react";

import { useHistory } from "react-router-dom";
import search_icon from "../assets/search-solid.svg";

import "../styles/SearchEntry.css";

export default function SearchEntry(props) {
    const history = useHistory();

    const onClick = () => {

        // TODO: add router
        if (props.type === 'F') {
            history.push();
        } else {

        }

        console.log("hello")
    }

    return (
        <div>
            <h2>
                Or Search for existing items
            </h2>
            <div onClick={onClick} className="search-block">
                <img src={search_icon} alt=""/>
            </div>
        </div>
    )
}