import { jsPDF } from 'jspdf';

const PAGE = {
  width: 210,
  height: 297,
  left: 14,
  right: 14,
  top: 13,
  bottom: 14,
};

const COLORS = {
  red: [190, 24, 35],
  black: [28, 28, 28],
  gray: [100, 100, 100],
  lightGray: [244, 244, 244],
  border: [205, 205, 205],
  white: [255, 255, 255],
};

const text = (value, fallback = '-') => {
  const result = String(value ?? '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim();

  return result || fallback;
};

export function createPdfBuilder(options = {}) {
  const {
    title = 'DOKUMENT',
    footerTitle = '',
    companyName = 'WeGoJob',
    companySubtitle = 'Dokument pracowniczy',
  } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const contentWidth = PAGE.width - PAGE.left - PAGE.right;
  const bottomLimit = PAGE.height - PAGE.bottom - 8;

  let y = PAGE.top;
  let pageNumber = 1;

  const setFont = (size = 9, style = 'normal', color = COLORS.black) => {
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
  };

  const drawHeader = () => {
    doc.setFillColor(...COLORS.black);
    doc.rect(0, 0, PAGE.width, 22, 'F');

    doc.setFillColor(...COLORS.red);
    doc.rect(0, 22, PAGE.width, 2.5, 'F');

    setFont(14, 'bold', COLORS.white);
    doc.text(companyName, PAGE.left, 9);

    setFont(7.5, 'normal', [220, 220, 220]);
    doc.text(companySubtitle, PAGE.left, 15);

    setFont(8.5, 'bold', COLORS.white);
    const titleLines = doc.splitTextToSize(text(title), 100);
    doc.text(titleLines, PAGE.width - PAGE.right, 9, {
      align: 'right',
      lineHeightFactor: 1.05,
    });

    y = 31;
  };

  const drawFooter = () => {
    const footerY = PAGE.height - 7;

    doc.setDrawColor(...COLORS.border);
    doc.line(PAGE.left, footerY - 3.5, PAGE.width - PAGE.right, footerY - 3.5);

    setFont(7, 'normal', COLORS.gray);

    if (footerTitle) {
      doc.text(footerTitle, PAGE.left, footerY);
    }

    doc.text(`Strona ${pageNumber}`, PAGE.width - PAGE.right, footerY, {
      align: 'right',
    });
  };

  const addPage = () => {
    drawFooter();
    doc.addPage();
    pageNumber += 1;
    drawHeader();
  };

  const ensureSpace = (height = 10) => {
    if (y + height > bottomLimit) {
      addPage();
    }
  };

  const addSpace = (height = 2.5) => {
    ensureSpace(height);
    y += height;
  };

  const split = (value, width, size = 9, style = 'normal') => {
    setFont(size, style);
    return doc.splitTextToSize(text(value), width);
  };

  const addSectionTitle = (value, options = {}) => {
    const {
      compact = true,
      keepWithNext = 0,
    } = options;

    const fontSize = compact ? 9.4 : 10;
    const paddingY = compact ? 2.7 : 3.4;
    const lines = split(value, contentWidth - 10, fontSize, 'bold');
    const lineHeight = compact ? 3.8 : 4.2;
    const height = Math.max(
      compact ? 8.5 : 10,
      lines.length * lineHeight + paddingY * 2
    );

    ensureSpace(height + keepWithNext);

    doc.setFillColor(...COLORS.lightGray);
    doc.setDrawColor(...COLORS.border);
    doc.roundedRect(PAGE.left, y, contentWidth, height, 1.2, 1.2, 'FD');

    doc.setFillColor(...COLORS.red);
    doc.rect(PAGE.left, y, 3, height, 'F');

    setFont(fontSize, 'bold', COLORS.black);
    doc.text(lines, PAGE.left + 7, y + paddingY + 2.6, {
      lineHeightFactor: lineHeight / fontSize,
    });

    y += height + (compact ? 2 : 3);
  };

  const addParagraph = (value, options = {}) => {
    const {
      fontSize = 8.7,
      lineHeight = 4.6,
      marginBottom = 3,
      bold = false,
      align = 'left',
      indent = 0,
    } = options;

    const width = contentWidth - indent;
    const style = bold ? 'bold' : 'normal';
    const lines = split(value, width, fontSize, style);

    const topPadding = 1;
    const firstBaselineOffset = fontSize * 0.31;
    const lineCount = Math.max(lines.length, 1);

    const blockHeight =
      topPadding +
      firstBaselineOffset +
      Math.max(0, lineCount - 1) * lineHeight +
      1.8 +
      marginBottom;

    ensureSpace(blockHeight);
    setFont(fontSize, style, COLORS.black);

    let currentY = y + topPadding + firstBaselineOffset;

    for (const line of lines) {
      doc.text(String(line), PAGE.left + indent, currentY, {
        align,
        maxWidth: width,
      });
      currentY += lineHeight;
    }

    y += blockHeight;
  };

  const addField = (label, value, options = {}) => {
    const {
      labelWidth = 72,
      minHeight = 9.5,
      fontSize = 8.5,
      labelFontSize = 8,
      valueBold = false,
    } = options;

    const valueWidth = contentWidth - labelWidth;
    const labelLines = split(label, labelWidth - 6, labelFontSize, 'bold');
    const valueLines = split(value, valueWidth - 6, fontSize, valueBold ? 'bold' : 'normal');

    const labelHeight = labelLines.length * 3.7 + 3.6;
    const valueHeight = valueLines.length * 3.9 + 3.6;
    const rowHeight = Math.max(minHeight, labelHeight, valueHeight);

    ensureSpace(rowHeight);

    doc.setDrawColor(...COLORS.border);
    doc.rect(PAGE.left, y, contentWidth, rowHeight);
    doc.line(PAGE.left + labelWidth, y, PAGE.left + labelWidth, y + rowHeight);

    setFont(labelFontSize, 'bold', COLORS.gray);
    doc.text(labelLines, PAGE.left + 3, y + 4.5, {
      lineHeightFactor: 3.7 / labelFontSize,
    });

    setFont(fontSize, valueBold ? 'bold' : 'normal', COLORS.black);
    doc.text(valueLines, PAGE.left + labelWidth + 3, y + 4.5, {
      lineHeightFactor: 3.9 / fontSize,
    });

    y += rowHeight;
  };

  const addCheckboxRow = (label, checked, options = {}) => {
    const {
      yesLabel = 'TAK',
      noLabel = 'NIE',
    } = options;

    const rightArea = 45;
    const labelWidth = contentWidth - rightArea;
    const lines = split(label, labelWidth - 6, 8.2, 'normal');
    const rowHeight = Math.max(9.5, lines.length * 3.8 + 3.8);

    ensureSpace(rowHeight);

    doc.setDrawColor(...COLORS.border);
    doc.rect(PAGE.left, y, contentWidth, rowHeight);
    doc.line(PAGE.left + labelWidth, y, PAGE.left + labelWidth, y + rowHeight);

    setFont(8.2, 'normal', COLORS.black);
    doc.text(lines, PAGE.left + 3, y + 4.5, {
      lineHeightFactor: 3.8 / 8.2,
    });

    const boxY = y + rowHeight / 2 - 2.3;
    const yesX = PAGE.left + labelWidth + 4;
    const noX = yesX + 20;

    const drawBox = (x, selected, labelText) => {
      doc.setDrawColor(...COLORS.black);
      doc.rect(x, boxY, 4.6, 4.6);

      if (selected) {
        doc.setDrawColor(...COLORS.red);
        doc.setLineWidth(0.7);
        doc.line(x + 0.8, boxY + 2.5, x + 2, boxY + 3.8);
        doc.line(x + 2, boxY + 3.8, x + 4, boxY + 0.8);
        doc.setLineWidth(0.2);
      }

      setFont(8, 'bold', COLORS.black);
      doc.text(labelText, x + 6.5, boxY + 3.7);
    };

    drawBox(yesX, checked === true, yesLabel);
    drawBox(noX, checked === false, noLabel);

    y += rowHeight;
  };

  const addSignature = (signatureDataUrl, options = {}) => {
    const {
      label = 'Podpis pracownika',
      width = 62,
      height = 20,
    } = options;

    const blockHeight = height + 16;
    ensureSpace(blockHeight);

    setFont(8.5, 'bold', COLORS.black);
    doc.text(label, PAGE.left, y + 3.5);

    const imageX = PAGE.left;
    const imageY = y + 6;

    doc.setDrawColor(...COLORS.border);
    doc.roundedRect(imageX, imageY, width, height, 1.2, 1.2);

    if (
      typeof signatureDataUrl === 'string' &&
      signatureDataUrl.startsWith('data:image')
    ) {
      try {
        const format = signatureDataUrl.includes('image/jpeg') ? 'JPEG' : 'PNG';

        doc.addImage(
          signatureDataUrl,
          format,
          imageX + 1.5,
          imageY + 1.5,
          width - 3,
          height - 3,
          undefined,
          'FAST'
        );
      } catch (error) {
        console.warn('Nie udało się dodać podpisu do PDF:', error);
      }
    }

    doc.setDrawColor(...COLORS.black);
    doc.line(imageX, imageY + height + 4, imageX + width, imageY + height + 4);

    setFont(7, 'normal', COLORS.gray);
    doc.text('czytelny podpis', imageX + width / 2, imageY + height + 8, {
      align: 'center',
    });

    y += blockHeight;
  };

  const finish = (fileName = '', outputType = 'blob') => {
    drawFooter();

    doc.setProperties({
      title: text(title, 'Dokument'),
      subject: footerTitle || text(title, 'Dokument'),
      author: companyName,
      creator: 'WeGoJob Portal',
      keywords: 'WeGoJob, dokument pracowniczy',
    });

    if (fileName) {
      doc.save(fileName);
      return doc;
    }

    return doc.output(outputType);
  };

  drawHeader();

  return {
    doc,
    addPage,
    ensureSpace,
    addSpace,
    addSectionTitle,
    addParagraph,
    addField,
    addCheckboxRow,
    addSignature,
    finish,
    getCurrentY: () => y,
  };
}
