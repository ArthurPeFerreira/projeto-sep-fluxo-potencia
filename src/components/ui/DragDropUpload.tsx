"use client";

import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import { toast } from "sonner";

interface DragDropUploadProps<T extends boolean = false> {
  accept: "image/*" | "application/pdf" | "text/*";
  multiple?: T;
  value?: T extends true ? File[] | null : File | null;
  setValue?: (files: T extends true ? File[] | null : File | null) => void;
  maxFileSize?: number;
}

const getAcceptedFormats = (accept: string) => {
  if (accept === "image/*") return "JPG, PNG, GIF, WEBP";
  if (accept === "application/pdf") return "PDF";
  if (accept === "text/*") return "TXT, CSV";
  return accept;
};

export function DragDropUpload<T extends boolean = false>({
  accept,
  multiple = false as T,
  value,
  setValue,
  maxFileSize,
}: DragDropUploadProps<T>) {
  const files = useMemo(() => {
    if (multiple) {
      return (value as File[] | null) ?? [];
    } else {
      return (value as File | null) && (value as File).size > 0
        ? [value as File]
        : [];
    }
  }, [value, multiple]);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrls, setImageUrls] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const newImageUrls = new Map<string, string>();

    files.forEach((file, index) => {
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        newImageUrls.set(index.toString(), url);
      }
    });

    setImageUrls(newImageUrls);

    return () => {
      newImageUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [files]);

  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }, []);

  const updateFiles = useCallback(
    (newFiles: File[]) => {
      if (setValue) {
        if (multiple) {
          setValue(newFiles as T extends true ? File[] | null : File | null);
        } else {
          setValue(
            (newFiles[0] || new File([], "")) as T extends true
              ? File[] | null
              : File | null
          );
        }
      }
    },
    [setValue, multiple]
  );

  const handleFileSelect = useCallback(
    (fileList: FileList | null) => {
      if (fileList) {
        const allFiles = Array.from(fileList);
        const validFiles: File[] = [];
        const rejectedFiles: string[] = [];

        const typeValidFiles = allFiles.filter((file) => {
          if (accept === "image/*") {
            return file.type.startsWith("image/");
          }
          return file.type.startsWith(accept);
        });

        typeValidFiles.forEach((file) => {
          if (maxFileSize && file.size > maxFileSize) {
            rejectedFiles.push(`${file.name} (${formatFileSize(file.size)})`);
          } else {
            validFiles.push(file);
          }
        });

        if (rejectedFiles.length > 0) {
          const maxSizeFormatted = formatFileSize(maxFileSize || 0);
          toast.error(
            `Arquivo(s) rejeitado(s) por exceder o tamanho máximo de ${maxSizeFormatted}.`
          );

          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }

        if (validFiles.length > 0) {
          if (multiple) {
            const currentFiles = (value as File[] | null) ?? [];
            updateFiles([...currentFiles, ...validFiles]);
          } else {
            updateFiles([validFiles[0]]);
          }
        }

        if (
          validFiles.length === 0 &&
          allFiles.length > 0 &&
          rejectedFiles.length === 0
        ) {
          toast.error(
            "Formato de arquivo não suportado. Formatos aceitos: " +
              getAcceptedFormats(accept)
          );

          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      }
    },
    [multiple, updateFiles, accept, maxFileSize, value, formatFileSize]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileSelect(e.target.files);
    },
    [handleFileSelect]
  );

  const removeFile = useCallback(
    (index: number) => {
      const imageUrl = imageUrls.get(index.toString());
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }

      const newFiles = files.filter((_, i: number) => i !== index);
      updateFiles(newFiles);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [updateFiles, imageUrls, files]
  );

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver && "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-2">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Arraste seus arquivos aqui, ou{" "}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-500 hover:underline cursor-pointer"
            >
              clique aqui
            </button>{" "}
            para selecioná-los
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Formatos aceitos: {getAcceptedFormats(accept)}
            {maxFileSize && ` (máx. ${formatFileSize(maxFileSize)})`}
            {multiple && " (múltiplos arquivos)"}
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {files.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">
            {multiple ? "Arquivos selecionados:" : "Arquivo selecionado:"}
          </h3>
          <div
            className={`grid gap-3 ${
              files.length === 1
                ? "grid-cols-1 max-w-xs"
                : files.length === 2
                ? "grid-cols-2"
                : files.length <= 4
                ? "grid-cols-2 md:grid-cols-3"
                : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            }`}
          >
            {files.map((file, index) => (
              <div key={index} className="relative group">
                {file.type.startsWith("image/") ? (
                  (() => {
                    const imageUrl = imageUrls.get(index.toString());
                    return imageUrl ? (
                      <div
                        className={`relative overflow-hidden rounded-lg border ${
                          files.length === 1 ? "aspect-square" : "aspect-video"
                        }`}
                      >
                        <Image
                          src={imageUrl}
                          alt={file.name}
                          fill
                          className="object-contain p-2"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        className={`flex items-center justify-center rounded-lg border ${
                          files.length === 1 ? "aspect-square" : "aspect-video"
                        }`}
                      >
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    );
                  })()
                ) : (
                  <div
                    className={`flex items-center justify-center rounded-lg border ${
                      files.length === 1 ? "aspect-square" : "aspect-video"
                    }`}
                  >
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 cursor-pointer bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <IoMdClose size={16} />
                </button>
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
