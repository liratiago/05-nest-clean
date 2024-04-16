import { Controller, UseGuards, Get, Query, BadRequestException } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { QuestionPresenter } from '../presenters/question-presenter'

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
  constructor(private fetchRecentQuestions: FetchRecentQuestionsUseCase) {}

  @Get()
  async handle(@Query('page', queryValidatePipe) page: PageQueryParamSchema) {
    

    const result = await this.fetchRecentQuestions.execute(
        {    
             page,
        })

    if (result.isLeft()){
      throw new BadRequestException()
    }
        
    
    const questions = result.value.questions

    return { questions: questions.map(QuestionPresenter.toHTTP) }
  }

}