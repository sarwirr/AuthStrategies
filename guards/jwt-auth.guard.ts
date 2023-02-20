import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { Role, ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  requiredRoles: Role[];
  isPublic: Boolean = false;
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const { user } = context.switchToHttp().getRequest();
    this.isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    this.requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (this.isPublic) {
      return true;
    }
    if (err || !user) {
      throw new UnauthorizedException();
    }
    if (this.requiredRoles && !this.requiredRoles.includes(user.role)) {
      throw new ForbiddenException();
    }
    return user;
  }
}
