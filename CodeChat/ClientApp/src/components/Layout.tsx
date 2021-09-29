import * as React from 'react';
import { Container } from 'reactstrap';
import NavMenuContainer from './NavMenu/NavMenuContainer';

export default class Layout extends React.PureComponent<{}, { children?: React.ReactNode }> {
    public render() {
        return (
            <React.Fragment>
                <NavMenuContainer />
                <Container>
                    {this.props.children}
                </Container>
            </React.Fragment>
        );
    }
}