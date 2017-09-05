import React from 'react';
import { Text, View, StyleSheet, TextInput, Button, Alert, ScrollView } from 'react-native';

// MOBX
import { observer, inject, Observer, action } from 'mobx-react'
import { enableLogging } from 'mobx-logger';

import SquadList from '../components/SquadList'

class SquadScreen extends React.Component {
    static navigationOptions = {
        title: 'Manage Squad',
    };
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            memberName: '',
            memberEmail: '',
            role: ''
        }
    }

    _handleSaveSquad = () => {
        Alert.alert(
            'Button pressed!',
            'You did it!',
        );

        this.props.squadStore.addUserToSquad(this.state)

        this.setState({
            name: '',
            memberName: '',
            memberEmail: '',
            role: ''
        })

    };

    render() {
        return (
            <ScrollView>
                <View>
                    <TextInput
                        placeholder="Squad Name"
                        value={this.state.name}
                        onChangeText={(v) => this.setState({ name: v })}
                        style={{ width: 200, height: 44, padding: 8 }}
                    />


                    <TextInput
                        placeholder="Member Name"
                        value={this.state.memberName}
                        onChangeText={(v) => this.setState({ memberName: v })}
                        style={{ width: 200, height: 44, padding: 8 }}
                    />


                    <TextInput
                        placeholder="Member Email"
                        value={this.state.memberEmail}
                        onChangeText={(v) => this.setState({ memberEmail: v })}
                        style={{ width: 200, height: 44, padding: 8 }}
                    />


                    <TextInput
                        placeholder="Member Role"
                        value={this.state.role}
                        onChangeText={(v) => this.setState({ role: v })}
                        style={{ width: 200, height: 44, padding: 8 }}
                    />

                    <Button
                        title="Save New Squad Member"
                        onPress={this._handleSaveSquad}
                        style={{ paddingTop: 20 }}
                    />
                </View>

                <SquadList squads={this.props.squadStore.SQUADS.toJS()} />

            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default inject('squadStore')(observer(SquadScreen))