import useSWR from 'swr';

// Record<Keys,Type> is a Utility type in typescript. It is a much cleaner alternative for key-value pairs where property-names are not known. It's worth noting that Record<Keys,Type> is a named alias to {[k: Keys]: Type} where Keys and Type are generics.
interface Params extends Record<string, string> {
  workspace: string;
  assignee: string;
}

const params: Params = {
  workspace: '',
  assignee: ''
};

const useNumberOfTasks = (
  asanaPersonalAccessToken: string,
  asanaWorkspaceId: string,
  asanaUserId: string
) => {
  // The official document is here: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#headers
  const token = asanaPersonalAccessToken;
  const myHeaders = new Headers();
  myHeaders.append('Accept', 'application/json');
  myHeaders.append('Authorization', 'Bearer ' + token);

  // Query parameters are passed in the URL.
  params.workspace = asanaWorkspaceId;
  params.assignee = asanaUserId;
  params.opt_fields = 'completed,completed_at';
  interface item {
    completed: boolean;
    completed_at: string;
  }
  const query = new URLSearchParams(params);
  // The official document is here: https://developers.asana.com/docs/get-multiple-tasks
  const asanaUrl = `https://app.asana.com/api/1.0/tasks?${query}`;

  // The official document is here: https://swr.vercel.app/docs/data-fetching
  const fetcher = async (url: string) => {
    const response = await fetch(url, {
      headers: myHeaders
    }).then((res) => res.json());

    const numberOfAll: number = response.data.length;

    const numberOfClosed: number = response['data'].filter((item: item) => {
      return item['completed'] === true;
    }).length;

    const output = {
      numberOfAll: numberOfAll,
      numberOfClosed: numberOfClosed,
      numberOfOpened: numberOfAll - numberOfClosed
    };
    return output;
  };

  const { data, error } = useSWR(asanaUrl, fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true
  });

  if (error) {
    console.log(`Failed to load: ${error}`);
    return 0;
  } else if (!data) {
    console.log('Loading stats of asana...');
    return 0;
  } else {
    return data;
  }
};

export { useNumberOfTasks };
