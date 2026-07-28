import { C1_QUADRIMESTERS, C1_SITUATIONS } from '../data/c1MockData'

export const getC1Quadrimesters = () => C1_QUADRIMESTERS.map(({ id, label }) => ({ id, label }))

export const getC1Dataset = (quadrimesterId) => (
  C1_QUADRIMESTERS.find((quadrimester) => quadrimester.id === quadrimesterId) || C1_QUADRIMESTERS[0]
)

export const getC1Situations = () => C1_SITUATIONS
