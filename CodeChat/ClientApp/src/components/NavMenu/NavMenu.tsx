import * as React from 'react'
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, Button } from 'reactstrap'

import { Link } from 'react-router-dom';
import './NavMenu.css';
import { NavProps } from './NavMenuContainer';

export default class NavMenu extends React.PureComponent<NavProps> {
    public state = {
        isOpen: false
    };

    public render() {
        return (
            <header>
                <Navbar className="navbar-expand-sm navbar-toggleable-sm border-bottom box-shadow mb-3" light>
                    <Container>
                        <NavbarBrand
                            tag={Link}

                            to="/"><span className="brand">CodeChat</span></NavbarBrand>
                        <NavbarToggler onClick={this.toggle} className="mr-2" />
                        <ul className="navbar-nav flex-grow">
                            {this.renderSignUpLoginOrLogout()}
                        </ul>

                    </Container>
                </Navbar>
            </header>
        );
    }

    private toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    private renderSignUpLoginOrLogout = () => {
        if (this.props.currentUser === null) {
            return (<React.Fragment >
                <NavItem>
                    <NavLink tag={Link} className="nav-menu__nav-link" to="/">Login</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} className="nav-menu__nav-link" to="/signup">Sign Up</NavLink>
                </NavItem>
            </React.Fragment>
            );
        } else {
            return (<React.Fragment >

                <NavItem>
                    <Button
                        color="warning"
                        outline
                        className="nav-menu__button"
                        onClick={this.logout}>Logout</Button>
                </NavItem>
            </React.Fragment>)
        }
    }

    private logout = () => {
        this.props.logout()
    }


}
