import React from "react";

import { Button, Form, Input, Select, Option, Upload } from "antd";

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

    onClickSubmit = () => {

    }

    render() {
        return this.state.pageOne ?
            (
                <Form
                    name="pageOne"
                    onFinish={this.onClickNext}
                >
                    <Form.Item label="Title" name="title">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Category" name="category">
                        <Select>
                            <Option value="Electronics">Electronics</Option>
                            <Option value="Collectibles & Art">Collectibles & Art</Option>
                            <Option value="Health & Beauty">Health & Beauty</Option>
                            <Option value="Books, Movies & Music">Books, Movies & Music</Option>
                            <Option value="Business & Industrial">Business & Industrial</Option>
                            <Option value="Sporting Goods">Sporting Goods</Option>
                            <Option value="Others">Others</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Description" name="description">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Attach a photo (optional)">
                        <Upload>

                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" shape="round" htmlType="submit">
                            Next
                        </Button>
                    </Form.Item>
                </Form>
            ) : (
                <Form></Form>
            )
    }
}