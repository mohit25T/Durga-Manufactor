import html2pdf from 'html2pdf.js';

export const exportToPdf = async (elementId, filename = 'Durga-Quotation.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id #${elementId} not found.`);
    return false;
  }

  const opt = {
    margin: [10, 10, 10, 10], // top, left, bottom, right in mm
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2, // High resolution crisp PDF
      useCORS: true,
      logging: false,
      letterRendering: true,
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  };

  try {
    await html2pdf().set(opt).from(element).save();
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    // Fallback to browser print if html2pdf fails
    window.print();
    return false;
  }
};
