import { Body, Controller, Delete, FileTypeValidator, Get, HttpStatus, Param, ParseFilePipe, Post, SetMetadata, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { AuthGuard } from '../auth/auth.guard';
import { AUTHORIZED_ROLES } from '../auth/roles/constants';
import { RolesGuard } from '../auth/roles/roles.guard';
import { NotesService } from './notes.service';
import { NotesUploadBody } from './dto/body.dto';
import { NotesCustomerQuery, NotesQuery } from './dto/query.dto';
import { NotesResponse, NotesUploadResponse } from './dto/response.dto';
import { NotFoundError } from '../dto/response.notFound.dto';
import { BadRequestError } from '../dto/response.badRequest.dto';
import { InternalError } from '../dto/response.internal.dto';

@Controller('notes')
@ApiTags('notes')
@ApiBearerAuth('token')
@UseGuards(AuthGuard, RolesGuard)
export class NotesController {
  constructor(private notesService: NotesService) {}

  // POST : Upload notes for a customer
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @SetMetadata('roles', AUTHORIZED_ROLES)
  @ApiOperation({ summary: 'Upload notes for a customer' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Notes uploaded', type: NotesUploadResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Customer not found', type: NotFoundError })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid file type', type: BadRequestError })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error while transcribing speech', type: InternalError })
  uploadNotes(@Body() body: NotesUploadBody, @UploadedFile(
    new ParseFilePipe({ validators: [new FileTypeValidator({ fileType: 'audio/mpeg' }) ]})
  ) file: Express.Multer.File) {
    return this.notesService.uploadNotes(body, file);
  }

  // GET : Get notes for a customer
  @Get('/:customerId')
  @SetMetadata('roles', AUTHORIZED_ROLES)
  @ApiOperation({ summary: 'Get notes for a customer' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Notes retrieved', type: [NotesResponse] })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Customer not found', type: NotFoundError })
  getNotes(@Param() customerId: NotesCustomerQuery) {
    return this.notesService.getNotes(customerId);
  }

  // DELETE : Delete all notes for a customer
  @Delete('/:customerId')
  @SetMetadata('roles', AUTHORIZED_ROLES)
  @ApiOperation({ summary: 'Delete all notes for a customer' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Notes deleted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Customer not found', type: NotFoundError })
  deleteAllNotes(@Param() customerId: NotesCustomerQuery) {
    return this.notesService.deleteAllNotes(customerId);
  }

  // DELETE : Delete selected note for a customer
  @Delete('/:noteId')
  @SetMetadata('roles', AUTHORIZED_ROLES)
  @ApiOperation({ summary: 'Delete selected note for a customer' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Note deleted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Note not found', type: NotFoundError })
  deleteNotes(@Param() noteId: NotesQuery) {
    return this.notesService.deleteNotes(noteId);
  }
}
