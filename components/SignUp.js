import React from "react";
import { View } from "react-native";
import { NavigationActions } from 'react-navigation';
import { Container, Content, Card, Button, Form, Item, Input, Label, Text } from "native-base";


export default class SignUp extends React.Component {

    constructor(props) {
        super(props);
        this.state = { password: '', email: '', username: '' };
    }


    render() {

        let { navigation, screenProps: { onSignUp } } = this.props;

        return (
            <Container style={{ paddingVertical: 20, paddingHorizontal: 10 }} >
                <Content>
                    <Form>
                        <Item floatingLabel>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={this.state.email}
                                onChangeText={e => this.setState({ 'email': e })} />
                        </Item>
                        <Item floatingLabel>
                            <Label>Password</Label>
                            <Input secureTextEntry
                                value={this.state.password}
                                onChangeText={e => this.setState({ 'password': e })} />
                        </Item>
                        <Item floatingLabel last>
                            <Label>User Name</Label>
                            <Input type="text"
                                value={this.state.username}
                                onChangeText={e => this.setState({ 'username': e })} />
                        </Item>

                    </Form>
                    <Button block
                        style={{ marginTop: 30 }}
                        onPress={() => {
                            onSignUp(this.state);
                        }}>
                        <Text>SIGN UP</Text>
                    </Button>
                    <Button block danger
                        style={{ marginTop: 20 }}
                        textStyle={{ color: "#bcbec1" }}
                        onPress={() => navigation.dispatch(NavigationActions.back())}>
                        <Text>CANCEL</Text>
                    </Button>
                </Content>
            </Container>
        )
    }
}