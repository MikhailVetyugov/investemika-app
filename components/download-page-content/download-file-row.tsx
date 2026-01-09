'use client'
import { Download } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { LanguageBadge, TypeBadge, PDFBadge, YearBadge } from "@/components/download-page-content/badges";
import { IDownloadFile } from "@/types/download";

interface IDownloadFileRowProps {
  file: IDownloadFile;
}

export const DownloadFileRow: React.FC<IDownloadFileRowProps> = ({ file }) => {
  const href = `/api/download?path=${encodeURIComponent(file.path)}`;

  const handleDownloadClick = () => {
    toast.info("Скачивание скоро начнется", {
      duration: 2500,
    });
  };

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-medium text-lg hover:text-lightblue hover:underline underline-offset-2 transition-colors"
          >
            Отчетность за {file.year} год
          </a>

          <div className="flex flex-wrap items-center gap-2">
            <YearBadge year={file.year} />
            <LanguageBadge language={file.language} />
            <TypeBadge type={file.type} />
            <PDFBadge />
          </div>
        </div>

        <div className="flex-shrink-0">
          <Button asChild size="sm">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="w-full"
              onClick={handleDownloadClick}
            >
              <Download className="h-4 w-4" />
              Скачать
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
