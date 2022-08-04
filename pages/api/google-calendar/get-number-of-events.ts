import type { NextApiRequest, NextApiResponse } from 'next';

// The official document is here: https://developers.google.com/calendar/api/v3/reference/events/list
// Rate limit is unspecified
const GetGoogleCalendarNumberOfEvents = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  interface ParamsTypes {
    maxResults: number; // Optional, default is 250 and max is 2500
    // orderBy: 'startTime' | 'updated'; // Optional, ascending basis, default is unspecified
    // pageToken?: string; // Optional, page number
    // q?: string; // Optional, search query
    // showDeleted?: boolean; // Optional, default is false. Whether to include deleted or cancelled events.
    // showHiddenInvitations?: boolean; // Optional, default is false
    // singleEvents?: boolean; // Optional, default is false. Whether to expand recurring events into instances.
    // syncToken: string; // Optional
    timeMax: string; // Optional, default is current time. Upper bound for an event's start time. RFC3339 timestamp with mandatory time zone offset
    timeMin: string; // Optional, lower bound (exclusive) for an event's end time
    // timeZone?: string; // Optional, default is the time zone of the calendar.
    [key: string]: string | number | boolean; // To avoid type error ts(7053) in params[key]
  }
  const baseUrl = 'https://www.googleapis.com/calendar/v3/calendars';
  const calendarId = 'primary';
  const params: ParamsTypes = {
    maxResults: 2500,
    timeMin: req.body.timeMin,
    timeMax: req.body.timeMax
  };
  const queryString = Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
  const url = `${baseUrl}/${calendarId}/events?${queryString}`;
  interface ResponseType {
    kind: string;
    etag: string; // ETag
    summary: string;
    description: string;
    updated: string;
    timeZone: string;
    accessRole: 'owner' | 'writer' | 'reader' | 'freeBusyReader' | 'none';
    defaultReminders: [
      {
        method: string;
        minutes: number;
      }
    ];
    nextPageToken: string;
    nextSyncToken: string;
    items: Array<{
      kind: string;
      etag: string; // ETag
      id: string;
      status: string;
      htmlLink: string;
      created: string;
      updated: string;
      summary: string;
      description: string;
      location: string;
      creator: {
        id: string;
        email: string;
        displayName: string;
        self: boolean;
      };
      organizer: {
        id: string;
        email: string;
        displayName: string;
        self: boolean;
      };
      start: {
        date: string;
        dateTime: string;
        timeZone: string;
      };
      end: {
        date: string;
        dateTime: string;
        timeZone: string;
      };
      endTimeUnspecified: boolean;
      recurrence: Array<string>;
      recurringEventId: string;
      originalStartTime: {
        date: string;
        dateTime: string;
        timeZone: string;
      };
      transparency: 'opaque' | 'transparent';
      visibility: 'public' | 'private' | 'confidential';
      sequence: number;
      attendees: Array<{
        id: string;
        email: string;
        displayName: string;
        organizer: boolean;
        self: boolean;
        resource: boolean;
        optional: boolean;
        responseStatus: 'accepted' | 'declined' | 'tentative' | 'needsAction';
        comment: string;
        additionalGuests: number;
      }>;
      attendeesOmitted: boolean;
      eventType: 'single' | 'busy' | 'free' | 'unknown';
    }>;
  }
  const response: ResponseType = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${req.body.googleAccessToken}`,
      Accept: 'application/json'
    }
  })
    .then((res) => res.json())
    .catch((err) => {
      console.error({ err });
    });
  // @ts-ignore
  if (response?.error?.code === 401) {
    console.log('response.error.code === 401');
    return res.status(401);
  }
  console.log('response', response);
  // Count the number of events
  const events = response.items;
  // const eventsHasMoreThan2Attendees = events.filter(
  //   (event) => event.attendees.length > 2
  // );
  // const numberOfEvents = eventsHasMoreThan2Attendees.length;
  const numberOfEvents = events?.length ?? 0;
  return res.status(200).json(numberOfEvents);
};

export default GetGoogleCalendarNumberOfEvents;
