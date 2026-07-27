# Authentication setup

Qzaar supports email/password sign-in, Google Identity Services, and a password-reset OTP flow.

## Configure locally

1. Copy `streetqr/.env.example` to `streetqr/.env` and set the browser variables.
2. Copy `streetqr/backend/.env.example` to `streetqr/backend/.env` and set MongoDB, email, and Google values.
3. In Google Cloud, create a Web application OAuth client. Add your local and deployed front-end origins, then use its client ID in both environment files.
4. For Gmail, generate an App Password for the sending account. Never place a regular mailbox password in the environment file.

## Password reset flow

1. The user requests a reset code with an email address.
2. The server returns the same success response whether or not the account exists.
3. A six-digit code is hashed before storage, expires after 10 minutes, and is limited to five attempts.
4. A valid code exchanges for a separate, short-lived reset grant. Only that grant can change the password.

The relevant endpoints are `POST /api/forgot-password`, `POST /api/forgot-password/verify-otp`, and `POST /api/reset-password`.

## Production checklist

- Set `FRONTEND_URL` and `CORS_ORIGINS` to the exact deployed frontend origins.
- Use a long, random `JWT_SECRET` and managed environment variables.
- Configure a real MongoDB database and an email sender before enabling public signup.
- Register the deployed URL in Google OAuth's authorized JavaScript origins.
