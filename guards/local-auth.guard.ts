import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class LocalAdminAuthGuard extends AuthGuard("localAdmin") {}

@Injectable()
export class LocalUserAuthGuard extends AuthGuard("localUser") {}
