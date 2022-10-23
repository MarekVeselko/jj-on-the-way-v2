export class Email {
    constructor(
        public email: string,
        public text: string,
        public contactReason: string[],
        public name: string,
        public surname: string
    ) { }
}
