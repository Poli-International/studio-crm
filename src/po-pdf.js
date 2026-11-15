import { jsPDF } from 'jspdf';

// The purchase-order PDF as a data URL. studio = { studioName, studioAddress, studioPhone } from Settings (a line
// the studio has not filled in is left out); money(amount) writes an amount in the studio's currency.
export function poPdfDataUrl(po, items, supplier, studio, money) {
  try {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header Banner
    doc.setFillColor(99, 102, 241);
    doc.rect(0, 0, pageWidth, 60, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('PURCHASE ORDER', 40, 38);

    let y = 85;
    doc.setFontSize(10);
    doc.setTextColor(31, 41, 55);
    doc.setFont('helvetica', 'bold');
    const poDateObj = new Date(po.created_at || Date.now());
    const poDateStr = !isNaN(poDateObj.getTime()) ? poDateObj.toLocaleString() : 'N/A';
    doc.text(`Purchase Order #: ${po.po_number}`, 40, y);
    doc.text(`Date Issued: ${poDateStr}`, pageWidth - 40, y, { align: 'right' });

    y += 20;
    doc.setDrawColor(229, 231, 235);
    doc.line(40, y, pageWidth - 40, y);

    y += 20;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(99, 102, 241);
    doc.text('Supplier Information', 40, y);
    doc.text('Shipping & Studio Details', 300, y);

    y += 15;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(55, 65, 81);
    doc.text(`Company: ${supplier.supplier_name}`, 40, y);
    doc.text(`Email: ${supplier.supplier_email}`, 40, y + 14);
    doc.text(`Contact: ${supplier.contact_person}`, 40, y + 28);
    const studioLines = [['Studio Name', studio.studioName], ['Address', studio.studioAddress], ['Phone', studio.studioPhone]]
      .filter(([, v]) => String(v || '').trim());
    studioLines.forEach(([label, v], i) => doc.text(`${label}: ${String(v).trim()}`, 300, y + 14 * i));
    y += 28;

    y += 25;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(99, 102, 241);
    doc.text('Reorder Items Summary', 40, y);

    y += 12;
    doc.setFillColor(243, 244, 246);
    doc.rect(40, y, pageWidth - 80, 20, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(31, 41, 55);
    doc.text('SKU / Code', 50, y + 14);
    doc.text('Item Description', 140, y + 14);
    doc.text('Current Qty', 310, y + 14);
    doc.text('Order Qty', 380, y + 14);
    doc.text('Est. Cost', 460, y + 14);

    y += 24;
    doc.setFont('helvetica', 'normal');
    let totalCost = 0;
    items.forEach((item, idx) => {
      if (idx % 2 === 1) {
        doc.setFillColor(249, 250, 251);
        doc.rect(40, y - 10, pageWidth - 80, 18, 'F');
      }
      doc.text(String(item.sku || 'SKU-' + item.id), 50, y);
      doc.text(String(item.name || 'Item').slice(0, 26), 140, y);
      doc.text(String(item.currentQty), 310, y);
      doc.text(String(item.orderQty), 380, y);
      const cost = item.estCost || (item.orderQty * (item.price || 15));
      totalCost += cost;
      doc.text(money(cost), 460, y);
      y += 18;
    });

    y += 10;
    doc.line(40, y, pageWidth - 40, y);
    y += 18;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(16, 185, 129);
    doc.text(`Total Order Value: ${money(totalCost)}`, pageWidth - 40, y, { align: 'right' });

    return doc.output('datauristring');
  } catch (err) {
    console.error('PO PDF generation error:', err);
    return null;
  }
}
