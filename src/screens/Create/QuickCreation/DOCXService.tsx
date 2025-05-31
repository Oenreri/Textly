import { Document, Packer, Paragraph, TextRun, AlignmentType, convertInchesToTwip, PageBreak } from 'docx';
import RNFS from 'react-native-fs';
import { Alert } from 'react-native';

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

export const createDOCX = async (title, content, structure, sections) => {
    try {
        let docChildren = [];

        // Добавляем структуру работы только на первой странице
        docChildren.push(createParagraph("Структура", { bold: false, size: FONT_SIZE, alignment: AlignmentType.CENTER }));

        const addedSections = new Set();

        structure.forEach((section) => {
            const sectionTitle = section.title.trim();
            if (!addedSections.has(sectionTitle)) {
                docChildren.push(createParagraph(sectionTitle, { bold: true }));
                addedSections.add(sectionTitle);
            }

            section.subSections?.forEach((sub) => {
                const subTitle = sub.title.trim();
                if (!addedSections.has(subTitle)) {
                    docChildren.push(createParagraph(subTitle, { indent: true }));
                    addedSections.add(subTitle);
                }
            });
        });

        docChildren.push(new Paragraph({ children: [] })); // Пустая строка после структуры

        // Генерация основного содержимого
        const paragraphs = content
            .split(/\n+/)
            .map(paragraph => paragraph.trim())
            .filter(paragraph => paragraph !== '')
            .map((paragraph, index) => {
                const isHeader = /^⟱/.test(paragraph);
                const cleanedParagraph = paragraph
                    .replace(/[⟱⟰]/g, '')
                    .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1')
                    .replace(/#+\s*/g, '');

                return createParagraph(cleanedParagraph, {
                    indent: !isHeader,
                    pageBreak: isHeader,
                    bold: isHeader,
                    alignment: isHeader ? AlignmentType.CENTER : AlignmentType.JUSTIFIED,
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

        const fileName = `${title.replace(/\s+/g, ' ')}.docx`;
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
        Alert.alert('Ошибка', 'Не удалось создать файл.');
        throw error;
    }
};
