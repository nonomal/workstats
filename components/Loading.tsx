import { Grid } from "@mui/material";
import ReactLoading from "react-loading";

// User-defined components must start with a capital letter.
const Loading = ({ type, color }) => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: '100vh'}}
    >
      {/* https://www.npmjs.com/package/react-loading */}
      <ReactLoading
        type={type}
        color={color}
        height={'20%'}
        width={'20%'}
      />
    </Grid>
  );
}

export default Loading;