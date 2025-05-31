import { Document, Packer, Paragraph, HeadingLevel, TextRun, AlignmentType, convertInchesToTwip, PageBreak } from 'docx';
import RNFS from 'react-native-fs';

const FONT_SIZE = 28;
const NORMAL_FONT_SIZE = 14;

const createParagraph = (text, options = {}) => {
    return new Paragraph({
        children: [
            ...(options.pageBreak ? [new PageBreak()] : []),
            new TextRun({
                text,
                font: "Times New Roman",
                size: options.size || NORMAL_FONT_SIZE * 2,
                bold: options.bold || false,
            }),
        ],
        spacing: { line: 360, after: 200 },
        indent: options.indent ? { firstLine: convertInchesToTwip(0.49) } : undefined,
        alignment: options.alignment || AlignmentType.JUSTIFIED,
    });
};

export const createDiplomaDOCX = async (title, content, structure, sections) => {
    try {
        let docChildren = [];

        let isFirstPage = true;
        if (isFirstPage) {
            docChildren.push(createParagraph("Структура", { bold: false, size: FONT_SIZE, alignment: AlignmentType.CENTER }));

            structure.forEach((section) => {
                docChildren.push(createParagraph(section.title, { bold: false, indent: false }));

                if (section.subSections) {
                    section.subSections.forEach((sub) => {
                        docChildren.push(createParagraph(sub.title, { indent: true, bold: false }));
                        if (sub.subSections) {
                            sub.subSections.forEach((subSub) => {
                                docChildren.push(createParagraph(subSub.title, { indent: true, bold: false }));
                            });
                        }
                    });
                }
            });

            docChildren.push(new Paragraph({ children: [] }));
            isFirstPage = false;
        }

        const paragraphs = content
            .split(/\n+/)
            .map(paragraph => paragraph.trim())
            .filter(paragraph => paragraph !== '')
            .map((paragraph, index) => {
                const isHeader = /^⟱/.test(paragraph); // Проверяем, начинается ли строка с "⟱"
                const cleanedParagraph = paragraph
                    .replace(/[⟱⟰]/g, '') // Убираем ⟱ и ⟰
                    .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1') // Убираем `*` и `**`
                    .replace(/#+\s*/g, ''); // Убираем `#` в начале строки

                return createParagraph(cleanedParagraph, {
                    indent: true,
                    pageBreak: isHeader,
                    bold: isHeader, // Делаем заголовки жирными
                    align: isHeader ? 'center' : 'left' // Выравниваем заголовки по центру
                });
            });

        docChildren.push(...paragraphs);

        console.log("📄 Содержимое работы:", content);

        const doc = new Document({
            sections: [{
                properties: { pageNumberStart: 1 },
                children: docChildren,
            }],
        });

        // Формирование пути с использованием workTopic как имени файла
        const fileName = `${title.replace(/\s+/g, ' ')}.docx`;  // Преобразование в корректное имя файла
        const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

        const base64String = await Packer.toBase64String(doc);
        await RNFS.writeFile(filePath, base64String, 'base64');

        if (!(await RNFS.exists(filePath))) {
            console.error('🚨 Файл не был создан!');
            return null;
        }

        console.log('✅ DOCX сохранен в:', filePath);
        return filePath;
    } catch (error) {
        console.error('🚨 Ошибка при создании DOCX:', error);
        throw error;
    }
};
