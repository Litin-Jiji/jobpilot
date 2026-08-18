import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { TailoredResume } from '../types/resumeBuilder';

export function formatPdfFilename(candidateName?: string, targetRole?: string): string {
  const sanitize = (str?: string) =>
    (str || '')
      .trim()
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');

  const namePart = sanitize(candidateName) || 'Candidate';
  const rolePart = sanitize(targetRole) || 'Resume';

  return `JobPilot_${namePart}_${rolePart}.pdf`;
}

/**
 * Generates and downloads a clean, professional A4 technical resume PDF.
 */
export async function exportResumeToPdf(
  resume: TailoredResume,
  targetJobTitle?: string,
): Promise<void> {
  // Create an isolated container with pure resume styling (no UI controls)
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '794px'; // 210mm at 96 DPI
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#1e293b';
  container.style.fontFamily = "'Georgia', 'Times New Roman', serif";
  container.style.padding = '48px 48px';
  container.style.boxSizing = 'border-box';
  container.style.lineHeight = '1.45';

  const roleHeader = targetJobTitle || 'AI & Software Engineer';

  let html = `
    <div style="margin-bottom: 24px; padding-bottom: 12px; border-bottom: 1.5px solid #334155;">
      <h1 style="font-size: 26px; font-weight: bold; color: #0f172a; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 0.5px;">
        ${resume.name || 'Candidate Name'}
      </h1>
      <div style="font-size: 14px; font-weight: 600; color: #5b5fef; text-transform: uppercase; letter-spacing: 0.5px;">
        ${roleHeader}
      </div>
    </div>
  `;

  // Summary
  if (resume.professional_summary) {
    html += `
      <div style="margin-bottom: 20px; page-break-inside: avoid;">
        <h2 style="font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.8px; color: #0f172a; margin: 0 0 6px 0; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px;">
          Professional Summary
        </h2>
        <p style="font-size: 11.5px; color: #334155; margin: 0; line-height: 1.55; text-align: justify;">
          ${resume.professional_summary}
        </p>
      </div>
    `;
  }

  // Skills
  if (resume.skills && resume.skills.length > 0) {
    html += `
      <div style="margin-bottom: 20px; page-break-inside: avoid;">
        <h2 style="font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.8px; color: #0f172a; margin: 0 0 6px 0; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px;">
          Core & Technical Skills
        </h2>
        <p style="font-size: 11.5px; color: #334155; margin: 0; line-height: 1.6;">
          ${resume.skills.join(' • ')}
        </p>
      </div>
    `;
  }

  // Experience
  if (resume.experience && resume.experience.length > 0) {
    html += `
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.8px; color: #0f172a; margin: 0 0 8px 0; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px;">
          Professional Experience
        </h2>
        ${resume.experience
          .map(
            (exp) => `
          <div style="margin-bottom: 14px; page-break-inside: avoid;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px;">
              <div>
                <strong style="font-size: 12.5px; color: #0f172a;">${exp.role}</strong>
                <span style="font-size: 12px; color: #475569;"> — ${exp.company}</span>
              </div>
              ${exp.duration ? `<span style="font-size: 11px; font-style: italic; color: #64748b;">${exp.duration}</span>` : ''}
            </div>
            <ul style="margin: 4px 0 0 0; padding-left: 18px; font-size: 11.5px; color: #334155;">
              ${exp.bullets
                .map(
                  (b) => `
                <li style="margin-bottom: 3px; line-height: 1.45;">${b}</li>
              `,
                )
                .join('')}
            </ul>
          </div>
        `,
          )
          .join('')}
      </div>
    `;
  }

  // Projects
  if (resume.projects && resume.projects.length > 0) {
    html += `
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.8px; color: #0f172a; margin: 0 0 8px 0; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px;">
          Key Projects
        </h2>
        ${resume.projects
          .map(
            (proj) => `
          <div style="margin-bottom: 12px; page-break-inside: avoid;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px;">
              <strong style="font-size: 12.5px; color: #0f172a;">${proj.name}</strong>
              ${proj.technologies && proj.technologies.length > 0 ? `<span style="font-size: 10.5px; font-family: monospace; color: #475569;">${proj.technologies.join(' · ')}</span>` : ''}
            </div>
            <p style="font-size: 11.5px; color: #334155; margin: 2px 0 0 0; line-height: 1.5;">
              ${proj.description}
            </p>
          </div>
        `,
          )
          .join('')}
      </div>
    `;
  }

  // Education
  if (resume.education && resume.education.length > 0) {
    html += `
      <div style="margin-bottom: 18px; page-break-inside: avoid;">
        <h2 style="font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.8px; color: #0f172a; margin: 0 0 6px 0; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px;">
          Education
        </h2>
        ${resume.education
          .map(
            (edu) => `
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; font-size: 11.5px;">
            <div>
              <strong style="color: #0f172a;">${edu.degree}${edu.field ? ` in ${edu.field}` : ''}</strong>
              <span style="color: #475569;"> • ${edu.institution}</span>
            </div>
            ${edu.duration ? `<span style="font-size: 11px; font-style: italic; color: #64748b;">${edu.duration}</span>` : ''}
          </div>
        `,
          )
          .join('')}
      </div>
    `;
  }

  // Certifications
  if (resume.certifications && resume.certifications.length > 0) {
    html += `
      <div style="margin-bottom: 16px; page-break-inside: avoid;">
        <h2 style="font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.8px; color: #0f172a; margin: 0 0 6px 0; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px;">
          Certifications & Credentials
        </h2>
        <ul style="margin: 4px 0 0 0; padding-left: 18px; font-size: 11.5px; color: #334155;">
          ${resume.certifications
            .map(
              (cert) => `
            <li style="margin-bottom: 2px;">${cert}</li>
          `,
            )
            .join('')}
        </ul>
      </div>
    `;
  }

  container.innerHTML = html;
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2, // 2x scale for sharp print quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Calculate height of image in PDF mm
    const imgHeightInPdf = (canvasHeight * pdfWidth) / canvasWidth;

    let heightLeft = imgHeightInPdf;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeightInPdf);
    heightLeft -= pdfHeight;

    // Additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeightInPdf;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeightInPdf);
      heightLeft -= pdfHeight;
    }

    const filename = formatPdfFilename(resume.name, targetJobTitle);
    pdf.save(filename);
  } finally {
    document.body.removeChild(container);
  }
}
