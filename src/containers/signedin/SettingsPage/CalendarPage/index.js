import React, { Component } from "react";
import { connect } from 'react-redux';
import { View, Text, Switch } from "react-native";
import RNCalendarEvents from "react-native-calendar-events";
import { Header, Card, ListItem, TabbedMenu } from "../../../../components";
import PageStyle from "./styles";
import { fetchCalendarSettings } from '../../../../actions';


class CalendarPage extends Component {
  state = {
    calendarItems: [{
      id: 0,
      label: "Sync to Google Calendar",
      toggleStatus: null
    },
    {
      id: 1,
      label: "Sync to Phone Calendar",
      toggleStatus: null
    }],
    meetings: [
      {
        id: 0,
        time: {
          startingHour: "7",
          startingMinute: "00",
          meridian: "am",
          endingHour: "8",
          endingMinute: "00"
        },
        startDate: new Date("02/16/2019 08:30:00"),
        endDate: new Date("02/16/2019 12:30:00"),
        title: "Pearl Pay Discussion",
        floorplan: {
          location: "Grand Ballroom"
          // image: require("../../../assets/floor_map.png")
        },
        events: []
      },
      {
        id: 1,
        time: {
          startingHour: "7",
          startingMinute: "00",
          meridian: "am",
          endingHour: "8",
          endingMinute: "00"
        },
        startDate: new Date("02/17/2019 10:30:00"),
        endDate: new Date("02/17/2019 14:00:00"),
        title: "Skylabs Introduction",
        floorplan: {
          location: "Concert Hall"
          // image: require("../../../assets/floor_map.png")
        },
        events: []
      },
      {
        id: 2,
        time: {
          startingHour: "7",
          startingMinute: "00",
          meridian: "am",
          endingHour: "8",
          endingMinute: "00"
        },
        startDate: new Date("02/14/2019 8:30:00"),
        endDate: new Date("02/14/2019 11:00:00"),
        title: "Skylabs Introduction",
        floorplan: {
          location: "Concert Hall"
          // image: require("../../../assets/floor_map.png")
        },
        events: []
      }
    ],
    syncPhone: ""
  };

  resolvePromises(promise, meetingItems, i) {
    return promise
      .then(function () {
        return new Promise(function (r) {
          return setTimeout(r, 300);
        });
      })
      .then(function () {
        RNCalendarEvents.saveEvent(meetingItems[i].title, {
          location: meetingItems[i].floorplan.location,
          startDate: meetingItems[i].startDate.toISOString(),
          endDate: meetingItems[i].endDate.toISOString()
        });
      });
  }

  componentDidMount() {
    this.props.fetchCalendarSettings(1);
  }

  syncEvents(meetingItems) {
    var promise = Promise.resolve();
    for (let i = 0; i < meetingItems.length; i++) {
      promise = this.resolvePromises(promise, meetingItems, i);
    }
    promise
      .then(function () {
        alert("You have successfully synced all events to your local phone.");
      })
      .catch(function (e) {
        console.log(e.message);
      });
  }

  toggle(i) {
    const { calendar } = this.props;
    const options = [...this.state.calendarItems];
    if (i === 0) {
      options[i].toggleStatus = calendar.calendarGoogle;
    } else {
      options[i].toggleStatus = calendar.calendarIcalendar;
    }

    options[i].toggleStatus = !options[i].toggleStatus;

    this.setState({ options });

    if (
      options[i].label === "Sync to Google Calendar" &&
      options[i].toggleStatus === true
    ) {
      alert("Synced to Google Calendar");
    } else if (
      options[i].label === "Sync to Phone Calendar" &&
      options[i].toggleStatus === true
    ) {
      RNCalendarEvents.authorizationStatus().then(status => {
        this.setState({ syncPhone: status });
        if (status === "authorized") {
          this.syncEvents(this.state.meetings);
        } else if (status === "undetermined") {
          RNCalendarEvents.authorizeEventStore().then(out => {
            console.log("out", out);
            if (out == "authorized") {
              this.setState({ cal_auth: out });
            }
          });
        }
      });
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
                  value={id === 0 ? calendar.calendarGoogle : calendar.calendarIcalendar}
                  onValueChange={this.toggle.bind(this, id)}
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
    const { navigation, calendar } = this.props;
    console.log(calendar.calendarGoogle);

    return (
      <View style={PageStyle.container} >
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

const mapStatetoProps = ({ settings }) => {
  const { calendar } = settings;

  return { calendar };
}

export default connect(mapStatetoProps, { fetchCalendarSettings })(CalendarPage);
