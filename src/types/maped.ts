export type SwitchNumberToBoolean<T> = {
  [Property in keyof T]: T[Property] extends number ? boolean : T[Property]
}

type EzType = {
  a: number
  b: number
  c: string
}

type NewType = SwitchNumberToBoolean<EzType>

const obj: NewType = {
  a: false,
  b: true,
  c: ''
}
