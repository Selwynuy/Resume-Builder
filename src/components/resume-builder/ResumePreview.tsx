import { ResumeData } from '@/components/resume-builder/types';
import { sanitizeTemplateContent } from '@/lib/security';
import { renderTemplate } from '@/lib/template-renderer';
import type { Template } from '@/lib/templates';

interface ResumePreviewProps {
  resumeData: ResumeData;
  selectedTemplate: Template | null;
}

export const ResumePreview = ({ resumeData, selectedTemplate }: ResumePreviewProps) => {
  const getResumePreview = () => {
    try {
      if (selectedTemplate?.htmlTemplate && selectedTemplate?.cssStyles) {
        return renderTemplate(
          selectedTemplate.htmlTemplate, 
          selectedTemplate.cssStyles, 
          resumeData,
          true // Enable preview mode
        );
      }
      
      return '<div style="padding: 2rem; text-align: center; color: #666;"><h3>No Template Selected</h3><p>Please select a template to view preview</p></div>';
    } catch (error: unknown) {
      // All console.error statements removed for production
      return '<div style="padding: 2rem; text-align: center; color: #666;"><h3>Preview Unavailable</h3><p>Unable to render resume preview</p></div>';
    }
  };

  const preview = getResumePreview();
  const previewHtml = typeof preview === 'string' ? sanitizeTemplateContent(preview) : sanitizeTemplateContent(preview.html);
  const previewCss = typeof preview === 'string' ? '' : preview.css || '';

  return (
    <div className="order-1 lg:order-2">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
          <h4 className="font-semibold text-slate-800 flex items-center">
            <span className="text-lg mr-2">👁️</span>
            Resume Preview
          </h4>
        </div>
        
        <div className="p-4">
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <style>{previewCss}</style>
            <div 
              className="transform scale-75 origin-top-left"
              style={{ 
                width: '133.33%', // Compensate for scale-75 (100/75 = 133.33)
                height: 'auto'
              }}
            >
              <div
                style={{ 
                  width: '612px', // 8.5 inches at 72 DPI
                  minHeight: '792px', // 11 inches at 72 DPI
                  padding: '36px', // 0.5 inch margins
                  fontSize: '12px',
                  lineHeight: '1.4',
                  fontFamily: 'Arial, sans-serif'
                }}
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 