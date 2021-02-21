import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

const CreateQuestion = z
  .object({
    text: z.string(),
  })
  .nonstrict()

export default resolver.pipe(resolver.zod(CreateQuestion), resolver.authorize(), async (input) => {
  const question = await db.question.create({
    data: {
      ...input,
      choices: { create: input.choices },
    },
  })

  return question
})
