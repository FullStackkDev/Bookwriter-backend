// SignIn/design.js
import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import LogoImage from "../../logo.svg";
import jwt_decode from "jwt-decode";
import { googleClientId } from "../../utils/constant";
import { signInStyles } from "./style";
function SignInDesign({ userData, handleChange, handleSubmit, handleGoogle }) {
  const { boxContainer, title, form, button } = signInStyles;

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={boxContainer}>
        <img src={LogoImage} alt="Logo" width="200" height="100" />
        <Typography component="h1" variant="h5" sx={title}>
          Book Writer
        </Typography>

        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={form}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            onChange={(e) => handleChange(e)}
            autoFocus
            error={userData.errors.email ? true : false}
            helperText={userData.errors.email}
            value={userData.email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            onChange={(e) => handleChange(e)}
            error={userData.errors.password ? true : false}
            helperText={userData.errors.password}
            value={userData.password}
          />
          <Button type="submit" fullWidth variant="contained" sx={button}>
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item>
              <GoogleOAuthProvider clientId={googleClientId}>
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    var decoded = jwt_decode(credentialResponse.credential);
                    console.log(decoded);
                    handleGoogle(decoded);
                  }}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                />
              </GoogleOAuthProvider>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default SignInDesign;