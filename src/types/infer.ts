export type Args<T extends (...args: any) => any> = T extends (...args: infer A) => any ? A : T
