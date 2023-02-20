import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import * as OpenIDClient from "openid-client";

@Injectable()
export class OpenIDStrategy extends PassportStrategy(
  OpenIDClient.Strategy,
  "oidc"
) {
  constructor() {
    super({
      client_id: process.env.APP_AUTH_CLIENT_ID,
      client_secret: process.env.AUTH_CLIENT_SECRET,
      callbackURL: process.env.APP_AUTH_REDIRECT_URI,
      passReqToCallback: true,
      scope: ["openid"],
    });
  }

  validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile,
    done: Function
  ) {
    return done(null, { ...profile, accessToken, refreshToken });
  }
}
