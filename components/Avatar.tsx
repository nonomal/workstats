import Image from "next/image";

const Avatar = () => {
  return (
    <div className="object-center m-4">
      <Image
        className="inline object-cover rounded-full"
        src="/vercel.svg"
        width={256}
        height={256}
        alt="Profile image"
      />
    </div>
  );
};

export default Avatar;
