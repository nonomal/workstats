// firebase related
import { signInWithPopup } from "@firebase/auth";
import { auth, googleProvider } from '../../config/firebaseClient';

// styles
import { Button, Grid } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

const Login = () => {
    const loginWithGoogle = () => {
        signInWithPopup(auth, googleProvider)
        .then(result => {
            console.log('result is: ', result);
            window.location.reload();
        });
    }
    return (
        <Grid
            container
            spacing={0}
            direction="column"
            justifyContent="center"
            alignItems="center"
            style={{ minHeight: '100vh'}}
        >
            <Button
                variant="contained"
                startIcon={<GoogleIcon />}
                onClick={loginWithGoogle}
            >
                Login with Google
            </Button>
        </Grid>
    );
}

export default Login;