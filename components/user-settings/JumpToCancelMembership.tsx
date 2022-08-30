// Next.js and React related
import Link from 'next/link';
import Image from 'next/image';
import NewTabIcon from '../../public/new-tab-svgrepo-com.svg';

const JumpToCancelMembership = () => {
  return (
    <div id='cancel-membership'>
      <div className='flex'>
        <Link href='/cancel-membership'>
          <a
            className='mr-3'
            target='_blank'
            rel='noreferrer noopener' // Must pair with target='_blank'
          >
            <button className='text-xl mt-8 mb-2 ml-2 pl-1 underline underline-offset-4'>
              Cancel Membership
            </button>
          </a>
        </Link>
        <div className='mt-9 mb-1'>
          <Image
            src={NewTabIcon}
            width={24}
            height={24}
            layout='intrinsic'
            alt='Open a new tab'
            quality={75}
            priority={false}
            placeholder='empty'
          />
        </div>
      </div>
      <p className='py-1 ml-2 pl-1'>
        If you wish to cancel your membership to this service, please follow
        this link.
      </p>
    </div>
  );
};

export default JumpToCancelMembership;
