import { jsPDF } from "jspdf";

export async function generatePersonalQuestionnairePdf(
  employee = {},
  data = {},
  signature = ""
) {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const marginLeft = 18;
  const marginRight = 18;
  const contentWidth = pageWidth - marginLeft - marginRight;

  let y = 18;

  const emptyValue = "-";

  const formatValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return emptyValue;
    }

    if (typeof value === "boolean") {
      return value ? "Tak" : "Nie";
    }

    if (Array.isArray(value)) {
      return value.length ? value.join(", ") : emptyValue;
    }

    return String(value);
  };

  const checkPageSpace = (requiredHeight = 10) => {
    if (y + requiredHeight > pageHeight - 18) {
      pdf.addPage();
      y = 20;
    }
  };

  const addSectionTitle = (title) => {
    checkPageSpace(16);

    pdf.setFillColor(235, 235, 235);
    pdf.rect(marginLeft, y - 5, contentWidth, 9, "F");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text(title, marginLeft + 3, y + 1);

    y += 11;
  };

  const addField = (label, value) => {
    const formattedValue = formatValue(value);

    pdf.setFontSize(10);

    const labelWidth = 55;
    const valueWidth = contentWidth - labelWidth - 4;

    const valueLines = pdf.splitTextToSize(
      formattedValue,
      valueWidth
    );

    const rowHeight = Math.max(8, valueLines.length * 5 + 3);

    checkPageSpace(rowHeight);

    pdf.setDrawColor(190, 190, 190);
    pdf.rect(marginLeft, y, labelWidth, rowHeight);
    pdf.rect(
      marginLeft + labelWidth,
      y,
      contentWidth - labelWidth,
      rowHeight
    );

    pdf.setFont("helvetica", "bold");
    pdf.text(label, marginLeft + 2, y + 5);

    pdf.setFont("helvetica", "normal");
    pdf.text(
      valueLines,
      marginLeft + labelWidth + 2,
      y + 5
    );

    y += rowHeight;
  };

  const addAddress = ({
    province,
    postal,
    city,
    municipality,
    street,
  }) => {
    addField("Wojewodztwo", province);
    addField("Kod pocztowy", postal);
    addField("Miejscowosc", city);
    addField("Gmina", municipality);
    addField("Ulica i numer", street);
  };

  // Naglowek
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("WeGoJob", marginLeft, y);

  pdf.setFontSize(14);
  pdf.text(
    "KWESTIONARIUSZ OSOBOWY PRACOWNIKA",
    pageWidth / 2,
    y + 10,
    { align: "center" }
  );

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.text(
    `Data wygenerowania: ${new Date().toLocaleDateString("pl-PL")}`,
    pageWidth - marginRight,
    y + 17,
    { align: "right" }
  );

  y += 28;

  // Dane osobowe
  addSectionTitle("1. DANE OSOBOWE");

  addField(
    "Imie",
    data.firstName || employee.firstName
  );

  addField(
    "Nazwisko",
    data.surname || employee.surname
  );

  addField(
    "Data urodzenia",
    data.birthDate
  );

  addField(
    "Miejsce urodzenia",
    data.birthPlace
  );

  addField(
    "PESEL",
    data.pesel || employee.pesel
  );

  addField(
    "Numer dokumentu",
    data.documentNumber || employee.passportNumber
  );

  addField(
    "Dokument wydany przez",
    data.issuedBy
  );

  // Kontakt
  y += 5;
  addSectionTitle("2. DANE KONTAKTOWE");

  addField(
    "Numer telefonu",
    data.phone || employee.phone
  );

  addField(
    "Messenger / WhatsApp",
    data.messenger
  );

  addField(
    "Adres e-mail",
    data.email || employee.email
  );

  // Rozmiary
  y += 5;
  addSectionTitle("3. ROZMIARY ODZIEZY ROBOCZEJ");

  addField(
    "Wzrost",
    data.height ? `${data.height} cm` : ""
  );

  addField(
    "Rozmiar odziezy",
    data.clothingSize
  );

  addField(
    "Rozmiar obuwia",
    data.shoeSize
  );

  // Adres zameldowania
  y += 5;
  addSectionTitle("4. ADRES ZAMELDOWANIA");

  addAddress({
    province: data.regProvince,
    postal: data.regPostal,
    city: data.regCity,
    municipality: data.regMunicipality,
    street: data.regStreet,
  });

  // Adres zamieszkania
  y += 5;
  addSectionTitle("5. ADRES ZAMIESZKANIA");

  if (data.homeSame) {
    addField(
      "Adres zamieszkania",
      "Taki sam jak adres zameldowania"
    );
  } else {
    addAddress({
      province: data.homeProvince,
      postal: data.homePostal,
      city: data.homeCity,
      municipality: data.homeMunicipality,
      street: data.homeStreet,
    });
  }

  // Oswiadczenie
  y += 5;
  addSectionTitle("6. OSWIADCZENIE PRACOWNIKA");

  const consentText = data.consent
    ? "Pracownik potwierdzil prawdziwosc podanych danych oraz wyrazil zgode na ich przetwarzanie w zakresie niezbednym do zatrudnienia."
    : "Nie potwierdzono zgody pracownika.";

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);

  const consentLines = pdf.splitTextToSize(
    consentText,
    contentWidth
  );

  checkPageSpace(consentLines.length * 5 + 8);
  pdf.text(consentLines, marginLeft, y);
  y += consentLines.length * 5 + 10;

  // Podpis
  addSectionTitle("7. PODPIS PRACOWNIKA");

  if (signature) {
    checkPageSpace(48);

    try {
      pdf.addImage(
        signature,
        "PNG",
        marginLeft,
        y,
        75,
        35
      );

      y += 38;

      pdf.setDrawColor(100, 100, 100);
      pdf.line(marginLeft, y, marginLeft + 80, y);

      pdf.setFontSize(8);
      pdf.text(
        "Czytelny podpis pracownika",
        marginLeft,
        y + 5
      );
    } catch (error) {
      console.error(
        "Nie udalo sie dodac podpisu do PDF:",
        error
      );

      pdf.setFontSize(10);
      pdf.text(
        "Nie udalo sie umiescic podpisu w dokumencie.",
        marginLeft,
        y
      );
    }
  } else {
    checkPageSpace(25);

    y += 15;
    pdf.line(marginLeft, y, marginLeft + 80, y);

    pdf.setFontSize(8);
    pdf.text(
      "Czytelny podpis pracownika",
      marginLeft,
      y + 5
    );
  }

  // Stopka na wszystkich stronach
  const totalPages = pdf.getNumberOfPages();

  for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
    pdf.setPage(pageNumber);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);

    pdf.text(
      `WeGoJob | Kwestionariusz osobowy | Strona ${pageNumber} z ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: "center" }
    );
  }

  return pdf.output("datauristring");
}