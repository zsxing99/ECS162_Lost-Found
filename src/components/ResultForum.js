import React, {useState} from "react";
import {Collapse, Button, message} from 'antd';
import "../styles/ResultForum.css";
import { useHistory } from "react-router-dom";
import dateParser from "../utils/Parser";

export default function ResultForum(props) {
    document.body.style.backgroundColor = "white";

    const { Panel } = Collapse;
    const [ activeList, setActiveList ] = useState([]);
    const history = useHistory();

    const onShrink = (key) => {
        key = key.toString();
        for (let i = 0; i < activeList.length; i++) {
            if (activeList[i] === key) {
                setActiveList([...activeList.slice(0, i), ...activeList.slice(i + 1, activeList.length)]);
                return;
            }
        }
    }

    const onExpand = (key) => {
        setActiveList(key);
    }

    const displayedList = props.location.state.data.length === 0 ?
        (
            <div>No results</div>
        ) :
        (
            <Collapse
                activeKey={activeList}
                onChange={onExpand}
                bordered={false}
                className={"site-collapse-custom-collapse-" + props.location.state.type}
            >
                {props.location.state.data.map((row) => {
                    return (
                        <Panel
                            showArrow={false}
                            key={row.rowIdNum}
                            header={row.title} extra={
                                <span className="expand-btn">More</span>
                            }
                            className={"site-collapse-custom-panel-" + props.location.state.type}
                        >
                            <Details {...row} click={onShrink}/>
                        </Panel>
                    )
                })}
            </Collapse>
        )

    return (
        <div className="results-form">
            <h2>
                Showing results for
            </h2>
            <div className="header">
                <span id="search-query">
                    {props.location.state.query}
                </span>
                <Button shape="round" style={{
                    backgroundColor: "#142a50",
                    borderColor: "#142a50",
                    color: "white",
                }} onClick={() => {history.push(props.location.state.type === "F" ? "/seeker/search" : "finder/search")}}
                    id="edit-search-btn"
                >
                    Edit Search
                </Button>
            </div>
            <div>
                {displayedList}
            </div>
        </div>
    )
}

const Details = (props) => {

    return (
        <div className="details-panel">
            <div className="details">
                {
                    props.photoURL ? <img src={props.photoURL} alt=""/> : null
                }
                <div>
                    <div className="meta">
                        <div className="meta-label">
                            <p>Category</p>
                            <p>Location</p>
                            <p>Date</p>
                        </div>
                        <div className="meta-info">
                            <p>{props.category}</p>
                            <p>{props.location}</p>
                            <p>{dateParser(props.time)}</p>
                        </div>
                    </div>
                    <div>
                        {props.description}
                    </div>
                </div>
            </div>
            <div>
                <span
                    className="shrink-btn"
                    onClick={() => {
                        props.click(props.rowIdNum);
                    }}
                >
                    Less
                </span>
            </div>
        </div>
    )
}