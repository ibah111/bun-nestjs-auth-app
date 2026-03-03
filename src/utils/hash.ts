import * as bcrypt from 'bcrypt'

/**
 * @TODO remake to process.env.ROUNDS
 */
const rounds = 12

export const hashUtility = async (password: string) => {
  return await bcrypt.hash(password, rounds);
}

