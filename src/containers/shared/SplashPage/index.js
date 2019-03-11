import React, { Component } from "react";
import { Image, View, AsyncStorage } from "react-native";
import PageStyle from "./styles";
import { connect } from "react-redux";
import * as actions from "../../../actions";

class SplashPage extends Component {

  async componentDidMount() {
    try {
      const { navigation } = this.props;
      const token = await AsyncStorage.getItem('token');
      if (token !== null) {
        setTimeout(() => {
          this.props.updateStatus(token).then(() => {
            const { status } = this.props;
            navigation.navigate("MeetingPage", { meetingId: 35, status });
          });
        }, 2000);
      }
      setTimeout(() => {
        this.props.navigation.navigate("HomePage", { meetingId: 35, status: "loggedout" });
      }, 2000);

    } catch (error) {
      // Error retrieving data
    }
  }

  render() {
    return (
      <View style={PageStyle.container} >
        <Image
          style={PageStyle.splashScreen}
          source={require("../../../assets/splash_image.png")}
        />
      </View>
    );
  }
}


const mapStatetoProps = ({ auth }) => {
  const { status, token } = auth;
  return {
    status,
    token
  };
};

export default connect(
  mapStatetoProps,
  actions
)(SplashPage);
