import { StudentsRepository } from "@/domain/forum/application/repositories/students-repository";
import { PrismaService } from "../prisma.service";
import { Student } from "@/domain/forum/enterprise/entities/student";



export class PrismaStudentsRepository implements StudentsRepository {
  constructor(private prisma: PrismaService){}


  async findByEmail(email: string): Promise<Student | null>{
    return null
  }




  async create(student: Student): Promise<void>{

  }

}