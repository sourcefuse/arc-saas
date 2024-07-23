import {get} from '@loopback/openapi-v3';
import * as fs from 'fs';
import * as path from 'path';
import {inject} from '@loopback/context';
import {RestBindings, Response} from '@loopback/rest';

const OK = 200;

export class HomePageController {
  private readonly html: string;
  constructor(
    @inject(RestBindings.Http.RESPONSE)
    private readonly response: Response,
  ) {
    this.html = fs.readFileSync(
      path.join(__dirname, '../../public/index.html'),
      'utf-8',
    );
    // Replace base path placeholder from env
    this.html = this.html.replace(
      /\$\{basePath\}/g,
      process.env.BASE_PATH ?? '',
    );
  }

  @get('/')
  homePage() {
    this.response.status(OK).contentType('html').send(this.html);
    return this.response;
  }
}
