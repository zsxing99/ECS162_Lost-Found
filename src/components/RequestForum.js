import React from "react";
import "../styles/RequestForum.css";

import { Button, Form, Input, Select, Upload, message } from "antd";

class RequestForum extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        title: "",
        category: "",
        Description: "",
        photo: "",
        time: "",
        location: "",

        pageOne: true
    }

    onClickNext = values => {
        console.log(values);
        this.setState({
            ...values,
            pageOne: false
        })
    }

    onClickSubmit = values => {
        console.log(values)
        console.log(this.state);

        // TODO: re-router
    }

    render() {
        const fileUploadMethod = {
            name: 'photo',
            // TODO: link to upload photo
            action: '',
            accept: 'image/*',
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
            multiple: false,
            showUploadList: false
        }

        const {Option} = Select;
        const { TextArea } = Input;

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
                        <Input style={{ width: '60%' }} type="datetime-local" />
                    </Form.Item>

                    <Form.Item
                        label="Location"
                        name="location"
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
                        <Form.Item>
                            <Button type="primary" shape="round" htmlType="submit" id="submit-btn" style={{...this.props.config.submit_btn}}>
                                submit
                            </Button>
                        </Form.Item>
                    </Form.Item>
                </Form>
            )
    }
}

export default RequestForum;