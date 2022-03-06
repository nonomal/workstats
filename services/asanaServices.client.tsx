import useSWR from "swr";

const useAsanaData = () => {
  // TODO: Get params from users collection in firestore.
  const opt_fields = "completed,completed_at";
  interface item {
    completed: boolean;
    completed_at: string;
  }
  const params = {
    workspace: "1200781712370361",
    assignee: "1200781652740141",
    opt_fields: opt_fields,
  };
  const query = new URLSearchParams(params);
  // The official document is here: https://developers.asana.com/docs/get-multiple-tasks
  const asanaUrl: string = `https://app.asana.com/api/1.0/tasks?${query}`;

  // The official document is here: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#headers
  // TODO: Get personalAccessToken from users collection in firestore.
  const token = process.env.NEXT_PUBLIC_ASANA_PERSONAL_ACCESS_TOKEN;
  const myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Authorization", "Bearer " + token);

  // UseSWR, which is the main part, from the following.
  // The official document is here: https://swr.vercel.app/docs/data-fetching
  const fetcher = async (url: string) => {
    const response = await fetch(url, {
      headers: myHeaders,
    }).then((res) => res.json());

    // console.log(response["data"]);
    // It's narrowed down to only the tasks completed here, so it's less generic.
    const filteredResponse = response["data"].filter((item: item) => {
      return item["completed"] === true;
    });

    // console.log(filteredResponse.length);
    // TODO: At first, I only want the number of completed tasks, so I'll use the following once, but later I want to make it versatile
    return filteredResponse.length;
  };

  const { data, error } = useSWR(asanaUrl, fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  if (error) {
    return console.log(`Failed to load: ${error}`);
  } else if (!data) {
    return console.log("Loading...");
  } else {
    // console.log(data);
    return data;
  }
};

export default useAsanaData;
