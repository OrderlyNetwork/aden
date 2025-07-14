import { postUploadImage } from '../api/upload';

class CustomUploadAdapter {
  loader: any;

  constructor(loader: any) {
    this.loader = loader;
  }

  upload() {
    console.log("upload 호출");
    return new Promise((resolve, reject) => {
      this.loader.file.then(async (file: any) => {
        
        // 파일 업로드를 위한 로직을 작성해야 합니다.
        const response = await postUploadImage(file).catch((err: any) => {
          resolve({ default: 'http://121.142.204.10:8081/files/e0c138e8-ac11-4a61-a291-d776bff62bbe/download' });
        });

        // 아래 코드는 Blob URL을 생성하며 이를 사용하여 이미지를 삽입합니다.
        resolve({ default: `http://121.142.204.10:8081/files/${response.file_id}/download` });
      });
    });
  }

  abort() {
    // 파일 전송이 중단될 때 처리하는 로직을 작성해야 합니다.
  }
}

export default CustomUploadAdapter;