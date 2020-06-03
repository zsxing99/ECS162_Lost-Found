import React, { useState } from "react";

import search from "../assets/search-solid.svg"

import { AutoComplete, Button, Form, Input, message, Select } from "antd";
import GoogleMap from "./GoogleMap";

export default function SearchForum(props) {
    if (props.type === "F") {
        document.body.style.backgroundColor = "#feebb1";
    } else {
        document.body.style.backgroundColor = "#b3c1d1";
    }

    const [ dataSource, setDataSource ] = useState([]);
    const [ selectedPlace, setSelectedPlace ] = useState();
    const { Option } = Select;
    const { form } = Form;

    // use proxy in dev
    const useProxy = true;

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

        const proxyUrl = "https://cors-anywhere.herokuapp.com/";
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
        const proxyUrl = "https://cors-anywhere.herokuapp.com/";
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
    }       )
    }

    const setPlace = (place) => {
        const proxyUrl = "https://cors-anywhere.herokuapp.com/";
        const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?" +
            "key=AIzaSyADX7Pl6ly45fro2Z5nNhy10YUHqKr1AY8&location=" + place.lat + ',' + place.lng + "&radius=50"

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

                })
            })
    }

    return (
        <div className="search-form">
            <h2>
                Search for existing requests
            </h2>
            <div>
                <Input suffix={<img src={search} alt=""/>}/>
            </div>
            <Form
                name="search"
                labelAlign="left"
                className="search"
                ref={form}
            >
                <Form.Item
                >

                </Form.Item>

                <Form.Item label="Category" name="category" rules={[{
                    required: true,
                    validator: (_, value) => {
                        if (!value) {
                            message.error("Please select category");
                            return Promise.reject("!");
                        }
                        return Promise.resolve();
                    }
                }]}>
                    <Select id="category">
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
                    rules={[{
                        required: true,
                        validator: (_, value) => {
                            if (!value) {
                                message.error("Please enter location");
                                return Promise.reject("!");
                            } else if (!selectedPlace) {
                                message.error("Please select a location");
                                return Promise.reject("!");
                            }
                            return Promise.resolve();
                        },
                    }]
                    }
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
            </Form>
        </div>
    )
}
