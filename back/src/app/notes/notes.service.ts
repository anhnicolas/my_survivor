import { HfInference } from '@huggingface/inference';
import { Body, FileTypeValidator, Injectable, InternalServerErrorException, NotFoundException, Param, ParseFilePipe, UploadedFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Customer } from '../customers/schemas/customer.schema';
import { Note } from './schemas/notes.schema';
import { NotesUploadBody } from './dto/body.dto';
import { NotesCustomerQuery, NotesQuery } from './dto/query.dto';

@Injectable()
export class NotesService {
  private readonly hf_inference = new HfInference(new ConfigService().get('HF_ACCESS_TOKEN'));
  constructor() {}

  @InjectModel(Note.name) private readonly noteModel: Model<Note>;
  @InjectModel(Customer.name) private readonly customerModel: Model<Customer>;

  async uploadNotes(@Body() params: NotesUploadBody, @UploadedFile(
    new ParseFilePipe({ validators: [new FileTypeValidator({ fileType: 'audio/mpeg' }) ]})
  ) file: Express.Multer.File) {
    const customer = await this.customerModel.findById(params.customerId).exec();
    if (!customer)
      throw new NotFoundException('Customer not found');

    const transcription = await this.getSpeechTranscription(file);
    const note = new this.noteModel({
      customerId: params.customerId,
      note: transcription.text,
    });

    await note.save();
    return { id: note._id };
  }

  async getNotes(@Param() params: NotesCustomerQuery) {
    const customer = await this.customerModel.findById(params.customerId).exec();
    if (!customer)
      throw new NotFoundException('Customer not found');

    return this.noteModel.find({ customerId: params.customerId }).exec();
  }

  async deleteAllNotes(@Param() params: NotesCustomerQuery) {
    const customer = await this.customerModel.findById(params.customerId).exec();
    if (!customer)
      throw new NotFoundException('Customer not found');

    await this.noteModel.deleteMany({ customerId: params.customerId }).exec();
  }

  async deleteNotes(@Param() params: NotesQuery) {
    const note = await this.noteModel.findById(params.noteId).exec();
    if (!note)
      throw new NotFoundException('Note not found');

    await this.noteModel.deleteOne({ _id: params.noteId }).exec();
  }

  private async getSpeechTranscription(file: Express.Multer.File) {
    try {
      return await this.hf_inference.automaticSpeechRecognition({ model: 'openai/whisper-large-v3', data: file.buffer });
    } catch {
      throw new InternalServerErrorException('Error while transcribing speech');
    }
  }
}
