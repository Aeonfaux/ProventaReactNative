import React, { Component } from "react";
import {
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  AsyncStorage,
  ActivityIndicator
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
import { updateAuth, login, fetchProfile, fetchMeetings } from "../../../actions";
import { Google } from 'expo';
// import Expo from 'expo';


class LoginPage extends Component {

  state = {
    isFetching: null,
    authError: '',
    user: null
  }
  async componentDidMount() {

  }

  syncUserWithStateAsync = async () => {
    const user = await Google.signInSilentlyAsync();
    this.setState({ user });
  };

  loginWithGoogle = async () => {

    try {
      const result = await Google.logInAsync({
        iosClientId: "6966997513-s5mroeevftu0i8l0a8rmm35c5cv9v12p.apps.googleusercontent.com",
        // iosStandaloneAppClientId: `6966997513-bhctt6ajg1b5l2gakrgq7527vs0ikvgm.apps.googleusercontent.com`,
        scopes: ['profile', 'email'],
        behavior: 'web'
      });

      console.log(result);
      alert(JSON.stringify(result.user))

      if (result.type === 'success') {
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  }

  cacheAuthAsync(authState) {
    return AsyncStorage.setItem(StorageKey, JSON.stringify(authState));
  }

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
            this.loginWithGoogle();
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
        />
        <StyledInput
          type="password"
          placeholder="Password"
          onChangeText={value => {
            this.props.updateAuth({ prop: "password", value });
          }}
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
    const { emailAddress, password } = this.props;
    const data = {
      email: emailAddress.value,
      password: password.value
    };
    this.setState({ isFetching: true, authError: '' })
    this.props.login(data).then(() => {
      if (this.props.token) {
        this.storeToken(this.props.token);
        this.props.fetchProfile(this.props.token).then(() => {
          this.props.fetchMeetings(this.props.token).then(() => {
            const { status, navigation, user, meetings } = this.props;
            if (status === 'loggedin' && user.hasProfileLoaded && meetings.hasMeetingsLoaded) {
              this.setState({ isFetching: false })
              const meetingId = user.profile.meetingIds.count > 0 ? user.profile.meetingIds[0] : meetings.ids[0];
              navigation.navigate("MeetingLoginPage", { status: "loggedin", meetingId: meetingId });
            }
          })
        })
      } else {
        this.setState({ isFetching: false, authError: 'Invalid Credentials' })
      }
    });
  }


  render() {
    const { navigation, meetings, status, user, token } = this.props;
    return (
      <View style={PageStyle.container}>
        <Header
          label="LOGIN"
          onPress={() => {
            navigation.dispatch(DrawerActions.openDrawer());
          }}
        />
        <ScrollView>
          <View style={ComponentStyle.container}>
            {
              (this.state.isFetching === null || this.state.isFetching === false) &&
              <View style={PageStyle.card}>
                {this.renderLoginForm()}
                <MainButton
                  onPress={() => {
                    this.loginUser();
                  }}
                  label="LOGIN"
                />
                <View style={PageStyle.errorContainer}>
                  <Text style={PageStyle.errorText}> {this.state.authError} </Text>
                </View>

                <View style={PageStyle.sectionLine} />
                {this.renderSocialLinks()}
                <Text style={PageStyle.signUpLabel}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("SignUpPage")}>
                  <Text style={PageStyle.signUpLink}> Sign up now </Text>
                </TouchableOpacity>
              </View>

            }
            {
              this.state.isFetching &&
              <View style={PageStyle.loading}>
                <ActivityIndicator loaded={meetings.hasMeetingsLoaded} size="large" />
              </View>
            }
          </View>
        </ScrollView>
        <TabbedMenu navigation={navigation} />
      </View>
    );
  }
}

const mapStateToProps = ({ auth, userState, meetingsState }) => {
  const { status, message, emailAddress, password, token } = auth;
  const { user } = userState;
  const { meetings } = meetingsState;
  return { status, message, emailAddress, password, token, user, meetings };
};

export default connect(
  mapStateToProps,
  { login, updateAuth, fetchProfile, fetchMeetings }
)(LoginPage);

