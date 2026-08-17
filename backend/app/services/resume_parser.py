from io import BytesIO

from pypdf import PdfReader


def extract_text_from_pdf(file_content: bytes) -> str:
    pdf_stream = BytesIO(file_content)
    reader = PdfReader(pdf_stream)

    extracted_pages = []

    for page in reader.pages:
        text = page.extract_text()

        if text:
            extracted_pages.append(text)

    return "\n".join(extracted_pages).strip()