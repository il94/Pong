import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { Api42Strategy } from "./strategy/api42.strategy";
import { SessionSerializer } from "./Serializer";

@Module ({
	imports: [
		PrismaModule,
		//UserModule,
		JwtModule.register({
		//	global: true,
		//	secret: jwtConstants.secret,
		//	signOptions: { expiresIn: '60s' }
		}),
		PassportModule.register({ defaultStrategy: '42' }),
	],
	providers: [JwtStrategy, Api42Strategy, AuthService, SessionSerializer],
	controllers: [AuthController],
	exports: [AuthService],
})

export class AuthModule {}