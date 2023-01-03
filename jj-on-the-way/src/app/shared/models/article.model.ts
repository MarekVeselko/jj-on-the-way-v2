export class Article {
    constructor(
        public title: string,
        public text: TextBlock[],
        public titleImage: string,
        public language: string,
        public dateCreated: Date,
        public id: string,
        public perex: string,
        public gallery: string[],
        public section: string,
        public isDeleted: boolean,
        public published: boolean
    ) { }
}

export class TextBlock {
    constructor(
        public img: string,
        public text: string,
    ) { }
}
