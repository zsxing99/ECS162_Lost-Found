import React, { useState } from "react";
import { useProxy, proxyUrl, prefix, searchService } from "../config";
import "../styles/SearchForum.css";
import search from "../assets/images/search-solid.svg";
import { Redirect } from "react-router-dom";
import { AutoComplete, Button, Form, Input, message, Select } from "antd";
import GoogleMap from "./GoogleMap";

export default function SearchForum(props) {
    let btn_color_config;
    if (props.type === "F") {
        document.body.style.backgroundColor = "#feebb1";
        btn_color_config = {
            background: "#daab27",
            borderColor: "#daab27"
        }
    } else {
        document.body.style.backgroundColor = "#b3c1d1";
        btn_color_config = {
            background: "#142a50",
            borderColor: "#142a50"
        }
    }

    const [ dataSource, setDataSource ] = useState([]);
    const [ selectedPlace, setSelectedPlace ] = useState();
    const [ searchSuccess, setSearchStatus ] = useState(false);
    const [ response, setResponse] = useState({});

    // input text area
    // 1 - search bar; 2 - time start; 3 - time end
    const [ input1, setInput1 ] = useState("");

    const onChange1 = text => {
        setInput1(text.target.value);
    }

    const { Option } = Select;
    const [ form ] = Form.useForm();

    const Option2 = AutoComplete.Option;
    const options = dataSource.map((place) => (
        <Option2 key={place.id} value={place.name} className="autocomplete">
            <span>{place.name}</span>
        </Option2>
    ))

    const onSearch = text => {
        if (!text) {
            setDataSource([])
            return;
        }

        const url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?" +
            "key=AIzaSyADX7Pl6ly45fro2Z5nNhy10YUHqKr1AY8&input=" + encodeURI(text) + "&location=" +
            "38.537,-121.754&radius=10000&strictbounds=true";

        fetch(useProxy ? proxyUrl + url : url)
            .then(res => res.json())
            .then((data) => {
                setDataSource(
                    data.predictions.map(place => ({
                        name: place.description,
                        id: place.place_id,
                    }))
                )
            })
    };

    const onSelect = (data, object) => {
        const url = "https://maps.googleapis.com/maps/api/place/details/json?" +
            "key=AIzaSyCTbLgQzno0rc_eE40MoFuo6FLdiV6MOhA&place_id=" + encodeURI(object.key) + "&fields=geometry";
        fetch(useProxy ? proxyUrl + url : url)
            .then(res => res.json())
            .then((data) => {
                setSelectedPlace(
                    {
                        ...data.result.geometry.location
                    }
                )
            })
    }

    const setPlace = (place) => {
        const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?" +
            "key=AIzaSyADX7Pl6ly45fro2Z5nNhy10YUHqKr1AY8&location=" + place.lat + ',' + place.lng + "&radius=50";

        fetch(useProxy ? proxyUrl + url : url)
            .then(res => res.json())
            .then((data) => {
                if (!data.results || data.results.length === 0 || !data.results[0].name || !data.results[0].geometry) {
                    message.warning("No nearby place matched")
                    return;
                }
                setSelectedPlace(
                    {
                        ...data.results[0].geometry.location
                    }
                )
                form.setFieldsValue({
                    location: data.results[0].name
                })
            })
    }

    const onSubmit = (values) => {
        if (!input1 && (!values.time || (!values.time.t1 && !values.time.t2)) && !values.category && !values.location) {
            message.error("Please enter at least one field (Category-All doesn't count)");
            return;
        }
        const data = {
            type: props.type === "F" ? "S" : "F",
            start_time: values.time && values.time.t1 ? values.time.t1.replace("T", " ") : '',
            end_time: values.time && values.time.t2 ? values.time.t2.replace("T", " ") : '',
            query_text: input1,
            category: values.category ? values.category : '',
            location: values.location ? values.location : '',
            ...selectedPlace
        }

        let serviceUrl = useProxy ? proxyUrl + prefix + searchService : prefix + searchService;

        serviceUrl += '?'
        for (let key in data) {
            if (data[key]) {
                serviceUrl += key + "=" + encodeURI(data[key]) + "&";
            }
        }
        serviceUrl = serviceUrl.substring(0, serviceUrl.length - 1);
        console.log(serviceUrl);

        fetch(serviceUrl,
            {
                method: 'GET',
            })
            .then(
                res => {
                    if (res.status === 200) {
                        message.success("Search sent successfully");
                        return res;
                    } else {
                        message.error("Search sent failed");
                        throw Error(res.statusText);
                    }
                }
            )
            .then(res => res.json())
            .then(res => {
                setResponse(res);
                setSearchStatus(true);
            })
            .catch(
                err => {
                    message.warning("Please try again", err);
                }
            )
    };

    return searchSuccess ? (
        <Redirect
            to={{
                pathname: "/results",
                state: {
                    data: response,
                    type: props.type === "F" ? "S" : "F"
                }
            }}
        />
    ) : (
        <div className="search-form">
            <h2>
                Search for existing requests
            </h2>
            <div className="search-bar">
                <Input suffix={<img src={search} alt=""/>} onChange={onChange1} id="search-input"/>
            </div>
            <Form
                name="search"
                labelAlign="left"
                className="form"
                form={form}
                onFinish={onSubmit}
            >
                <Form.Item
                    label="Date & Time"
                    name="time"
                    rules={[{
                        validator: (_, value) => {
                            if (value && value.t1 && value.t2 && Date.parse(value.t1) > Date.parse(value.t2)) {
                                message.error("End time must not be ahead of start time")
                                return Promise.reject("!")
                            } else {
                                return Promise.resolve();
                            }
                        }
                    }]}
                    style={{
                        color: "#142a50"
                    }}
                >
                    <TimeInterval />
                </Form.Item>

                <Form.Item label="Category" name="category">
                    <Select id="category">
                        <Option value={undefined}>All</Option>
                        <Option value="Electronics">Electronics</Option>
                        <Option value="Collectibles & Art">Collectibles & Art</Option>
                        <Option value="Health & Beauty">Health & Beauty</Option>
                        <Option value="Books, Movies & Music">Books, Movies & Music</Option>
                        <Option value="Business & Industrial">Business & Industrial</Option>
                        <Option value="Sporting Goods">Sporting Goods</Option>
                        <Option value="Others">Others</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Location"
                    name="location"
                    validateTrigger={["onSubmit"]}
                >
                    <AutoComplete
                        dataSource={options}
                        onSearch={onSearch}
                        onSelect={onSelect}
                        style={{
                            fontWeight: "500"
                        }}
                    />
                </Form.Item>

                <Form.Item style={{
                    height: '30vh'
                }}>
                    <GoogleMap style={{
                        width: '100%',
                        height: '25vh'
                    }}
                               place={selectedPlace}
                               setMarker={setPlace}
                    />
                </Form.Item>

                <Form.Item >
                    <Button type="primary" shape="round" htmlType="submit" id="submit-btn" style={btn_color_config}>
                        search
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

const TimeInterval = ({value = {}, onChange}) => {
    const [t1, setTime1] = useState('');
    const [t2, setTime2] = useState('');

    const triggerChange = changedValue => {
        if (onChange) {
            onChange({ t1, t2, ...value, ...changedValue });
        }
    };

    const onT1Change = t => {
        t = t.target.value;
        if (!('t1' in value)) {
            setTime1(t);
        }
        triggerChange({ t1: t});
    }

    const onT2Change = t => {
        t = t.target.value;
        if (!('t2' in value)) {
            setTime2(t);
        }
        triggerChange({ t2: t});
    }

    return (
        <span>
            <Input type="datetime-local" value={value.t1 || t1} style={{width : "45%"}} onChange={onT1Change}/>
            &nbsp;to&nbsp;
            <Input type="datetime-local" value={value.t2 || t2} style={{width : "45%"}} onChange={onT2Change}/>
        </span>
    );
}
