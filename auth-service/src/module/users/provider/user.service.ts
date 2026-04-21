import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from '../dtos/createUser.dto';
import { HashAbstract } from '../../../common/helpers/hashing/hashAbstract';
import { sendResponse } from '../../../common/helpers/responseSender/reaponseHelper';
import { CloudinaryService } from '../../../common/helpers/fileUpload/cloudinary/cloudinary.service';
import { MailService } from '../../../common/helpers/mailsystem/mail.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashAbstract: HashAbstract,
    private readonly cloudinaryService: CloudinaryService,
    private readonly mailService: MailService,
  ) {}

  public async createUserWithEmailPassword(
    userData: CreateUserDto,
    file?: Express.Multer.File,
  ) {
    const { password, ...rest } = userData;
    let imgUrl;
    if (file) {
      // console.log(file);
      imgUrl = await this.cloudinaryService.uploadFile(file);
      console.log('=================>>>>>', imgUrl);
    }

    if (!password) {
      throw new BadRequestException('Password is required');
    }

    const doesExist = await this.prisma.user.findUnique({
      where: {
        email: userData.email,
      },
    });

    if (doesExist) {
      throw new BadRequestException('This email is already in use');
    }

    const hashPassword = await this.hashAbstract.createHash(password);

    const createdUser = await this.prisma.user.create({
      data: {
        ...rest,
        password: hashPassword,
        img: imgUrl.secure_url,
      },
    });

    if (!createdUser) {
      throw new Error('user creation failed');
    }

    const emailSent = await this.mailService.sendMail(
      createdUser.email,
      'wellcome to the bachelors united',
      'your account has been created thank you for being with us',
    );

    console.log(emailSent);

    return sendResponse({
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
      data: { isEmailSent: emailSent, ...createdUser },
    });
  }

  public async findAllUser() {
    const allUsers = await this.prisma.user.findMany();
    return sendResponse({
      success: true,
      statusCode: HttpStatus.FOUND,
      message: 'all users found',
      data: allUsers,
    });
  }
}
