import React, { Component } from "react";
import {
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import {
  Header,
  TabbedMenu,
  Card,
  StyledInput,
  MainButton,
  SocialButton
} from "../../../components";
import PageStyle from "./styles";
import { DrawerActions } from "react-navigation";
import { connect } from "react-redux";
import { login, updateAuth } from "../../../actions";
// import { GoogleSignin, statusCodes } from "react-native-google-signin";

class LoginPage extends Component {


  renderSocialLinks() {
    return (
      <View style={PageStyle.socialContainer}>
        <SocialButton
          type="linkedin"
          label="Log in with LinkedIn"
          icon={require("../../../assets/linkedin_button.png")}
          // onPress={this.signIn.bind(this)}
          onPress={() => {
            console.log("hello");
          }}
        />
        <SocialButton
          type="google"
          label="Log in with Google"
          icon={require("../../../assets/google.png")}
          // onPress={this.signIn.bind(this)}
          onPress={() => {
            console.log("hello");
          }}
        />
      </View>
    );
  }
  renderLoginForm() {
    return (
      <View>
        <StyledInput
          type="email"
          placeholder="Email Address"
          onChangeText={value => {
            this.props.updateAuth({ prop: "emailAddress", value });
          }}
          icon={require("../../../assets/login_user.png")}
        />
        <StyledInput
          type="password"
          placeholder="Password"
          onChangeText={value => {
            this.props.updateAuth({ prop: "password", value });
          }}
          icon={require("../../../assets/login_password.png")}
          visibilityIcon={require("../../../assets/login_eye.png")}
        />
      </View>
    );
  }

  storeToken = async (token) => {
    try {
      await AsyncStorage.setItem('token', token);
    } catch (error) {
    }
  }

  loginUser() {
    const { emailAddress, password, status, navigation, token } = this.props;
    const data = {
      email: this.props.emailAddress.value,
      password: this.props.password.value
    };
    this.props.login(data);
    if (status === 'loggedin') {
      this.storeToken(token);
      navigation.navigate("MeetingPage", { meetingId: 35, status });
    }
  }

  render() {
    const { navigation, status, message, emailAddress, password } = this.props;
    return (
      <View style={PageStyle.container}>
        <Header
          label="LOGIN"
          onPress={() => {
            navigation.dispatch(DrawerActions.openDrawer());
          }}
        />
        <ScrollView>
          <View style={PageStyle.card}>
            {this.renderLoginForm()}
            <MainButton
              onPress={() => {
                this.loginUser();
              }}
              label="LOGIN"
            />
            <View style={PageStyle.sectionLine} />
            {this.renderSocialLinks()}
            <Text style={PageStyle.signUpLabel}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUpPage")}>
              <Text style={PageStyle.signUpLink}> Sign up now </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <TabbedMenu navigation={navigation} />
      </View>
    );
  }
}

const mapStatetoProps = ({ auth }) => {
  const { status, message, emailAddress, password, token } = auth;

  return { status, message, emailAddress, password, token };
};

export default connect(
  mapStatetoProps,
  { login, updateAuth }
)(LoginPage);
