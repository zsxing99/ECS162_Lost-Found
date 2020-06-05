import React from "react";

import { useHistory } from "react-router-dom";
import search_icon from "../assets/images/search-solid.svg";

import "../styles/SearchEntry.css";

export default function SearchEntry(props) {
    const history = useHistory();

    const onClick = () => {
        if (props.type === 'F') {
            history.push("/finder/search");
        } else {
            history.push("/seeker/search");
        }
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