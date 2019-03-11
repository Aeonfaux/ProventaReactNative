import React, { Component } from "react";
import { View, ScrollView, Text, Image, TouchableOpacity, Linking, ActivityIndicator, AsyncStorage } from "react-native";
import { Header, TabbedMenu, Card, ListItem } from "../../../../components";
import PageStyle from "./styles";
import { connect } from 'react-redux';
import { DrawerActions } from "react-navigation";
import * as actions from "../../../../actions";

class InformationDetailsPage extends Component {

  async componentWillMount() {
    try {
      const { navigation } = this.props;
      const token = await AsyncStorage.getItem('token');
      if (token !== null) {
        this.props.updateStatus(token).then(() => {
          const { status } = this.props;
          this.props.fetchFacilitators(35, "loggedin", token);
          this.props.fetchParticipants(35, "loggedin", token);
          this.props.fetchSponsors(35, "loggedin", token);
          this.props.fetchFloorPlans(35, "loggedin", token);
        })
      }

    } catch (error) {
      // Error retrieving data
    }
  }

  getIndex(id) {
    const { facilitators } = this.props;
    return facilitators.findIndex(facilitators => facilitators.id === id);
  }

  renderFacilitators() {
    const { navigation, facilitators } = this.props;
    const facilitator = facilitators.map(({ id, first_name, last_name, company, position }) => {
      return (
        <View key={id} style={PageStyle.listContainer}>
          <ListItem
            onPress={() => {
              ("schedl");
              this.setState(
                {
                  selectedIndex: this.getIndex(id)
                },
                () => {
                  navigation.navigate("FacilitatorDetailsPage", {
                    facilitator: facilitators[this.getIndex(id)]
                  });
                });
            }}
          >
            <View style={PageStyle.list}>
              <View style={{ width: "25%" }}>
                <Image
                  style={[PageStyle.listIcon, PageStyle.profileIcon]}
                  source={{ uri: "https://cdn5.vectorstock.com/i/thumb-large/13/04/male-profile-picture-vector-2041304.jpg" }}
                />
              </View>
              <View style={{ width: "50%" }}>
                <Text style={PageStyle.listTitle}>{first_name} {last_name}</Text>
                <Text style={PageStyle.listDescription}> {company} {position} </Text>
              </View>
            </View>
            <View style={PageStyle.listBorder} />
          </ListItem>
        </View>
      );
    });
    return facilitator;
  }

  renderParticipants() {
    const { participants } = this.props;
    // const participants = navigation.getParam("participants");
    const participant = participants.map(({ id, first_name, last_name, position, company, linkedin }) => {
      return (
        <View key={id} style={PageStyle.listContainer}>
          <ListItem onPress={() => ("pressed")}>
            <View style={PageStyle.list}>
              <View style={{ width: "25%" }}>
                <Image
                  style={[PageStyle.listIcon, PageStyle.profileIcon]}
                  source={{ uri: "https://cdn5.vectorstock.com/i/thumb-large/13/04/male-profile-picture-vector-2041304.jpg" }}
                />
              </View>
              <View style={{ width: "50%" }}>
                <Text style={PageStyle.listTitle}>{first_name} {last_name}</Text>
                <Text style={PageStyle.listDescription}>{company} {position}</Text>
              </View>
              <View style={{ width: "25%" }}>
                <TouchableOpacity onPress={() => Linking.openURL(linkedin)}>
                  <Image
                    style={[PageStyle.linkedInButton]}
                    source={require("../../../../assets/linkedin.png")}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={PageStyle.listBorder} />
          </ListItem>
        </View>
      );
    });
    return participant;
  }

  renderSponsors() {
    const { sponsors } = this.props;
    const sponsor = sponsors.map(({ id, title, image, website }) => {
      return (
        <View key={id} style={{ width: "45%", alignItems: "flex-start" }}>
          <TouchableOpacity onPress={() => { Linking.openURL(website) }}>
            <Image style={PageStyle.boxImage} source={{ uri: image.url }} />
            <Text style={PageStyle.title}> {title} </Text>
          </TouchableOpacity>
        </View>
      );
    });

    return sponsor;
  }

  renderPersonalSchedule() {
    return (
      <View style={{ width: "45%", alignItems: "center" }}>
        <Text> Upcoming Feature</Text>
      </View>
    );
  }

  renderContent() {
    const { navigation } = this.props;
    const content = navigation.getParam("content");
    if (content === "FACILITATORS") {
      return <Card>{this.renderFacilitators()}</Card>;
    } else if (content === "PARTICIPANTS") {
      return <Card>{this.renderParticipants()}</Card>;
    } else if (content === "SPONSORS") {
      return (
        <ScrollView>
          <Card>
            <View style={PageStyle.box}>
              {this.renderSponsors()}
            </View>
          </Card>
        </ScrollView>
      );
    } else if (content === "PERSONAL SCHEDULE") {
      return <Card>{this.renderPersonalSchedule()}</Card>;
    }
  }


  render() {
    const { navigation, status } = this.props;
    const content = navigation.getParam("content");
    const route = navigation.getParam("previousRoute");

    return (
      <View style={PageStyle.container}>
        <Header
          label={content}
          status="details"
          onPress={() => {
            if (content === 'PERSONAL SCHEDULE') {
              navigation.dispatch(DrawerActions.openDrawer());
            } else {
              navigation.navigate(route, {
                meetingId: 35,
                status: "loggedin"
              });
            }
          }}
          settings={() => {
            if (content !== "PERSONAL SCHEDULE") {
              navigation.navigate("SettingsPage", {
                content: "settings",
                previousRoute: "MeetingLoginPage"
              });
            }
          }}
        />
        {this.renderContent()}
        <TabbedMenu navigation={navigation} status="loggedin" />
      </View>
    );
  }
}

const mapStatetoProps = ({ meeting, auth }) => {
  const { mainmeeting, venues, expectations, facilitators, participants, sponsors, floorPlans,
    hasLoadedMainMeeting, hasLoadedVenues, hasLoadedExpectations, hasLoadedFacilitators,
    hasLoadedParticipants, hasLoadedSponsors, hasLoadedFloorPlans
  } = meeting;

  const { status, token } = auth;
  return {
    mainmeeting,
    venues,
    expectations,
    facilitators,
    participants,
    sponsors,
    floorPlans,
    hasLoadedMainMeeting, hasLoadedVenues, hasLoadedExpectations, hasLoadedFacilitators,
    hasLoadedParticipants, hasLoadedSponsors, hasLoadedFloorPlans,
    status,
    token
  };
};

export default connect(mapStatetoProps, actions)(InformationDetailsPage);


