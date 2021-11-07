import { AuthProvider } from '../auth';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <div className="container mx-auto my-10">
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </div>
  );
};

export default MyApp;