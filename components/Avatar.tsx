import Image from "next/image";
import { useEffect, useState } from "react";
import getAvatarUrl from "../services/getAnImageFromStorage";

const Avatar = () => {
  // TODO: IDs can be obtained from the user list or from the logged-in user.
  const noImage = "/noProfileImage.png";
  const [avatarUrl, setAvatarUrl] = useState(noImage);

  useEffect(() => {
    const userId = "REArvdg1hv5I6pkJ40nC";
    getAvatarUrl(userId).then((url) => {
      setAvatarUrl(url);
      // console.log(`url is here: ${url}`);
    });
  }, []);
  //   console.log(`avatarUrl is here: ${avatarUrl}`);

  return (
    <div className="object-center m-4">
      <Image
        className="inline object-cover rounded-full"
        // src={noImage}
        src={avatarUrl}
        width={256}
        height={256}
        alt="Profile image"
      />
    </div>
  );
};

export default Avatar;
