from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.services.resume_parser import extract_text_from_pdf

router = APIRouter(
    prefix="/resumes",
    tags=["resumes"],
)

@router.post("/parse")
async def parse_resume(file: UploadFile = File(...)):
    """Upload a PDF resume and parse its text contents."""
    if not file.filename.endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported.",
        )
    try:
        content = await file.read()
        extracted_text = extract_text_from_pdf(content)
        return {
            "filename": file.filename,
            "extracted_text": extracted_text,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error parsing resume: {str(e)}",
        )
