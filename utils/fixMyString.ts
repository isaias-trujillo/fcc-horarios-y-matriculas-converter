const fixMyString = (str: string) => {
    const pattern = /[\s\n\r\t]+/g;
    return str
        .split(" ")
        .map((s) => s.trim().replaceAll(pattern, ""))
        .join(" ")
        .trim();
};

export default fixMyString;