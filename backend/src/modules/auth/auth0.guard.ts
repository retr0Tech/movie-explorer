import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { auth } from 'express-oauth2-jwt-bearer';
import { ConfigService } from '@nestjs/config';
import { promisify } from 'util';
import { Request, Response, NextFunction } from 'express';

// Extend Express Request type to include auth0 properties
interface Auth0Payload {
  sub: string;
  email?: string;
  permissions?: string[];
  [key: string]: unknown;
}

interface RequestWithAuth extends Request {
  auth0?: Auth0Payload;
  user?: {
    userId: string;
    email?: string;
    permissions: string[];
  };
}

@Injectable()
export class Auth0Guard implements CanActivate {
  private jwtCheck: (req: Request, res: Response, next: NextFunction) => void;

  constructor(private configService: ConfigService) {
    const domain = this.configService.get<string>('AUTH0_DOMAIN');
    const audience = this.configService.get<string>('AUTH0_AUDIENCE');

    this.jwtCheck = auth({
      audience: audience || `https://${domain}/api/v2/`,
      issuerBaseURL: `https://${domain}`,
      tokenSigningAlg: 'RS256',
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithAuth>();
    const response = context.switchToHttp().getResponse<Response>();

    try {
      await promisify(this.jwtCheck)(request, response);

      // Extract user info from the token payload
      if (request.auth0) {
        request.user = {
          userId: request.auth0.sub,
          email: request.auth0.email,
          permissions: request.auth0.permissions || [],
        };
      }

      return true;
    } catch {
      throw new UnauthorizedException(
        'Invalid or missing authentication token',
      );
    }
  }
}
