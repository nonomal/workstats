// Google Calendar API for JavaScript
// The official documentation is here: https://github.com/google/google-api-javascript-client/blob/master/docs/start.md

// Basic parameters
const baseUrl = 'https://www.googleapis.com/calendar/v3/calendars/';
const calendarId = 'primary';
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const scope = 'https://www.googleapis.com/auth/calendar.readonly';

// 2. Initialize the JavaScript client library. If OAuth client ID and scope are provided, this function will load the gapi.auth2 module to perform OAuth.
// The reference is here: https://github.com/google/google-api-javascript-client/blob/master/docs/reference.md#----gapiclientinitargs--
const initClient = async () => {
  const init = await gapi.client.init({
    'apiKey': apiKey, // When using Oauth 2.0, no need to set the API key but, it's a good practice, in case expanding to handle unauthorized requests.
    'clientId': clientId,
    'scope': scope,
  });
  console.log(init);
};

// 3. Initialize and make the API request.
// The reference is here: https://github.com/google/google-api-javascript-client/blob/master/docs/reference.md#----gapiclientrequestargs--
const countNumberOfEvents = async () => {
  const params = {
    maxResults: 250, // Max is 2500
    orderBy: 'startTime', // ascending
    timeMin: (new Date().setMonth(d.getMonth() - 1)).toISOString(), // 1 month ago
    timeMax: (new Date()).toISOString(), // today
  };
  const response = await gapi.client.request({
    'path': `${baseUrl}/calendars/${calendarId}/events`,
    'method': 'GET',
    'params': params,
  });
  if (response.status === 200) {
    console.log(response.result);
    const events = response.result.items;
    const numberOfEvents = events.length;
    return numberOfEvents;
  } else {
    console.log(`Error message: ${response.result.error.message}`);
    return 0;
  };
};

// 1. Load the JavaScript client library arg1='client:auth2' which means client and auth2 libraries then does callback arg2='start'.
// The official documentation is here: https://github.com/google/google-api-javascript-client/blob/master/docs/reference.md#loading-the-client-library
const handleClientLoad = () => {
  gapi.load('client:auth2', {
    callback: initClient(),
    onerror: () => {
      // Handle loading error.
      alert('gapi.client failed to load!');
    },
    timeout: 5000, // 5 seconds.
    ontimeout: () => {
      // Handle timeout.
      alert('gapi.client could not load in a timely manner!');
    },
  });
};

export {
  initClient,
  countNumberOfEvents,
  handleClientLoad
};