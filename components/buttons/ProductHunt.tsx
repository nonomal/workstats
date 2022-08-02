import Image from 'next/image';

const ProductHunt = () => {
  return (
    <a
      href='https://www.producthunt.com/posts/workstats?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-workstats'
      target='_blank'
      rel='noopener noreferrer'
      className='flex w-56 md:w-72 place-content-center'
    >
      <Image
        src='https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=348419&theme=light'
        alt='WorkStats - Quantify&#0032;productivity&#0059;&#0032;Tally&#0032;from&#0032;GitHub&#0044;&#0032;Asana&#0044;&#0032;and&#0032;Slack&#0046; | Product Hunt'
        // style='width: 250px; height: 54px;'
        width='250'
        height='54'
      />
    </a>
  );
};

export default ProductHunt;
