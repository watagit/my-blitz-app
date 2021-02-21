import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetQuestionsInput
  extends Pick<Prisma.QuestionFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetQuestionsInput) => {
    const { items: questions, hasMore, nextPage, count } = await paginate({
      skip,
      take,
      count: () => db.question.count({ where }),
      query: (paginateArgs) =>
        db.question.findMany({ ...paginateArgs, where, orderBy, include: { choices: true } }),
    })

    return {
      questions,
      nextPage,
      hasMore,
      count,
    }
  }
)
