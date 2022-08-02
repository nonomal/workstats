/* eslint-disable react/no-unescaped-entities */
import Head from 'next/head';
import React from 'react';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - WorkStats</title>
        <meta
          name='description'
          content='This is the WorkStats Privacy Policy page'
        />
      </Head>
      <main className='px-5'>
        <h1 className='text-3xl py-4'>Privacy Policy for Suchica, Inc.</h1>

        <p className='py-1'>
          At WorkStats, accessible from{' '}
          <a className='py-1 text-blue-600' href='https://workstats.dev'>
            https://workstats.io
          </a>
          , one of our main priorities is the privacy of our visitors. This
          Privacy Policy document contains types of information that is
          collected and recorded by WorkStats and how we use it.
        </p>
        <p className='py-1'>
          If you have additional questions or require more information about our
          Privacy Policy, do not hesitate to contact us.
        </p>
        <p className='py-1'>
          This Privacy Policy applies only to our online activities and is valid
          for visitors to our website with regards to the information that they
          shared and/or collect in WorkStats. This policy is not applicable to
          any information collected offline or via channels other than this
          website. Our Privacy Policy was created with the help of the{' '}
          <a
            className='py-1 text-blue-600'
            href='https://www.generateprivacypolicy.com/'
          >
            Free Privacy Policy Generator
          </a>
          .
        </p>

        <h2 className='text-2xl py-4'>1. Consent</h2>

        <p className='py-1'>
          By using our website, you hereby consent to our Privacy Policy and
          agree to its terms.
        </p>

        <h2 className='text-2xl py-4'>2. Information we collect</h2>

        <p className='py-1'>
          The personal information that you are asked to provide, and the
          reasons why you are asked to provide it, will be made clear to you at
          the point we ask you to provide your personal information.
        </p>
        <p className='py-1'>
          If you contact us directly, we may receive additional information
          about you such as your name, email address, phone number, the contents
          of the message and/or attachments you may send us, and any other
          information you may choose to provide.
        </p>
        <p className='py-1'>
          When you register for an Account, we may ask for your contact
          information, including items such as name, company name, address,
          email address, and telephone number.
        </p>

        <h2 className='text-2xl py-4'>3. How we use your information</h2>

        <p className='py-1'>
          We use the information we collect in various ways, including to:
        </p>

        <ul className='py-1 list-disc list-inside' role='list'>
          <li key={1}>Provide, operate, and maintain our website</li>
          <li key={2}>Improve, personalize, and expand our website</li>
          <li key={3}>Understand and analyze how you use our website</li>
          <li key={4}>
            Develop new products, services, features, and functionality
          </li>
          <li key={5}>
            Communicate with you, either directly or through one of our
            partners, including for customer service, to provide you with
            updates and other information relating to the website, and for
            marketing and promotional purposes
          </li>
          <li key={6}>Send you emails</li>
          <li key={7}>Find and prevent fraud</li>
        </ul>

        <h3 className='text-xl py-3'>
          3-1. How we use your data from Google Calendar API
        </h3>

        <p className='py-1'>
          For example, regarding data integration with the Google Calendar API,
          only if the user presses the "Connect with Google" button and passes
          the subsequent approval process, you will get calendar data associated
          with the Google login account you have chosen.
        </p>
        <p className='py-1'>
          At this time, a variety of data (see{' '}
          <a
            className='py-1 text-blue-600'
            href='https://developers.google.com/calendar/api/v3/reference/events/list#response'
          >
            Response data types for Google Calendar Event List API{' '}
          </a>
          for details) is returned. Using this return value, we will only
          aggregate the number of meetings and their total time in a given
          period and display it on your dashboard. We will also store them in
          our database as per-user data and reuse them for initial display to
          speed up the display of your dashboard from time to time.
        </p>
        <p className='py-1'>
          The API endpoint we are using is{' '}
          <a
            className='py-1 text-blue-600'
            href='https://developers.google.com/calendar/api/v3/reference/events/list'
          >
            Events: list{' '}
          </a>
          and the scope is read-only access to Events
          (https://www.googleapis.com/auth/calendar.events.readonly). Note that
          any meetings you have deleted or cancelled in advance are not included
          at the time of the API return value. Also, even if the retrieval
          period is set to the full period, the data will only be aggregated for
          a maximum of two years.
        </p>

        <h2 className='text-2xl py-4'>4. Log Files</h2>

        <p className='py-1'>
          WorkStats follows a standard procedure of using log files. These files
          log visitors when they visit websites. All hosting companies do this
          and a part of hosting services' analytics. The information collected
          by log files include internet protocol (IP) addresses, browser type,
          Internet Service Provider (ISP), date and time stamp, referring/exit
          pages, and possibly the number of clicks. These are not linked to any
          information that is personally identifiable. The purpose of the
          information is for analyzing trends, administering the site, tracking
          users' movement on the website, and gathering demographic information.
        </p>

        <h2 className='text-2xl py-4'>5. Cookies and Web Beacons</h2>

        <p className='py-1'>
          Like any other website, WorkStats uses 'cookies'. These cookies are
          used to store information including visitors' preferences, and the
          pages on the website that the visitor accessed or visited. The
          information is used to optimize the users' experience by customizing
          our web page content based on visitors' browser type and/or other
          information.
        </p>

        <p className='py-1'>
          For more general information on cookies, please read{' '}
          <a
            className='py-1 text-blue-600'
            href='https://www.generateprivacypolicy.com/#cookies'
          >
            the Cookies article on Generate Privacy Policy website
          </a>
          .
        </p>

        <h2 className='text-2xl py-4'>6. Google DoubleClick DART Cookie</h2>

        <p className='py-1'>
          Google is one of a third-party vendor on our site. It also uses
          cookies, known as DART cookies, to serve ads to our site visitors
          based upon their visit to www.website.com and other sites on the
          internet. However, visitors may choose to decline the use of DART
          cookies by visiting the Google ad and content network Privacy Policy
          at the following URL
          <a
            className='py-1 text-blue-600'
            href='https://policies.google.com/technologies/ads'
          >
            {' '}
            https://policies.google.com/technologies/ads
          </a>
        </p>

        <h2 className='text-2xl py-4'>7. Our Advertising Partners</h2>

        <p className='py-1'>
          Some of advertisers on our site may use cookies and web beacons. Our
          advertising partners are listed below. Each of our advertising
          partners has their own Privacy Policy for their policies on user data.
          For easier access, we hyperlinked to their Privacy Policies below.
        </p>

        <ul className='py-1 list-disc list-inside'>
          <li>
            Google:{' '}
            <a
              className='py-1 text-blue-600'
              href='https://policies.google.com/technologies/ads'
            >
              https://policies.google.com/technologies/ads
            </a>
          </li>
        </ul>

        <h2 className='text-2xl py-4'>
          8. Advertising Partners Privacy Policies
        </h2>

        <p className='py-1'>
          You may consult this list to find the Privacy Policy for each of the
          advertising partners of WorkStats.
        </p>

        <p className='py-1'>
          Third-party ad servers or ad networks uses technologies like cookies,
          JavaScript, or Web Beacons that are used in their respective
          advertisements and links that appear on WorkStats, which are sent
          directly to users' browser. They automatically receive your IP address
          when this occurs. These technologies are used to measure the
          effectiveness of their advertising campaigns and/or to personalize the
          advertising content that you see on websites that you visit.
        </p>

        <p className='py-1'>
          Note that WorkStats has no access to or control over these cookies
          that are used by third-party advertisers.
        </p>

        <h2 className='text-2xl py-4'>9. Third Party Privacy Policies</h2>

        <p className='py-1'>
          WorkStats's Privacy Policy does not apply to other advertisers or
          websites. Thus, we are advising you to consult the respective Privacy
          Policies of these third-party ad servers for more detailed
          information. It may include their practices and instructions about how
          to opt-out of certain options.{' '}
        </p>

        <p className='py-1'>
          You can choose to disable cookies through your individual browser
          options. To know more detailed information about cookie management
          with specific web browsers, it can be found at the browsers'
          respective websites.
        </p>

        <h2 className='text-2xl py-4'>
          10. CCPA Privacy Rights (Do Not Sell My Personal Information)
        </h2>

        <p className='py-1'>
          Under the CCPA, among other rights, California consumers have the
          right to:
        </p>
        <p className='py-1'>
          Request that a business that collects a consumer's personal data
          disclose the categories and specific pieces of personal data that a
          business has collected about consumers.
        </p>
        <p className='py-1'>
          Request that a business delete any personal data about the consumer
          that a business has collected.
        </p>
        <p className='py-1'>
          Request that a business that sells a consumer's personal data, not
          sell the consumer's personal data.
        </p>
        <p className='py-1'>
          If you make a request, we have one month to respond to you. If you
          would like to exercise any of these rights, please contact us.
        </p>

        <h2 className='text-2xl py-4'>11. GDPR Data Protection Rights</h2>

        <p className='py-1'>
          We would like to make sure you are fully aware of all of your data
          protection rights. Every user is entitled to the following:
        </p>
        <p className='py-1'>
          The right to access - You have the right to request copies of your
          personal data. We may charge you a small fee for this service.
        </p>
        <p className='py-1'>
          The right to rectification - You have the right to request that we
          correct any information you believe is inaccurate. You also have the
          right to request that we complete the information you believe is
          incomplete.
        </p>
        <p className='py-1'>
          The right to erasure - You have the right to request that we erase
          your personal data, under certain conditions.
        </p>
        <p className='py-1'>
          The right to restrict processing - You have the right to request that
          we restrict the processing of your personal data, under certain
          conditions.
        </p>
        <p className='py-1'>
          The right to object to processing - You have the right to object to
          our processing of your personal data, under certain conditions.
        </p>
        <p className='py-1'>
          The right to data portability - You have the right to request that we
          transfer the data that we have collected to another organization, or
          directly to you, under certain conditions.
        </p>
        <p className='py-1'>
          If you make a request, we have one month to respond to you. If you
          would like to exercise any of these rights, please contact us.
        </p>

        <h2 className='text-2xl py-4'>12. Children's Information</h2>

        <p className='py-1'>
          Another part of our priority is adding protection for children while
          using the internet. We encourage parents and guardians to observe,
          participate in, and/or monitor and guide their online activity.
        </p>

        <p className='py-1'>
          WorkStats does not knowingly collect any Personal Identifiable
          Information from children under the age of 13. If you think that your
          child provided this kind of information on our website, we strongly
          encourage you to contact us immediately and we will do our best
          efforts to promptly remove such information from our records.
        </p>
        <div className='h-20'></div>
      </main>
    </>
  );
}

PrivacyPolicy.requiresAuth = false;
