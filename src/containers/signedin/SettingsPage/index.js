import React, { Component } from "react";
import { View, Text, Image, AsyncStorage } from "react-native";
import { Header, ListItem, Card, TabbedMenu } from "../../../components";
import PageStyle from "./styles";
import { connect } from "react-redux";
import * as actions from "../../../actions";

class SettingsPage extends Component {
  state = {
    settingsItems: [
      {
        id: 0,
        icon: require("../../../assets/user_icon.png"),
        label: "User",
        name: "USER",
        route: "UserPage"
      },
      {
        id: 1,
        icon: require("../../../assets/schedule_button.png"),
        label: "Calendar",
        name: "CALENDAR",
        route: "CalendarPage"
      },
      {
        id: 2,
        icon: require("../../../assets/bell_icon.png"),
        label: "Notification",
        name: "NOTIFICATION",
        route: "NotificationPage"
      },
      {
        id: 3,
        icon: require("../../../assets/logout_button.png"),
        label: "Log out",
        name: "LOG OUT",
        route: "HomePage"
      }
    ]
  };


  componentDidMount() {
    // GoogleSignin.configure({
    //   iosClientId:
    //     "631979342854-a1s3b73lpv13rla3aq1uh07e6hntr9k3.apps.googleusercontent.com", //only for ios
    //   webClientId:
    //     "631979342854-v68oaojlkgttth4j9bqp103ea1po8egb.apps.googleusercontent.com" //only for android
    // });
  }

  signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
    } catch (error) {
      console.log(error);
    }
  }

  revokeAccess = async () => {
    try {
      await GoogleSignin.revokeAccess();
    } catch (error) {
      console.log(error);
    }
  }

  clearToken = async () => {
    try {
      await AsyncStorage.removeItem('token')
      this.props.logout();
    } catch (err) {
      console.log(`The error is: ${err}`)
    }
  }

  renderSettingsItems(settings) {
    const { navigation } = this.props;
    const settingsItem = settings.map(({ id, icon, label, name, route }) => {
      return (
        <View key={id}>
          <ListItem
            onPress={() => {
              if (name !== "LOG OUT") {
                navigation.navigate(route, { content: name, status: "loggedin" })
              }
              else if (name === "LOG OUT") {
                this.clearToken().then(() => {
                  navigation.navigate(route, { status: "loggedout" })
                });
              }
            }}
          >
            <View style={PageStyle.menuList}>
              <View style={{ width: "25%" }}>
                <Image style={PageStyle.menuIcon} source={icon} />
              </View>
              <View style={{ width: "75%" }}>
                <Text style={PageStyle.menuTitle}>{label}</Text>
              </View>
            </View>
            <View style={PageStyle.menuBorder} />
          </ListItem>
        </View >
      );
    });

    return settingsItem;
  }

  render() {
    const { navigation } = this.props;
    const route = navigation.getParam("previousRoute");
    return (
      <View style={PageStyle.container}>
        <Header
          label="SETTINGS"
          status="details"
          onPress={() => {
            navigation.navigate(route, {
              status: "loggedin"
            });
          }}
        />
        <Text style={PageStyle.header}>GENERAL</Text>
        <Card>{this.renderSettingsItems(this.state.settingsItems)}</Card>
        <TabbedMenu navigation={navigation} status="loggedin" />
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
)(SettingsPage);
