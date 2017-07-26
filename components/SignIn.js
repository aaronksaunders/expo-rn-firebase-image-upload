import React from "react";
import { View, TextInput } from "react-native";
import { Container, Content, Card, Button, Form, Item, Input, Label, Text } from "native-base";


class SignIn extends React.Component {

    constructor(props) {
        super(props);
        this.state = { password: '', email: '' };
    }


    render() {
        let { navigation, onLogin } = this.props;

        return (
            <Container style={{ paddingVertical: 20, paddingHorizontal: 10 }} >
                <Content>
                    <Form>
                        <Item floatingLabel>
                            <Label>Email</Label>
                            <Input
                                type="text"
                                value={this.state.email}
                                auto-correction={false}
                                auto-autoCapitalize={false}
                                onChangeText={e => this.setState({'email':e})} />
                        </Item>
                        <Item floatingLabel>
                            <Label>Password</Label>
                            <Input secureTextEntry
                                type="text"
                                value={this.state.password}
                               onChangeText={e => this.setState({'password':e})} />
                        </Item>
                    </Form>
                    <Button block
                        style={{ marginTop: 30 }}
                        onPress={() => {
                            onLogin({ email: this.state.email, password: this.state.password })
                        }}>
                        <Text>SIGN IN</Text>
                    </Button>
                    <Button block
                        style={{ marginTop: 20 }}
                        onPress={() => navigation.navigate("SignUp")}>
                        <Text>SIGN UP</Text>
                    </Button>
                </Content>
            </Container>
        )
    }
}
export default SignIn