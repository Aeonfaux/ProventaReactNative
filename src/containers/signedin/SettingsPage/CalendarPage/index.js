import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, Switch, AsyncStorage } from "react-native";
// import RNCalendarEvents from "react-native-calendar-events";
import { Header, Card, ListItem, TabbedMenu } from "../../../../components";
import PageStyle from "./styles";
import { fetchCalendarSettings, updateCalendarSettings } from "../../../../actions";
import { Permissions, Calendar } from "expo";

class CalendarPage extends Component {
  state = {
    calendarItems: [
      {
        id: 0,
        label: "Sync to Google Calendar",
        toggleStatus: null
      },
      {
        id: 1,
        label: "Sync to Phone Calendar",
        toggleStatus: null
      }
    ],
    syncPhone: "",
    hasCalendarPermission: null,
    token: ""
  };


  async componentWillMount() {
    try {
      const { navigation } = this.props;
      const token = await AsyncStorage.getItem('token');
      if (token !== null) {
        console.log('dshdjshjds', token)
        this.props.fetchCalendarSettings(token).then(() => {
          this.loadInitialData();
        });
      }
    } catch (error) {
      // Error retrieving data
    }
  }

  // componentDidMount() {
  //   const { token } = this.props;
  //   this.props.fetchCalendarSettings(token).then(() => {
  //     this.loadInitialData();
  //   });
  // }


  loadInitialData() {
    const { calendar } = this.props;

    const options = [...this.state.calendarItems];
    options[0].toggleStatus = calendar.calendarGoogle;
    options[1].toggleStatus = calendar.calendarIcalendar;
    this.setState({
      options
    });
  }

  toggle(i) {
    const { calendar, token } = this.props;
    const options = [...this.state.calendarItems];

    if (i === 0) {
      options[i].toggleStatus = !options[i].toggleStatus;
      this.setState({
        options
      }, () => {
        const data = {
          "calendarGoogle": this.state.calendarItems[0].toggleStatus,
        };
        this.props.updateCalendarSettings(data, this.state.token, "google")
      });
    } else if (i === 1) {
      options[i].toggleStatus = !options[i].toggleStatus;
      this.setState({
        options
      }, () => {
        const data = {
          "calendarIcalendar": this.state.calendarItems[1].toggleStatus
        };
        this.props.updateCalendarSettings(data, this.state.token, "calendar")
      });
    }

    if (
      options[i].label === "Sync to Google Calendar" &&
      options[i].toggleStatus === true
    ) {
      alert("Synced to Google Calendar");
    } else if (
      options[i].label === "Sync to Phone Calendar" &&
      options[i].toggleStatus === true
    ) {
      alert("Synced to Phone Calendar")
    }
  }

  renderCalendarItems(items) {
    const { calendar } = this.props;

    const calendarItem = items.map(({ id, label }) => {
      return (
        <View key={id}>
          <ListItem>
            <View style={PageStyle.menuList}>
              <View style={{ width: "82%" }}>
                <Text style={PageStyle.menuTitle}>{label}</Text>
              </View>
              <View style={{ width: "18%" }}>
                <Switch
                  value={
                    id === 0
                      ? this.state.calendarItems[0].toggleStatus
                      : this.state.calendarItems[1].toggleStatus
                  }
                  onValueChange={() => {
                    this.toggle(id);
                  }}
                />
              </View>
            </View>
            <View style={PageStyle.menuBorder} />
          </ListItem>
        </View>
      );
    });
    return calendarItem;
  }

  render() {
    const { navigation } = this.props;


    return (
      <View style={PageStyle.container}>
        <Header
          label="CALENDAR"
          status="details"
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Card>{this.renderCalendarItems(this.state.calendarItems)}</Card>
        <View style={PageStyle.menuBorder} />
        <TabbedMenu navigation={navigation} status="loggedin" />
      </View>
    );
  }
}

const mapStatetoProps = ({ settings, auth }) => {
  const { calendar } = settings;
  const { token } = auth;
  return { calendar, token };
};

export default connect(
  mapStatetoProps,
  { fetchCalendarSettings, updateCalendarSettings }
)(CalendarPage);
