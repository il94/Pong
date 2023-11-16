import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { Api42Strategy } from "./strategy/api42.strategy";

@Module ({
	imports: [
		PrismaModule,
		UserModule,
		JwtModule.register({
		//	global: true,
		//	secret: jwtConstants.secret,
		//	signOptions: { expiresIn: '60s' }
		}),
	],
	providers: [AuthService, JwtStrategy, Api42Strategy],
	controllers: [AuthController],
	exports: [AuthService],
})

export class AuthModule {}
