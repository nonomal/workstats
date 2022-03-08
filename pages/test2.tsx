import {
  slackConversationHistory,
  slackConversationList,
} from "../services/slackServices.server";

const test = ({ numberOfNewSent, channelList }) => {
  console.log(numberOfNewSent);
  console.log(channelList);
  return (
    <div>
      {/* <div>{channelList.length}</div> */}
      <div>{numberOfNewSent}</div>
    </div>
  );
};

export async function getServerSideProps() {
  const newSentUser: string = "U02DK80DN9H";
  const channelList = await slackConversationList();
  let numberOfNewSent: number = 0;
  for (let x in channelList) {
    let channel = channelList[x];
    numberOfNewSent += await slackConversationHistory(channel, newSentUser);
  };
  return { props: { numberOfNewSent, channelList } };
}

export default test;
