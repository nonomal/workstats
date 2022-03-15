// The reason for using require is that the getTasks method will fail if you use import syntax, and the sample code in the official documentation also uses require.
// import { Client } from "asana";
const asana = require("asana");

const GetAsanaDataFromServer = () => {
  // TODO: Get personalAccessToken and params from users collection in firestore.
  const personalAccessToken = `Bearer ${process.env.ASANA_PERSONAL_ACCESS_TOKEN}`;
  const workspace = "1200781712370361";
  const assignee = "1200781652740141";

  // If you subscribe to a premium plan, you can put in advanced search criteria, but I haven't used it because I'm not sure if the user has to subscribe or if the service only requires one subscription.
  const opt_fields = ["name", "completed", "completed_at"];

  // See the official documentation.
  // Return response.
  const client = asana.Client.create().useAccessToken(personalAccessToken);
  const result = client.tasks
    .getTasks({
      workspace: workspace,
      assignee: assignee,
      opt_fields: opt_fields,
    })
  return result;
};

export default GetAsanaDataFromServer;
