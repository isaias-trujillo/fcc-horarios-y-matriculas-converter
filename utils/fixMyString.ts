const fixMyString = (str: string) => {
    return str
        .replace(/[\s\u00A0]+/g, ' ') // replace all kinds of whitespace (including non-breaking) with one space
        .trim();                      // remove leading/trailing spaces
};

export default fixMyString;
