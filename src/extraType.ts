export interface UploadResp {
  resp: {
    message: string;
    raw: File;
    successData: {
      url: string;
      statusCode: number;
    };
  };
}