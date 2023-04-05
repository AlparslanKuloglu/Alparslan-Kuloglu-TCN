import { Body, Controller, Post, ValidationPipe} from '@nestjs/common';
import { UsePipes } from '@nestjs/common/decorators';
import { CreateOfferDTO } from 'dto/createOfferDTO';
import { Request } from 'express';
import { OfferService } from 'services/offer.service';

@Controller()
export class OfferController {
  constructor( private readonly OfferService: OfferService,) {}

  @UsePipes(ValidationPipe)
  @Post('createOffer')
 async createOffer ( @Body()  CreateOfferDTO:CreateOfferDTO ): Promise<string> {

  try {
    await this.OfferService.create(CreateOfferDTO)
    return "You have been succesfully create a offer"
  } catch(error) { 
    throw error
  }
 }
}