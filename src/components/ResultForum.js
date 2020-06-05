import React from "react";
import { Collapse } from 'antd';

export default function ResultForum(props) {
    document.body.style.backgroundColor = "white";

    const { Panel } = Collapse;
    console.log(props.location.state);

    const displayedList = (
        <Collapse >
        </Collapse>
    )

    return (
        <div>
            <h2>
                Showing results for
            </h2>
        </div>
    )
}