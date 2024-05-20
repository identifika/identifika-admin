import { z } from 'zod'

export const postSchema = z.object({
  title: z.string().min(1, 'Title can not be empty'),
  content: z.string().min(1, 'Description can not be empty')
})

export const userSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
  password: z.string().min(8, 'Password minimum length is 8'),
  name: z.string().min(1, 'Name cannot be empty')
})