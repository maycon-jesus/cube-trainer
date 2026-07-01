import { generateScramble333 } from '~~/lib/cube/333'

const SCRAMBLE_LEN = 20

export function useScramble() {
  const scramble = useState('scramble', () => '')

  function newScramble() {
    scramble.value = generateScramble333(SCRAMBLE_LEN)
  }

  return { scramble, newScramble }
}
