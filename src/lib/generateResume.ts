import { jsPDF } from "jspdf";
import { RESUME_DATA } from "@/data/resume-data";

export function generateResumePDF() {
    const doc = new jsPDF();
    const margin = 20;
    let y = margin;
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - margin * 2;

    // Helper function to add text with word wrap
    const addText = (text: string, fontSize: number, isBold = false, color = "#000000") => {
        doc.setFontSize(fontSize);
        doc.setFont("helvetica", isBold ? "bold" : "normal");
        doc.setTextColor(color);
        const lines = doc.splitTextToSize(text, contentWidth);
        doc.text(lines, margin, y);
        y += lines.length * (fontSize * 0.4) + 2;
    };

    const addSection = (title: string) => {
        y += 8;
        doc.setDrawColor(100, 100, 100);
        doc.line(margin, y, pageWidth - margin, y);
        y += 6;
        addText(title.toUpperCase(), 12, true, "#333333");
        y += 2;
    };

    const checkPageBreak = (neededSpace: number) => {
        if (y + neededSpace > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            y = margin;
        }
    };

    // Header
    addText(RESUME_DATA.name, 24, true, "#1a1a1a");
    addText(RESUME_DATA.about, 11, false, "#666666");
    y += 2;
    addText(`📍 ${RESUME_DATA.location}  |  📧 ${RESUME_DATA.contact.email}`, 10, false, "#444444");
    addText(`🔗 github.com/nuhmanpk  |  linkedin.com/in/nuhmanpk`, 10, false, "#444444");

    // About
    addSection("About");
    addText(RESUME_DATA.summary, 10, false, "#333333");

    // Work Experience
    addSection("Work Experience");
    RESUME_DATA.work.forEach((work) => {
        checkPageBreak(25);
        addText(`${work.company} - ${work.title}`, 11, true, "#1a1a1a");
        addText(`${work.start} - ${work.end}`, 9, false, "#666666");
        if (work.description) {
            addText(work.description, 10, false, "#333333");
        }
        y += 4;
    });

    // Education
    addSection("Education");
    RESUME_DATA.education.forEach((edu) => {
        checkPageBreak(20);
        addText(edu.school, 11, true, "#1a1a1a");
        addText(edu.degree, 10, false, "#333333");
        addText(`${edu.start} - ${edu.end}`, 9, false, "#666666");
        y += 4;
    });

    // Skills
    addSection("Skills");
    const skillsText = RESUME_DATA.skills.join("  •  ");
    addText(skillsText, 10, false, "#333333");

    // Projects (featured only)
    addSection("Featured Projects");
    const featuredProjects = RESUME_DATA.projects.filter((p: { featured?: boolean }) => p.featured);
    featuredProjects.forEach((project: { title: string; description: string; techStack: readonly string[] }) => {
        checkPageBreak(20);
        addText(project.title, 11, true, "#1a1a1a");
        addText(project.techStack.join(", "), 9, false, "#666666");
        if (project.description) {
            addText(project.description, 10, false, "#333333");
        }
        y += 4;
    });

    // Certifications (featured only)
    addSection("Certifications");
    const featuredCerts = RESUME_DATA.certifications.filter((c: { featured?: boolean }) => c.featured);
    featuredCerts.forEach((cert: { title: string; techStack: readonly string[] }) => {
        checkPageBreak(15);
        addText(cert.title, 10, true, "#1a1a1a");
        addText(cert.techStack.join(" | "), 9, false, "#666666");
        y += 2;
    });

    // Footer
    y = doc.internal.pageSize.getHeight() - 15;
    doc.setFontSize(8);
    doc.setTextColor("#999999");
    doc.text("Generated from nuhmanpk.github.io/portfolio", margin, y);

    // Save
    doc.save("Nuhman_PK_Resume.pdf");
}
