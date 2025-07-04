import { useState, useCallback } from 'react';
import { uploadFileToKnowledge } from '../../services/KnowledgeService';

export const UploadKnowledgeFile = () => {
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
  const [uploadResults, setUploadResults] = useState([]);

  const uploadFiles = useCallback(async (knowledgeId, files, maxConcurrent = 3) => {
    setUploadStatus('uploading');
    setUploadResults([]);
    
    // 初始化上传进度
    const filesArray = Array.from(files)
    const initialProgress = filesArray.reduce((acc, file) => {
      acc[file.name] = 0;
      return acc;
    }, {});
    setUploadProgress(initialProgress);
    
    // 并发控制上传
    const queue = [...files];
    const results = [];
    const activeUploads = [];
    
    const processQueue = async () => {
      while (queue.length > 0) {
        if (activeUploads.length < maxConcurrent) {
          const file = queue.shift();
          const uploadPromise = uploadFile(file).finally(() => {
            activeUploads.splice(activeUploads.indexOf(uploadPromise), 1);
          });
          activeUploads.push(uploadPromise);
        } else {
          await Promise.race(activeUploads);
        }
      }
      await Promise.all(activeUploads);
    };
    
    const uploadFile = async (file) => {
      try {
        const response = await uploadFileToKnowledge(
          knowledgeId, 
          file,
          (fileName, progress) => {
            setUploadProgress(prev => ({ ...prev, [fileName]: progress }));
          }
        );
        
        results.push({
          fileName: file.name,
          status: 'success',
          fileId: response.data.fileId
        });
      } catch (error) {
        results.push({
          fileName: file.name,
          status: 'error',
          error: error.message
        });
      } finally {
        setUploadResults([...results]);
      }
    };
    
    await processQueue();
    setUploadStatus('success');
    return results;
  }, []);

  return {
    uploadFiles,
    uploadProgress,
    uploadStatus,
    uploadResults,
    resetUpload: () => {
      setUploadProgress({});
      setUploadStatus('idle');
      setUploadResults([]);
    }
  };
};