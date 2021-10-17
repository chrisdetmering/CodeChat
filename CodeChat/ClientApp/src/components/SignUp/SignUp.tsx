import * as React from 'react'
import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap'
import { SignUpProps } from './SignUpContainer'
import './Form.css'

interface SignUpState {
    [key: string]: string
}

class SignUp extends React.PureComponent<SignUpProps> {

    state: SignUpState = {
        username: '',
        password: ''
    }

    public render() {
        return (
            <Form
                className="form"
                onSubmit={this.handleSubmit}>
                <Row form>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="username">Username</Label>
                            <Input
                                type="text"
                                name="username"
                                id="username"
                                placeholder="username"
                                onChange={this.handleChange}
                                value={this.state.username} />
                        </FormGroup>
                    </Col>
                </Row>
                <Row form>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="password">Password</Label>
                            <Input
                                type="text"
                                name="password"
                                id="password"
                                placeholder="password"
                                onChange={this.handleChange}
                                value={this.state.password} />
                        </FormGroup>
                    </Col>
                </Row>
                <span className="form__span">
                    <Button
                        className="form__button"
                        color="warning"
                        outline>Sign Up!</Button>
                </span>
                <br />
                {this.props.errors && this.props.errors}
            </Form>

        );
    }

    private handleChange = (e: any): void => {
        const { name, value } = e.target
        this.setState({ [name]: value })
    }

    private handleSubmit = (e: any) => {
        e.preventDefault()
        this.props.postUser({
            username: this.state.username,
            password: this.state.password
        })
    }
}


export default SignUp