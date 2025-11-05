import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { auth } from 'express-oauth2-jwt-bearer';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

interface RequestWithAuth extends Request {
  user?: {
    userId: string;
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
      // Wrap middleware in Promise instead of using promisify
      await new Promise<void>((resolve, reject) => {
        this.jwtCheck(request, response, (err?: any) => {
          if (err) {
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            reject(err);
          } else {
            resolve();
          }
        });
      });

      // Extract user info from the token payload
      if (request.auth) {
        const authPayload = request.auth;

        // Extract userId from 'sub' field (format: "auth0|69085eab581799cf1f72e67f")
        const userId = authPayload.payload.sub;

        request.user = {
          userId: userId ?? '',
        };
      } else {
        console.warn('Auth payload is missing from request');
      }

      return true;
    } catch (error) {
      console.error('Auth0 authentication error:', error);
      throw new UnauthorizedException(
        `Invalid or missing authentication token ${error}`,
      );
    }
  }
}
