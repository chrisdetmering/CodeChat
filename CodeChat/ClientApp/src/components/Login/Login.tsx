import * as React from 'react';
import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { LoginProps } from './LoginContainer';

interface LoginState {
    [key: string]: string;
}

class Login extends React.PureComponent<LoginProps> {

    state: LoginState = {
        username: '',
        password: ''
    }

    public componentDidUpdate() {
        if (this.props.errors !== undefined) {
            console.log(this.props.errors);
        }
    }

    public render() {
        return (
            <Form onSubmit={this.handleSubmit}>
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
                <Row>
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
                <Button color="info">Login!</Button>
            </Form>

        );
    }

    private handleChange = (e: any): void => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    private handleSubmit = (e: any) => {
        e.preventDefault();
        this.props.postSession({
            username: this.state.username,
            password: this.state.password
        })
    }
}







export default Login;