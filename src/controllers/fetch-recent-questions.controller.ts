import { Controller, UseGuards, Get, Query } from '@nestjs/common'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'
import { z } from 'zod'

const pageQuerySchema = z.string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1))

export type PageQueryParamSchema = z.infer<typeof pageQuerySchema>     

const queryValidatePipe = new ZodValidationPipe(pageQuerySchema)

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Query('page', queryValidatePipe) page: PageQueryParamSchema) {
    const questions = await this.prisma.question.findMany({
        take: 1,
        skip: (page -1) * 1,
        orderBy: {
            createdAt: 'desc'
        },
    })
    return { questions }
}
   
  
  
}