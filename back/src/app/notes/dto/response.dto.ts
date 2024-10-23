import { ApiProperty } from "@nestjs/swagger";

export class NotesUploadResponse {
  @ApiProperty({ example: '66e0398769070b99573f5951' })
  id: string;
}

export class NotesResponse {
  @ApiProperty({ example: '66e0398769070b99573f5951' })
  id: string;

  @ApiProperty({ example: '66e0398769070b99573f5951' })
  customerId: string;

  @ApiProperty({ example: 'This is a note' })
  note: string;

  @ApiProperty({ example: '2021-08-12' })
  createdAt: string;

  @ApiProperty({ example: '2021-08-12' })
  updatedAt: string;
}