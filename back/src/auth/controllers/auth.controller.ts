import { Body, Controller, Get, Post, Patch, HttpCode, ParseIntPipe, HttpStatus, Req, Res, BadRequestException,  UseGuards, UnauthorizedException, Param, ConflictException } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { Api42AuthGuard, JwtGuard, TwoFAGuard  } from '../guards/auth.guard';
import { AuthDto, CreateUserDto, TwoFaDto } from "../dto/";
import { getUser } from "../decorators/users.decorator";
import { UsersService } from "../services/users.service";
import { Response, Request } from 'express';
import { User, UserStatus } from '@prisma/client';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService, 
		private userService: UsersService) {}

	/*********************** Auth form routes *******************************/

	@Post('signup')
	@HttpCode(HttpStatus.OK)
	async signup(@Body() dto: CreateUserDto): Promise<{access_token: string}> {
		try {
			if (dto.email.endsWith("@student.42.fr"))
				throw new UnauthorizedException("42 emails are forbidden");
			const token = await this.authService.signup(dto);
			return token; 
		} catch (error) {
			throw error.message
		}
	}

	@Post('signin')
	@HttpCode(HttpStatus.OK)
	async signin(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response): 
	Promise<{ access_token: string} | Partial<User>> {
		try {
			type token = Partial<User> | { access_token: string }
			const tok: token  = await this.authService.validateUser(dto);
			if ('id' in tok)
				res.clearCookie('id').clearCookie('two_FA')
			return tok;
		} catch (error) {
			throw error
		}
	}

	@Get('logout')
	@UseGuards(JwtGuard)
	async logout(@getUser() user: User, @Res({ passthrough: true }) res: Response): Promise<void> {
		res.clearCookie('id').clearCookie('access_token')
		this.authService.logout(user.id);
	}

	/*********************** Api42 routes ****************** ****************/

	@Get('api42')
	@UseGuards(Api42AuthGuard)
	async get42User(@getUser() user: User): Promise<User> {
		return user;
	}

	@Get('api42/callback')
	@UseGuards(Api42AuthGuard)
	async handle42Redirect(@getUser() user: {user: User, isNew: boolean} | Partial<User> | User, 
	@Res({ passthrough: true }) res: Response,
	): Promise<void> {
		try {
			if (!user)
				throw new BadRequestException("Can't find user from 42 intra");
			if ('id' in user) { // utilisateur 42 connu
				const token = await this.authService.signToken(user.id, user.username);
				if (!user.twoFA) {
					res.clearCookie('token', { httpOnly: true })
					.cookie('isNew', false)
					.cookie("access_token", token.access_token)
					.redirect("http://localhost:5173")
				}
				res.cookie('two_FA', true)
				.cookie('id', user.id)
				.redirect(`http://localhost:5173/twofa`)	
			}
			if ('isNew' in user) {
				const token = await this.authService.signToken(user.user.id, user.user.username);		
				res.clearCookie('token', { httpOnly: true })
				.cookie('isNew', true)
				.cookie("access_token", token.access_token)
				.redirect("http://localhost:5173")
			}
		} catch (error) {
			throw new BadRequestException(error.message)
		}
	}

	/*********************** 2FA routes *************************************/

	@Get('2fa/generate')  // cree le service de 2FA en creeant le twoFASecret du user et en generant un QRcode 
	@UseGuards(JwtGuard)
	async register(@getUser() user: User): Promise <string> {
		try {
			const { otpAuthURL } = await this.authService.generateTwoFASecret(user);	
			const QRcode = await this.authService.generateQrCodeDataURL(otpAuthURL);
			if (!QRcode)
				throw new BadRequestException('Failed to generate QRCode');
			return (QRcode);
		} catch (error) {
			throw new BadRequestException(error.message)
		}
	}

	@Patch('2fa/enable') // enable TwoFA attend un code envoye dans le body 
	@UseGuards(JwtGuard)
	async turnOnTwoFA(@getUser() user: User, @Body() { twoFACode }: TwoFaDto) {
		return await this.userService.turnOnTwoFA(user, twoFACode);
	}

	@Post('2fa/authenticate/:id')
  	@HttpCode(200)
  	async authenticate(@Param('id', ParseIntPipe) userId: number, @Body() { twoFACode }: TwoFaDto): Promise <{access_token: string}> {
		return await this.authService.loginWith2fa(userId, twoFACode)
  	}

	@Patch('2fa/disable')
	@HttpCode(200)
	@UseGuards(JwtGuard, TwoFAGuard)
	async disable(@getUser() user: User, @Body() { twoFACode }: TwoFaDto) {
		return await this.userService.disableTwoFA(user, twoFACode)
	}

}
