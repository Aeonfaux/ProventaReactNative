import React, { Component } from "react";
import { View, Text, ScrollView, AsyncStorage } from "react-native";
import { Header, InputBox, TabbedMenu, Card, MainButton } from "../../../../components";
import PageStyle from "./styles";
import { connect } from "react-redux";
import { fetchProfile, updateStatus } from "../../../../actions";

class UserPage extends Component {

  state = {
    firstName: "",
    lastName: "",
    position: "",
    company: "",
    position: "",
    contactNumber: "",
    linkedin: "",
    email: ""
  };

  async componentWillMount() {
    try {
      const { navigation } = this.props;
      const token = await AsyncStorage.getItem('token');
      if (token !== null) {
        this.props.updateStatus(token).then(() => {
          this.props.fetchProfile(token).then(() => {
            this.loadInitialData();
          })
        })
      }

    } catch (error) {
      // Error retrieving data
    }
  }

  loadInitialData() {
    console.log(this.props.profile);
  }

  render() {
    const { navigation, profile } = this.props;
    console.log("AUTH RIOF", profile);
    return (
      <View style={PageStyle.container}>
        <Header
          label="USER"
          status="details"
          onPress={() => {
            navigation.goBack();
          }}
        />
        <ScrollView>
          <Card>
            <View style={PageStyle.inputContainer}>
              <InputBox
                label="First Name"
                placeholder={profile.firstName}
                value={this.state.firstName}
                onChangeText={(value) => this.setState({ firstName: value })}
              />
              <InputBox
                label="Last Name"
                placeholder={profile.lastName}
                value={this.state.lastName}
                onChangeText={(value) => this.setState({ lastName: value })}
              />
              <InputBox
                label="Email Address"
                placeholder={profile.email}
                value={this.state.email}
                onChangeText={(value) => this.setState({ email: value })}
              />
              <InputBox
                label="Position"
                placeholder={profile.position}
                value={this.state.position}
                onChangeText={(value) => this.setState({ position: value })}
              />
              <InputBox
                label="Company"
                placeholder={profile.company}
                value={this.state.company}
                onChangeText={(value) => this.setState({ company: value })}
              />
              <InputBox
                label="Contact Number"
                placeholder={profile.contactNumber}
                value={this.state.contactNumber}
                onChangeText={(value) => this.setState({ contactNumber: value })}
              />
              <InputBox
                label="Linked In"
                placeholder={profile.linkedin}
                value={this.state.linkedin}
                onChangeText={(value) => this.setState({ linkedin: value })}
              />
              <MainButton label="UPDATE" />
            </View>
          </Card>
        </ScrollView>
        <TabbedMenu navigation={navigation} status="loggedin" />
      </View>
    );
  }
}

const mapStatetoProps = ({ user, auth }) => {
  const { profile } = user;
  const { token } = auth;
  return { token, profile }
}

export default connect(mapStatetoProps, { fetchProfile, updateStatus })(UserPage);
