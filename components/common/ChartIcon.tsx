import Image from 'next/image';
import Link from 'next/link';
import ChartIcon from '../../public/chart-1-svgrepo-com.svg';

interface ChartIconType {
  mt: number;
  mb: number;
  href: string;
  alt: string;
  id?: string;
}

const ChartIconLink = ({ mt, mb, href, alt, id }: ChartIconType) => {
  return (
    <Link href={href} passHref={true}>
      {/* Instead of opening a separate tab, it's too slow and doesn't take advantage of Next's good features. */}
      <a id={id} target='_blank' className={`mt-${mt} mb-${mb} ml-1.5`}>
        <Image
          src={ChartIcon}
          alt={alt}
          layout='intrinsic'
          quality={75}
          priority={false}
          placeholder='empty'
        />
      </a>
    </Link>
  );
};

export default ChartIconLink;
