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
export const fetchCalendarSettings = (userId) => async dispatch => {
  try {
    const request = await axios.get(
      `${SERVER_ADDRESS}/settings/${userId}`
    );

    console.log(request);
    dispatch({
      type: FETCH_CALENDAR_SETTINGS,
      payload: request.data.data.attributes
    });
  } catch (error) {
    console.log(error);
  }
};

// //Retrieve notification settings
// export const fetchNotificationSettings = userId => {
//   try {
//     const request = await axios.GET(
//       `${SERVER_ADDRESS}/user/${userId}/settings/notification`
//     );

//     if (request.status === "SUCCESS") {
//       dispatch({
//         type: FETCH_NOTIFICATION_SETTINGS,
//         payload: request.data
//       });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

// //Update Settings
// export const updateCalendarSettings = (form, callback) => {
//   try {
//     const request = await axios.PATCH(
//       `${SERVER_ADDRESS}/${form.userId}/settings/calendar`,
//       {
//         syncGoogle: form.syncGoogle,
//         syncCalendar: form.syncCalendar
//       }
//     );

//     if (request.status === "SUCCESS") {
//       dispatch({
//         type: SETTINGS_CONFIG_SUCCESS,
//         payload: "Settings Update Successful"
//       });
//     } else {
//       dispatch({
//         type: SETTINGS_CONFIG_FAIL,
//         payload: "Settings Update Failed"
//       });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

// //Update NotificationSettings
// export const updateNotificationSettings = (form, callback) => {
//   try {
//     const request = await axios.PATCH(
//       `${SERVER_ADDRESS}/${form.userId}/settings/notification`,
//       {
//         push: form.syncGoogle,
//         sms: form.syncCalendar,
//         email: form.email
//       }
//     );

//     if (request.status === "SUCCESS") {
//       dispatch({
//         type: SETTINGS_CONFIG_SUCCESS,
//         payload: "Settings Update Successful"
//       });
//     } else {
//       dispatch({
//         type: SETTINGS_CONFIG_FAIL,
//         payload: "Settings Update Failed"
//       });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };
