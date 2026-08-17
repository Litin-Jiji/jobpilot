from fastapi import APIRouter, File, HTTPException, UploadFile

from app.services.resume_parser import extract_text_from_pdf


router = APIRouter(
    prefix="/api/resumes",
    tags=["Resumes"],
)


@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF resumes are supported.",
        )

    file_content = await file.read()

    if not file_content:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty.",
        )

    try:
        extracted_text = extract_text_from_pdf(file_content)

    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail="Unable to process PDF.",
        ) from exc

    if not extracted_text:
        raise HTTPException(
            status_code=422,
            detail="No readable text found in the PDF.",
        )

    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "characters": len(extracted_text),
        "text": extracted_text,
    }