import {
  SETTINGS_UPDATE,
  FETCH_CALENDAR_SETTINGS,
  FETCH_NOTIFICATION_SETTINGS,
  SETTINGS_CONFIG_SUCCESS,
  SETTINGS_CONFIG_FAIL,
  SERVER_ADDRESS
} from "./types";

import axios from "axios";

//Update syncGoogle and syncCalendar field
//Update push, sms, or email
// export const updateSettings = ({ prop, value }) => {
//   return {
//     type: SETTINGS_UPDATE,
//     payload: { prop, value }
//   };
// };

//Retrieve calendar settings
export const fetchCalendarSettings = (token, callback) => async dispatch => {
  try {
    const request = await axios.get(
      `${SERVER_ADDRESS}/settings/`,
      { "headers": { "Content-Type": "application/json", "Authorization": token } }
    );
    dispatch({
      type: FETCH_CALENDAR_SETTINGS,
      payload: request.data.attributes
    });
    callback();
  } catch (error) {
    console.log(error);
  }
};



//Update calendar settings
export const updateCalendarSettings = (data, token, category) => async dispatch => {
  try {
    const request = await axios.patch(
      `${SERVER_ADDRESS}/settings`,
      data,
      { "headers": { "Content-Type": "application/json", "Authorization": token } }
    );
    dispatch({
      type: SETTINGS_CONFIG_SUCCESS,
      payload: {
        category,
        result: request.data.data.attributes
      }
    });

  } catch (error) {
    console.log(error);
  }
};

//Retrieve notification settings
export const fetchNotificationSettings = (token, callback) => async dispatch => {
  try {
    const request = await axios.get(
      `${SERVER_ADDRESS}/settings/`,
      { "headers": { "Content-Type": "application/json", "Authorization": token } }
    );
    dispatch({
      type: FETCH_NOTIFICATION_SETTINGS,
      payload: request.data.data.attributes
    });
    callback()
  } catch (error) {
    console.log(error);
  }
};

//Update NotificationSettings
export const updateNotificationSettings = (data, token, type) => async dispatch => {
  try {
    const request = await axios.patch(
      `${SERVER_ADDRESS}/settings/`,
      data,
      { "headers": { "Content-Type": "application/json", "Authorization": token } }
    );
    dispatch({
      type: SETTINGS_CONFIG_SUCCESS,
      payload: {
        type,
        result: request.data.data.attributes
      }
    })
  } catch (error) {
    console.log(error);
  }
}
