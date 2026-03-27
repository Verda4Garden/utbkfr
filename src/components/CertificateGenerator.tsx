import { useRef } from 'react';
import { motion } from 'motion/react';
import { Award, Download, Share2, Brain, CheckCircle2, X } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';

interface CertificateProps {
  userName: string;
  certificateType: string;
  date: string;
  score?: number;
  onDelete?: () => void;
}

export default function CertificateGenerator({ userName, certificateType, date, score, onDelete }: CertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null);

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;
    
    try {
      const imgData = await htmlToImage.toPng(certificateRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      });
      
      const pdf = new jsPDF('l', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`UTBK_Certificate_${userName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Failed to generate certificate. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden Certificate for Generation */}
      <div className="fixed top-0 left-0 -z-50 opacity-0 pointer-events-none">
        <div 
          ref={certificateRef}
          className="w-[1123px] h-[794px] bg-white p-20 relative overflow-hidden border-[20px] border-[#5A5A40]"
          style={{ fontFamily: 'serif' }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[100px]" style={{ backgroundColor: '#5A5A40' }}></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[100px]" style={{ backgroundColor: '#5A5A40' }}></div>
          </div>

          <div className="relative h-full p-12 flex flex-col items-center justify-between text-center" style={{ border: '4px solid rgba(90, 90, 64, 0.2)' }}>
            <div className="space-y-4">
              <div className="flex justify-center mb-6">
                <div style={{ backgroundColor: '#5A5A40', color: '#ffffff', padding: '1rem', borderRadius: '1.5rem' }}>
                  <Brain size={48} />
                </div>
              </div>
              <h1 className="text-6xl font-bold tracking-tight" style={{ color: '#1a1a1a' }}>SERTIFIKAT PENCAPAIAN</h1>
              <p className="text-xl uppercase tracking-[0.3em] font-sans font-bold" style={{ color: '#6b7280' }}>UTBK SNBT 2026 SIMULATION</p>
            </div>

            <div className="space-y-6">
              <p className="text-2xl italic" style={{ color: '#4b5563' }}>Dengan bangga diberikan kepada:</p>
              <h2 className="text-7xl font-bold underline underline-offset-8 decoration-2" style={{ color: '#5A5A40' }}>{userName}</h2>
              <p className="text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: '#4b5563' }}>
                Atas keberhasilan menyelesaikan simulasi <span className="font-bold" style={{ color: '#1a1a1a' }}>{certificateType}</span> dengan hasil yang sangat memuaskan.
                {score && <span> Skor akhir yang dicapai adalah <span className="font-bold" style={{ color: '#5A5A40' }}>{score}</span>.</span>}
              </p>
            </div>

            <div className="w-full flex justify-between items-end px-12">
              <div className="text-left space-y-2">
                <p className="text-sm uppercase tracking-widest font-bold" style={{ color: '#9ca3af' }}>Tanggal Terbit</p>
                <p className="text-xl font-bold" style={{ color: '#1a1a1a' }}>{date}</p>
              </div>
              <div className="relative">
                <div className="w-32 h-32 rounded-full flex items-center justify-center" style={{ border: '4px solid #5A5A40' }}>
                  <Award size={64} style={{ color: '#5A5A40' }} />
                </div>
                <div className="absolute top-0 left-0 w-full h-full animate-pulse opacity-20">
                  <div className="w-full h-full rounded-full" style={{ border: '8px solid #5A5A40' }}></div>
                </div>
              </div>
              <div className="text-right space-y-2">
                <p className="text-sm uppercase tracking-widest font-bold" style={{ color: '#9ca3af' }}>ID Sertifikat</p>
                <p className="text-xl font-bold" style={{ color: '#1a1a1a' }}>SNBT-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#151619] rounded-[40px] p-8 shadow-xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center gap-8"
      >
        <div className="w-48 h-32 bg-[#F5F5F0] dark:bg-gray-800 rounded-3xl flex items-center justify-center relative overflow-hidden group">
          <Award className="text-[#5A5A40] dark:text-[#8B8B6B] group-hover:scale-110 transition-transform" size={48} />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5"></div>
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-[#5A5A40] dark:text-[#8B8B6B] mb-2">
            <CheckCircle2 size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Certificate Earned</span>
          </div>
          <h3 className="text-2xl font-serif font-bold dark:text-white mb-2">{certificateType}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Diberikan pada {date}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button 
            onClick={downloadCertificate}
            className="flex items-center gap-2 bg-[#5A5A40] text-white px-6 py-3 rounded-2xl font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-[#5A5A40]/20"
          >
            <Download size={18} />
            Download PDF
          </button>
          {onDelete && (
            <button 
              onClick={onDelete}
              className="p-3 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-all"
              title="Hapus Sertifikat"
            >
              <X size={20} />
            </button>
          )}
          <button className="p-3 bg-gray-50 dark:bg-gray-800 text-gray-500 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
            <Share2 size={20} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
