import { ApiProperty } from "@nestjs/swagger";

export class NotesCustomerQuery {
  @ApiProperty({ example: '66e0398769070b99573f5951', description: 'The customer ID.' })
  customerId: string;
}

export class NotesQuery {
  @ApiProperty({ example: '66e0398769070b99573f5951', description: 'The note ID.' })
  noteId: string;
}