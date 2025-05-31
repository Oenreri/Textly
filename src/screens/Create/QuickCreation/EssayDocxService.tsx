import { Document, Packer, Paragraph, TextRun, AlignmentType, convertInchesToTwip } from 'docx';
import RNFS from 'react-native-fs';
import { Alert } from 'react-native';

const FONT_SIZE = 28;
const NORMAL_FONT_SIZE = 14;

const createParagraph = (text, options = {}) => {
    return new Paragraph({
        children: [
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

// Убираем ** из текста
const cleanText = (text) => text.replace(/\*\*/g, '');

export const createEssayDOCX = async (title, essayContent) => {
    try {
        

        // Разбиваем текст по абзацам и очищаем его
        const paragraphs = essayContent
            .split(/\n+/) // Разделение по пустым строкам
            .map(paragraph => cleanText(paragraph.trim())) // Убираем ** и пробелы
            .filter(paragraph => paragraph !== '') // Убираем пустые абзацы
            .map(paragraph => createParagraph(paragraph, { indent: true })); // Создаем абзацы с отступами

        const docChildren = [
            createParagraph("Эссе", { bold: true, size: FONT_SIZE, alignment: AlignmentType.CENTER }),
            ...paragraphs,
        ];

        console.log("📄 Содержимое эссе:", essayContent);

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
            Alert.alert('Ошибка', 'Файл не был создан. Проверьте права доступа.');
            return null;
        }

        console.log('✅ DOCX сохранен в:', filePath);
        return filePath;
    } catch (error) {
        console.error('🚨 Ошибка при создании эссе DOCX:', error);
        Alert.alert('Ошибка', 'Не удалось создать файл эссе.');
        throw error;
    }
};
