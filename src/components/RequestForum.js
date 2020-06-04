import React from "react";
import "../styles/RequestForum.css";
import { useProxy, proxyUrl, photoStorageLink } from "../config"
import { Button, Form, Input, Select, Upload, message, AutoComplete } from "antd";
import GoogleMap from "./GoogleMap";

class RequestForum extends React.Component {
    constructor(props) {
        super(props);
    }

    formRef = React.createRef();

    state = {
        title: "",
        category: "",
        description: "",
        photo: "",
        time: "",
        location: "",

        pageOne: true,

        dataSource: [],
        selectedPlace: null,
    }

    onClickNext = values => {
        this.setState({
            ...values,
            pageOne: false
        })
    }

    onClickSubmit = values => {
        values.time = values.time.replace("T", " ");
        console.log(values)
        console.log(this.state);

        const data = {
            type: this.props.config.type,
            title: this.state.title,
            category: this.state.category,
            description: this.state.description,
            photoURL: this.state.photo ? photoStorageLink + this.state.photo : '',
            time: values.time,
            location: this.state.location,
            ...this.state.selectedPlace,
        }

        console.log()

        fetch(useProxy ? proxyUrl + 'https://lost-found-162.glitch.me/post' : 'https://lost-found-162.glitch.me/post',
            {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" }
            })
            .then(
                res => {
                    if (res.status === 200) {
                        message.success("Page posted successfully")
                    } else {
                        message.error("Page posted failed");
                    }
                }
            )

        // TODO: re-router
    }

    render() {
        // use proxy in dev

        const { dataSource } = this.state;
        const Option2 = AutoComplete.Option;
        const options = dataSource.map((place) => (
            <Option2 key={place.id} value={place.name} className="autocomplete">
                <span>{place.name}</span>
            </Option2>
        ))

        const fileUploadMethod = {
            name: 'photo',
            action: useProxy ? proxyUrl + 'https://lost-found-162.glitch.me/upload' : 'https://lost-found-162.glitch.me/upload',
            accept: 'image/*',
            onChange(info) {
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed`);
                }
            },
            multiple: false,
            showUploadList: false,
            customRequest: async ({ action, file, onSuccess, onError }) => {
                const formData = new FormData();
                formData.append('newImage', file, file.name);
                fetch(action, {
                    method: 'POST',
                    body: formData
                }).then(res => {
                    this.setState({
                        photo: file.name
                    })
                    onSuccess(res.data);
                }, onError);
            }
        }

        const { Option } = Select;
        const { TextArea } = Input;

        // Google Map auto Complete

        const onSearch = text => {
            if (!text) {
                this.setState({
                    dataSource: []
                });
                return;
            }

            const url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?" +
                "key=AIzaSyADX7Pl6ly45fro2Z5nNhy10YUHqKr1AY8&input=" + encodeURI(text) + "&location=" +
                "38.537,-121.754&radius=10000&strictbounds=true";

            fetch(useProxy ? proxyUrl + url : url)
                .then(res => res.json())
                .then((data) => {
                    this.setState({
                        dataSource: data.predictions.map(place => ({
                            name: place.description,
                            id: place.place_id,
                        }))
                    })
                })
        };

        const onSelect = (data, object) => {
            const url = "https://maps.googleapis.com/maps/api/place/details/json?" +
                "key=AIzaSyCTbLgQzno0rc_eE40MoFuo6FLdiV6MOhA&place_id=" + encodeURI(object.key) + "&fields=geometry";
            fetch(useProxy ? proxyUrl + url : url)
                .then(res => res.json())
                .then((data) => {
                    this.setState({
                        selectedPlace: {
                            ...data.result.geometry.location
                        }
                    })
                })
        }

        const setPlace = (place) => {
            const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?" +
                "key=AIzaSyADX7Pl6ly45fro2Z5nNhy10YUHqKr1AY8&location=" + place.lat + ',' + place.lng + "&radius=50"

            fetch(useProxy ? proxyUrl + url : url)
                .then(res => res.json())
                .then((data) => {
                    if (!data.results || data.results.length === 0 || !data.results[0].name || !data.results[0].geometry) {
                        message.warning("No nearby place matched")
                        return;
                    }
                    this.setState({
                        selectedPlace: {
                            ...data.results[0].geometry.location
                        }
                    })
                    this.formRef.current.setFieldsValue({
                        location: data.results[0].name
                    })
                })
        }

        return this.state.pageOne ?
            (
                <Form
                    name="pageOne"
                    onFinish={this.onClickNext}
                    className="page-one"
                    labelAlign="left"
                >
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[{
                            required: true,
                            validator: (_, value) => {
                                if (!value) {
                                    message.error("Please enter title");
                                    return Promise.reject("!");
                                }
                                return Promise.resolve();
                            }

                        }]
                        }
                    >
                        <Input />
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

                    <Form.Item label="Description" name="description" rules={[{
                        required: true,
                        validator: (_, value) => {
                            if (!value) {
                                message.error("Please enter description");
                                return Promise.reject("!");
                            }
                            return Promise.resolve();
                        }
                    }]}>
                        <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item label="Attach a photo (optional)">
                        <Upload {...fileUploadMethod}>
                            <Button id="photo-btn">
                                Choose File
                            </Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" shape="round" htmlType="submit" id="next-btn" style={{...this.props.config.next_btn}}>
                            Next
                        </Button>
                    </Form.Item>
                </Form>
            ) : (
                <Form
                    ref={this.formRef}
                    name="pageTwo"
                    onFinish={this.onClickSubmit}
                    className="page-two"
                    labelAlign="left"
                >
                    <Form.Item
                        label="Date & Time"
                        name="time"
                        rules={[{
                            required: true,
                            validator: (_, value) => {
                                if (!value) {
                                    message.error("Please enter date and time");
                                    return Promise.reject("!");
                                }
                                return Promise.resolve();
                            }

                        }]
                        }
                    >
                        <Input type="datetime-local" />
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
                                } else if (!this.state.selectedPlace) {
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
                                   place={this.state.selectedPlace}
                                   setMarker={setPlace}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" shape="round" htmlType="submit" id="submit-btn" style={{...this.props.config.submit_btn}}>
                            submit
                        </Button>
                    </Form.Item>
                </Form>
            )
    }
}

export default RequestForum;